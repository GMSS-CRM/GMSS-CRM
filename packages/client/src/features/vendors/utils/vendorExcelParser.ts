import * as XLSX from "xlsx";

/**
 * Represents a single vendor row parsed from Excel.
 * Minimal shape targeting company creation only.
 */
export interface VendorExcelRow {
  /** Client-side unique key for table selection */
  _key: string;
  companyName: string;
  companyType: "Vendor" | "Consultant";
  contactName?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
  panNumber?: string;
  address?: string;
}

/** Column header aliases (case-insensitive, trimmed) */
const COL = {
  COMPANY_NAME: "Company Name",
  COMPANY_TYPE: "Company Type",
  CONTACT_NAME: "Contact Name",
  PHONE: "Phone",
  EMAIL: "Email",
  GST: "GST Number",
  PAN: "PAN Number",
  ADDRESS: "Address",
} as const;

const clean = (v: unknown): string =>
  String(v ?? "")
    .replace(/\u00A0/g, " ")
    .trim();

/** Normalise header → canonical key using fuzzy matching */
function resolveHeader(raw: string): string | null {
  const h = raw
    .replace(/\u00A0/g, " ")
    .trim()
    .toLowerCase();

  if (h.includes("company") && h.includes("name")) return COL.COMPANY_NAME;
  if (h.includes("company") && h.includes("type")) return COL.COMPANY_TYPE;
  if (h.includes("contact")) return COL.CONTACT_NAME;
  if (h === "phone" || h.includes("phone")) return COL.PHONE;
  if (h === "email" || h.includes("email")) return COL.EMAIL;
  if (h.includes("gst")) return COL.GST;
  if (h.includes("pan")) return COL.PAN;
  if (h.includes("address")) return COL.ADDRESS;
  return null;
}

/**
 * Parse an Excel file into an array of VendorExcelRow.
 * Only "Company Name" column is mandatory.
 */
export async function parseVendorExcel(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<VendorExcelRow[]> {
  const buffer = await file.arrayBuffer();
  onProgress?.(0.1);

  const workbook = XLSX.read(buffer, { type: "array" });
  onProgress?.(0.2);

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("Excel file has no sheets");

  const sheet = workbook.Sheets[sheetName];
  const rawData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
  });
  onProgress?.(0.3);

  if (!rawData.length) throw new Error("Excel file contains no data");

  // Build header map from first row's keys
  const headerMap = new Map<string, string>(); // raw key → canonical
  for (const rawKey of Object.keys(rawData[0])) {
    const canonical = resolveHeader(rawKey);
    if (canonical) headerMap.set(rawKey, canonical);
  }

  // Validate required column
  const hasName = [...headerMap.values()].includes(COL.COMPANY_NAME);
  if (!hasName) {
    throw new Error(
      'Missing required column "Company Name". Your Excel must have at least a "Company Name" column.',
    );
  }

  const get = (row: Record<string, unknown>, canonical: string): string => {
    for (const [rawKey, mapped] of headerMap) {
      if (mapped === canonical) return clean(row[rawKey]);
    }
    return "";
  };

  const results: VendorExcelRow[] = [];
  const total = rawData.length;
  const yieldEvery = Math.max(50, Math.min(100, Math.ceil(total / 10)));

  for (let i = 0; i < total; i++) {
    const row = rawData[i];
    const companyName = get(row, COL.COMPANY_NAME);
    if (!companyName) continue; // skip blank rows

    const rawType = get(row, COL.COMPANY_TYPE).toLowerCase();
    const companyType: VendorExcelRow["companyType"] =
      rawType.includes("consultant") ? "Consultant" : "Vendor";

    results.push({
      _key: crypto.randomUUID(),
      companyName,
      companyType,
      contactName: get(row, COL.CONTACT_NAME) || undefined,
      phone: get(row, COL.PHONE) || undefined,
      email: get(row, COL.EMAIL) || undefined,
      gstNumber: get(row, COL.GST) || undefined,
      panNumber: get(row, COL.PAN) || undefined,
      address: get(row, COL.ADDRESS) || undefined,
    });

    if (i % yieldEvery === 0) {
      onProgress?.(0.3 + ((i + 1) / total) * 0.69);
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  onProgress?.(1);
  return results;
}
