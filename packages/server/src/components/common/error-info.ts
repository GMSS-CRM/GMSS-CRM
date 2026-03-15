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
  VENDOR_FINAL_REQUIRES_SIGNED_AGREEMENT: 'Vendor cannot move to FINAL unless agreement is SIGNED',

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

  // Vendor Tag errors
  TAG_ID_REQUIRED: 'Tag ID is required',

  // Vendor Agreement errors
  AGREEMENT_NOT_FOUND: 'Agreement not found',
  AGREEMENT_VENDOR_ID_REQUIRED: 'VendorId is required for agreement',
  ACCEPTED_PROPOSAL_REQUIRED: 'Agreement cannot be created unless proposal is ACCEPTED',
  AGREEMENT_UPDATE_FAILED: 'Agreement not found after update',

  // Vendor Approval errors
  APPROVAL_NOT_FOUND: 'Approval not found',
  APPROVAL_ALREADY_DECIDED: 'Approval already decided',
  APPROVAL_ALREADY_EXISTS: 'Approval request already exists for this vendor',

  // Vendor FollowUp errors
  FOLLOWUP_NOT_FOUND: 'FollowUp not found',
  FOLLOWUP_ALREADY_COMPLETED: 'FollowUp already completed',
  FOLLOWUP_UPDATE_FAILED: 'FollowUp update failed',

  // Vendor Proposal errors
  PROPOSAL_NOT_FOUND: 'Proposal not found',
  PROPOSAL_UPDATE_FAILED: 'Failed to update proposal',
  PROPOSAL_ALREADY_EXISTS: 'A proposal already exists for this vendor',

  // Vendor Tender errors
  TENDER_PARTICIPATION_NOT_FOUND: 'Tender participation not found',
  TENDER_PARTICIPATION_UPDATE_FAILED: 'Tender participation update failed',
  VENDOR_ALREADY_PARTICIPATING: 'Vendor is already participating in this tender',

  // Vendor Workflow errors
  VENDOR_STATUS_SAME: 'Vendor already in this status',
  VENDOR_WORKFLOW_UPDATE_FAILED: 'Failed to update vendor status workflow',

  // Vendor MD Request errors
  MD_REQUEST_NOT_FOUND: 'MD request not found',
  MD_REQUEST_ALREADY_RESOLVED: 'MD request is already resolved',
  MD_REQUEST_PENDING_EXISTS: 'A pending MD request already exists for this vendor',
  MD_REQUEST_VENDOR_NOT_INTERESTED: 'Vendor must be in INTERESTED status to send to MD',
  MD_REQUEST_ID_REQUIRED: 'Request ID is required',

  // Post Award errors
  POST_AWARD_NOT_FOUND: 'Post award record not found',
  POST_AWARD_DOCUMENT_NOT_FOUND: 'Post award document not found',
  POST_AWARD_FOLLOWUP_NOT_FOUND: 'Post award follow-up not found',
  POST_AWARD_FOLLOWUP_COMPLETED: 'Follow-up is already completed',
  POST_AWARD_STAGE_INVALID: 'Invalid post award stage transition',

  // Activity Log errors
  ACTIVITY_LOG_TENDER_REQUIRED: 'Tender ID is required for activity log',
  ACTIVITY_LOG_ACTION_REQUIRED: 'Action is required for activity log',
};

export default ErrorInfo;
