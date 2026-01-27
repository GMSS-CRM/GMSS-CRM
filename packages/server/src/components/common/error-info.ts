export const ErrorInfo = {
  // Auth & Authorization
  MISSING_AUTHORIZATION: 'Authorization header is missing',
  TOKEN_INVALID: 'Not a valid token',
  TOKEN_MUST_CONTAIN_IDENTIFIER: 'Token must contain email',
  UNAUTHORIZED: 'User does not have permission to access the dashboard',

  // User errors
  USER_NOT_FOUND: 'User not found',
  FIRST_NAME_REQUIRED: 'First name is required',
  EMAIL_REQUIRED: 'Email is required',

  // Role errors
  ROLE_NAME_REQUIRED: 'Role name is required',
  ROLE_ID_NOT_EXIST: 'Provided roleId does not exist',
  ROLE_NOT_EXIST: 'Provided role does not exist',

  // Permission errors
  AT_LEAST_ONE_PERMISSION: 'At least one permission is required',

  // Tag errors
  TAG_NAME_REQUIRED: 'Tag name is required',
  TAG_ALREADY_EXISTS: 'Tag with this name already exists',
  TAG_NOT_FOUND: 'Tag not found',

  // Vendor errors
  VENDOR_NAME_REQUIRED: 'Vendor name is required',
  VENDOR_ALREADY_EXISTS: 'Vendor with this name already exists',
  VENDOR_NOT_FOUND: 'Vendor not found',
  NO_VENDORS_TO_DELETE: 'No vendors to delete',

  // Vendor Contact Person errors
  VENDOR_ID_REQUIRED: 'Vendor ID is required',
  CONTACT_PERSON_NAME_REQUIRED: 'Contact person name is required',
  PHONE_NUMBER_REQUIRED: 'Phone number is required',
  CONTACT_PERSON_NOT_FOUND: 'Contact person not found',
  NO_CONTACT_PERSONS_TO_DELETE: 'No contact persons to delete',

  // Vendor Document errors
  DOCUMENT_NAME_REQUIRED: 'Document name is required',
  DOCUMENT_URL_REQUIRED: 'Document URL is required',
  DOCUMENT_NOT_FOUND: 'Document not found',
  NO_DOCUMENTS_TO_DELETE: 'No documents to delete',

  // Tender errors
  TENDER_NAME_REQUIRED: 'Tender name is required',
  TENDER_ALREADY_EXISTS: 'Tender with this name already exists',
  TENDER_NOT_FOUND: 'Tender not found',
  NO_TENDERS_TO_DELETE: 'No tenders to delete',

  // Tender Document errors
  TENDER_ID_REQUIRED: 'Tender ID is required',
  TENDER_DOCUMENT_NOT_FOUND: 'Tender document not found',
  NO_TENDER_DOCUMENTS_TO_DELETE: 'No tender documents to delete',
};

export default ErrorInfo;
