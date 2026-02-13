# PR: Implement Excel Parsing for Tender Workflow

## Title
feat: Add Excel import functionality for Tender Workflow with data validation and UI improvements

## Description

### Overview
This PR implements comprehensive Excel file parsing functionality for the Tender Workflow feature, allowing users to import tender data from Excel files with proper validation, type safety, and improved UI presentation.

### Changes Made

#### 1. Excel Parsing Implementation
- **New Type Definition**: Added `TenderWorkflowItem` interface to handle Excel-imported data structure
  - Maps to fixed Excel column format (Deptt./Rly. Unit, Tender No, Tender Title, Status, Opening Date/Time, Due Date/Time, Due Days)
  - Auto-generates unique IDs using `crypto.randomUUID()`
  - Automatically assigns `workflowStatus: "DRAFT"` to all imported items

- **Excel Parser (`excelParser.ts`)**:
  - Uses `xlsx` library for robust Excel file parsing
  - Cleans column names by removing non-breaking spaces (`\u00A0`) and trimming whitespace
  - Validates required columns exist before processing
  - Parses first sheet only
  - Ignores "Actions" column as specified
  - Comprehensive error handling with user-friendly messages
  - Type-safe implementation with TypeScript

- **Upload Component (`ExcelUploadSelection.tsx`)**:
  - Replaced mock data with actual Excel parsing
  - Accepts `.xlsx` and `.xls` files only
  - File size validation (max 10MB)
  - Real-time parsing progress feedback
  - Success/error notifications with detailed messages
  - Clean UI with upload/parsed states

#### 2. Data Structure Improvements
- **Simplified Tender Interface**: Removed unnecessary fields that don't align with Excel import workflow:
  - Removed `estimatedValue` (not provided in Excel format)
  - Removed `publishDate` (not part of core workflow)
  - Kept essential fields: name, reference number, department, status, tags, documents, deadlines

- **Removed Dummy Data**: 
  - Cleared all mock/dummy tender data from initial state
  - Application now starts with clean slate
  - Data only appears when imported from Excel or manually created

#### 3. UI Enhancements
- **WorkspaceGrid Improvements**:
  - Removed "Value" column (no longer applicable)
  - Added color-coded "Deadline" column with visual urgency indicators:
    - Red for past deadlines
    - Orange for urgent (≤3 days)
    - Green for normal deadlines
  - Improved column widths for better readability
  - Enhanced Department column with tooltips
  - Styled Updated column with subtle gray color
  - Better visual hierarchy with font weights and colors

- **TenderPreviewTable**:
  - Built from scratch to display Excel-imported data
  - Shows all relevant columns: Tender Title, Tender No, Department, Status, Opening, Due Date/Time, Days
  - Color-coded status tags (Published = green)
  - Color-coded "Days" tags (≤2 days = red, ≤5 days = orange, >5 days = blue)
  - Row selection for bulk import to draft
  - Clean, modern table design matching Ant Design standards

#### 4. Workflow Integration
- **Hook Updates (`useTenderWorkflow.ts`)**:
  - Updated `parseExcelData()` to accept `TenderWorkflowItem[]`
  - Enhanced `addSelectedToDraft()` to map Excel data to Tender model
  - Added `parseDateString()` helper to parse Excel date format ("DD/MM/YYYY HH:mm")
  - Improved type safety across all Excel-related operations
  - Description field auto-populated with Excel metadata for traceability

#### 5. Type Safety & Validation
- All Excel parsing operations are fully typed
- Runtime validation ensures required columns exist
- Graceful error handling prevents crashes from malformed files
- Type guards and error messages guide users to correct file format

### Technical Details

**Dependencies Added**:
- `xlsx` - Excel file parsing library (already installed)

**Files Changed**:
- `packages/client/src/features/tender-workflow/utils/excelParser.ts` - Complete rewrite
- `packages/client/src/features/tender-workflow/types/tender.types.ts` - Added TenderWorkflowItem, updated Tender interface
- `packages/client/src/features/tender-workflow/components/ExcelUploadSelection.tsx` - Integrated real parser
- `packages/client/src/features/tender-workflow/components/TenderPreviewTable.tsx` - Complete redesign for new data
- `packages/client/src/features/tender-workflow/components/WorkspaceGrid.tsx` - UI improvements, removed Value column
- `packages/client/src/features/tender-workflow/hooks/useTenderWorkflow.ts` - Updated for new types, removed dummy data

### Testing Recommendations
1. Upload a valid Excel file with the specified column format
2. Verify column name cleaning handles non-breaking spaces
3. Test file size validation (>10MB should error)
4. Test invalid file format handling
5. Verify deadline color coding in WorkspaceGrid
6. Test bulk selection and import from preview table
7. Verify empty state shows when no data exists
8. Test date parsing for various date formats from Excel

### Breaking Changes
None - This is a new feature addition with backward-compatible changes to existing types.

### UI Screenshots
_(Upload would show before/after screenshots of:)_
- Excel upload flow
- Preview table with parsed data
- WorkspaceGrid with improved columns and color coding
- Empty state when no tenders exist

### Future Enhancements
- Support for multiple Excel formats/templates
- Batch validation before import
- Duplicate detection based on Tender No
- Export functionality to Excel
- Column mapping UI for flexible Excel formats
