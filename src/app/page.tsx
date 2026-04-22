/**
 * Root Page - Redirect to Default Locale
 * 
 * This page handles the root path (/) and redirects to the
 * default locale (/es). The middleware handles locale detection
 * from cookies or Accept-Language header.
 * 
 * For static export compatibility, we render the Spanish version
 * directly at the root path.
 */

import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect to default locale
  redirect("/es");
}
