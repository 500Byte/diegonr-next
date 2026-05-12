/**
 * Resolves a localized field from a Sanity document or object.
 * Following the pattern {field}_{locale} used in this project.
 * 
 * @param obj The object containing localized fields
 * @param field The base field name (e.g., 'title')
 * @param locale The current locale (e.g., 'es', 'en')
 * @param fallback Optional fallback value if neither localized nor base field exists
 * @returns The resolved field value or fallback
 */
export function resolveI18n<T>(obj: any, field: string, locale: string, fallback?: T): T {
  const localeKey = `${field}_${locale}`;
  
  // Try the localized version first (e.g., field_es)
  if (obj?.[localeKey] !== undefined && obj?.[localeKey] !== null) {
    return obj[localeKey];
  }
  
  // Fallback to the base field name if it exists (e.g., field)
  if (obj?.[field] !== undefined && obj?.[field] !== null) {
    return obj[field];
  }
  
  return fallback as T;
}
