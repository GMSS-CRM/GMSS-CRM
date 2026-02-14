import * as XLSX from "xlsx";
import type { TenderWorkflowItem } from "../types/tender.types";

/**
 * Clean column name by removing non-breaking spaces and trimming
 */
const cleanKey = (key: string): string => 
  key.replace(/\u00A0/g, " ").trim();

/**
 * Expected column names in the Excel file
 */
const EXPECTED_COLUMNS = {
  DEPARTMENT: "Deptt./Rly. Unit",
  TENDER_NO: "Tender No",
  TENDER_TITLE: "Tender Title",
  STATUS: "Status",
  OPENING_DATE_TIME: "Opening Date/Time",
  DUE_DATE_TIME: "Due Date/Time",
  DUE_DAYS: "Due Days",
  ACTIONS: "Actions", // This column will be ignored
};

/**
 * Validate that all required columns exist in the parsed data
 */
const validateColumns = (row: any): boolean => {
  const requiredColumns = [
    EXPECTED_COLUMNS.DEPARTMENT,
    EXPECTED_COLUMNS.TENDER_NO,
    EXPECTED_COLUMNS.TENDER_TITLE,
    EXPECTED_COLUMNS.STATUS,
    EXPECTED_COLUMNS.OPENING_DATE_TIME,
    EXPECTED_COLUMNS.DUE_DATE_TIME,
    EXPECTED_COLUMNS.DUE_DAYS,
  ];

  return requiredColumns.every(col => col in row);
};

/**
 * Parse Excel file containing tender data
 * @param file - Excel file to parse
 * @returns Array of TenderWorkflowItem objects
 * @throws Error if file parsing fails or required columns are missing
 */
export const parseTenderExcel = async (file: File): Promise<TenderWorkflowItem[]> => {
  try {
    // Read file as array buffer
    const buffer = await file.arrayBuffer();
    
    // Parse workbook
    const workbook = XLSX.read(buffer, { type: "array" });
    
    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error("Excel file has no sheets");
    }
    
    const sheet = workbook.Sheets[firstSheetName];
    
    // Convert sheet to JSON with empty string default for missing values
    const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rawData || rawData.length === 0) {
      throw new Error("Excel file contains no data");
    }

    // Process each row
    const tenderItems: TenderWorkflowItem[] = rawData.map((rawRow: any) => {
      // Clean all keys by removing non-breaking spaces and trimming
      const cleanedRow: Record<string, any> = {};
      Object.keys(rawRow).forEach((key) => {
        cleanedRow[cleanKey(key)] = rawRow[key];
      });

      // Validate that required columns exist
      if (!validateColumns(cleanedRow)) {
        const missingCols = Object.values(EXPECTED_COLUMNS)
          .filter(col => col !== EXPECTED_COLUMNS.ACTIONS && !(col in cleanedRow))
          .join(", ");
        throw new Error(
          `Missing required columns: ${missingCols}. Please ensure Excel file has correct column headers.`
        );
      }

      // Extract and clean values
      const department = String(cleanedRow[EXPECTED_COLUMNS.DEPARTMENT] || "").trim();
      const tenderNo = String(cleanedRow[EXPECTED_COLUMNS.TENDER_NO] || "").trim();
      const tenderTitle = String(cleanedRow[EXPECTED_COLUMNS.TENDER_TITLE] || "").trim();
      const statusFromExcel = String(cleanedRow[EXPECTED_COLUMNS.STATUS] || "").trim();
      const openingDateTime = String(cleanedRow[EXPECTED_COLUMNS.OPENING_DATE_TIME] || "").trim();
      const dueDateTime = String(cleanedRow[EXPECTED_COLUMNS.DUE_DATE_TIME] || "").trim();
      const dueDays = Number(cleanedRow[EXPECTED_COLUMNS.DUE_DAYS]) || 0;

      // Generate unique ID using crypto.randomUUID()
      const id = crypto.randomUUID();

      // Return mapped tender workflow item
      return {
        id,
        department,
        tenderNo,
        tenderTitle,
        statusFromExcel,
        openingDateTime,
        dueDateTime,
        dueDays,
        workflowStatus: "DRAFT" as const,
      };
    });

    return tenderItems;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
    throw new Error("Failed to parse Excel file: Unknown error");
  }
};
