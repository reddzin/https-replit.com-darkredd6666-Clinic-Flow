/** Converts a clinic display name to a URL-safe slug.
 *  "Clínica São Lucas" → "clinica-sao-lucas"
 */
export function generateSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip combining diacritics (accents)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")      // remove anything that isn't alphanum, space or hyphen
    .trim()
    .replace(/\s+/g, "-")              // spaces → hyphens
    .replace(/-+/g, "-");              // collapse consecutive hyphens
}

export interface ClinicData {
  clinicName: string;
  clinicSlug: string;
  email: string;
  token: string;
}

const STORAGE_KEY = "medflow_user";

export function getClinicData(): ClinicData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ClinicData;
  } catch {
    return null;
  }
}

export function saveClinicData(data: ClinicData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
