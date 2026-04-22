#!/usr/bin/env node
/**
 * translate-i18n.mjs
 * 
 * Translates es.json → en.json using DeepL API.
 * Preserves JSON structure, skips keys that are already in English
 * or shouldn't be translated (URLs, emails, IDs, etc.).
 * 
 * Usage:
 *   DEEPL_API_KEY=your_key node translate-i18n.mjs
 *   DEEPL_API_KEY=your_key node translate-i18n.mjs --dry-run
 *   DEEPL_API_KEY=your_key node translate-i18n.mjs --namespace Hero
 * 
 * Options:
 *   --dry-run       Muestra qué se traduciría sin llamar a la API
 *   --namespace X   Solo traduce el namespace especificado (ej: Hero, Navigation)
 *   --force         Sobreescribe claves que ya existen en en.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const CONFIG = {
  sourceFile: path.join(__dirname, "messages/es.json"),
  targetFile: path.join(__dirname, "messages/en.json"),
  deeplApiUrl: "https://api-free.deepl.com/v2/translate", // Cambiar a api.deepl.com si tenés plan Pro
  sourceLang: "ES",
  targetLang: "EN-US",
  batchSize: 50, // DeepL acepta hasta 50 textos por request
};

// Claves que NO deben traducirse (por patrón de nombre de clave)
const SKIP_KEY_PATTERNS = [
  /^(href|url|src|link|email|phone|id|slug|key)$/i,
  /Url$/i,
  /Email$/i,
  /Phone$/i,
  /Id$/i,
];

// Valores que NO deben traducirse (por patrón de contenido)
const SKIP_VALUE_PATTERNS = [
  /^https?:\/\//,          // URLs
  /^mailto:/,              // emails
  /^[A-Z0-9_]+$/,          // strings puramente en mayúsculas (constantes)
  /^\d+$/,                 // números puros
  /^#[0-9a-fA-F]{3,6}$/,  // colores hex
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isForce = args.includes("--force");
const namespaceFilter = (() => {
  const idx = args.indexOf("--namespace");
  return idx !== -1 ? args[idx + 1] : null;
})();

function log(msg, type = "info") {
  const prefix = { info: "→", ok: "✓", skip: "○", warn: "⚠", error: "✗" }[type];
  console.log(`${prefix} ${msg}`);
}

function shouldSkipKey(key) {
  return SKIP_KEY_PATTERNS.some((p) => p.test(key));
}

function shouldSkipValue(value) {
  if (typeof value !== "string" || value.trim() === "") return true;
  return SKIP_VALUE_PATTERNS.some((p) => p.test(value.trim()));
}

/**
 * Aplana un objeto JSON anidado a un array de { path, value }
 * path = "Hero.description_1"
 */
function flattenObject(obj, prefix = "") {
  const result = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result.push(...flattenObject(value, fullPath));
    } else if (typeof value === "string") {
      result.push({ path: fullPath, value });
    }
  }
  return result;
}

/**
 * Reconstruye un objeto anidado desde un array de { path, value }
 */
function setNestedValue(obj, path, value) {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// ─── DEEPL API ───────────────────────────────────────────────────────────────

async function translateBatch(texts, apiKey) {
  const response = await fetch(CONFIG.deeplApiUrl, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      source_lang: CONFIG.sourceLang,
      target_lang: CONFIG.targetLang,
      // Preservar el formato de las variables {variable} de next-intl
      tag_handling: "xml",
      ignore_tags: ["x"],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepL API error ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.translations.map((t) => t.text);
}

// next-intl usa {variable} para interpolación — hay que protegerlos
// antes de enviar a DeepL y restaurarlos después
function protectVariables(text) {
  const vars = [];
  const protected_ = text.replace(/\{([^}]+)\}/g, (match, name) => {
    vars.push({ match, name });
    return `<x id="${vars.length - 1}"/>`;
  });
  return { protected: protected_, vars };
}

function restoreVariables(text, vars) {
  return text.replace(/<x id="(\d+)"\/>/g, (_, idx) => vars[idx].match);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey && !isDryRun) {
    console.error("✗ Falta DEEPL_API_KEY. Usá: DEEPL_API_KEY=tu_key node translate-i18n.mjs");
    console.error("  Para modo sin API: node translate-i18n.mjs --dry-run");
    process.exit(1);
  }

  // Leer archivos fuente
  if (!fs.existsSync(CONFIG.sourceFile)) {
    console.error(`✗ No se encontró ${CONFIG.sourceFile}`);
    process.exit(1);
  }

  const sourceJson = JSON.parse(fs.readFileSync(CONFIG.sourceFile, "utf-8"));
  const targetJson = fs.existsSync(CONFIG.targetFile)
    ? JSON.parse(fs.readFileSync(CONFIG.targetFile, "utf-8"))
    : {};

  log(`Fuente: ${CONFIG.sourceFile}`);
  log(`Destino: ${CONFIG.targetFile}`);
  if (isDryRun) log("Modo DRY RUN activo — no se llama a la API", "warn");
  if (namespaceFilter) log(`Filtrando namespace: ${namespaceFilter}`);
  if (isForce) log("Modo --force: sobreescribe claves existentes", "warn");
  console.log("");

  // Aplanar todas las claves
  const allEntries = flattenObject(sourceJson);

  // Filtrar por namespace si corresponde
  const entries = namespaceFilter
    ? allEntries.filter((e) => e.path.startsWith(namespaceFilter + "."))
    : allEntries;

  // Separar las que se traducen de las que se copian/saltan
  const toTranslate = [];
  const toCopy = [];
  const toSkip = [];

  for (const entry of entries) {
    const leafKey = entry.path.split(".").pop();
    const alreadyExists = getNestedValue(targetJson, entry.path) !== undefined;

    if (alreadyExists && !isForce) {
      toSkip.push({ ...entry, reason: "ya existe en en.json" });
      continue;
    }

    if (shouldSkipKey(leafKey)) {
      toCopy.push({ ...entry, reason: `clave ignorada (${leafKey})` });
      continue;
    }

    if (shouldSkipValue(entry.value)) {
      toCopy.push({ ...entry, reason: "valor no traducible" });
      continue;
    }

    toTranslate.push(entry);
  }

  // Resumen
  log(`Total claves: ${entries.length}`);
  log(`A traducir: ${toTranslate.length}`, "ok");
  log(`A copiar sin traducir: ${toCopy.length}`, "skip");
  log(`Ya existentes (saltadas): ${toSkip.length}`, "skip");
  console.log("");

  if (isDryRun) {
    console.log("── CLAVES A TRADUCIR ──────────────────────────────────────");
    toTranslate.forEach((e) => console.log(`  ${e.path}: "${e.value}"`));
    console.log("\n── CLAVES A COPIAR ────────────────────────────────────────");
    toCopy.forEach((e) => console.log(`  ${e.path}: "${e.value}" (${e.reason})`));
    console.log("\n✓ Dry run completo. Sin cambios.");
    return;
  }

  // Copiar claves no traducibles directamente
  for (const entry of toCopy) {
    setNestedValue(targetJson, entry.path, entry.value);
  }

  // Traducir en batches
  if (toTranslate.length > 0) {
    log(`Traduciendo en batches de ${CONFIG.batchSize}...`);

    // Proteger variables de next-intl {variable}
    const protectedEntries = toTranslate.map((entry) => ({
      ...entry,
      ...protectVariables(entry.value),
    }));

    const batches = [];
    for (let i = 0; i < protectedEntries.length; i += CONFIG.batchSize) {
      batches.push(protectedEntries.slice(i, i + CONFIG.batchSize));
    }

    let translated = 0;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      log(`Batch ${i + 1}/${batches.length} (${batch.length} textos)...`);

      try {
        const texts = batch.map((e) => e.protected);
        const results = await translateBatch(texts, apiKey);

        for (let j = 0; j < batch.length; j++) {
          const entry = batch[j];
          const translatedText = restoreVariables(results[j], entry.vars);
          setNestedValue(targetJson, entry.path, translatedText);
          translated++;
        }

        log(`Batch ${i + 1} completo`, "ok");

        // Rate limiting: esperar entre batches
        if (i < batches.length - 1) {
          await new Promise((r) => setTimeout(r, 300));
        }
      } catch (err) {
        log(`Error en batch ${i + 1}: ${err.message}`, "error");
        log("Guardando progreso antes de salir...", "warn");
        break;
      }
    }

    log(`Traducidas: ${translated}/${toTranslate.length}`, "ok");
  }

  // Escribir archivo de salida
  fs.writeFileSync(
    CONFIG.targetFile,
    JSON.stringify(targetJson, null, 2) + "\n",
    "utf-8"
  );

  log(`\n✓ Archivo generado: ${CONFIG.targetFile}`, "ok");
  log("Próximo paso: auditar manualmente Hero, About, y copy de servicios.", "warn");
}

main().catch((err) => {
  console.error("✗ Error fatal:", err);
  process.exit(1);
});
