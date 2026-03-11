import type { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _FieldSet: { input: any; output: any; }
};

export const ApprovalStatus = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED'
} as const;

export type ApprovalStatus = typeof ApprovalStatus[keyof typeof ApprovalStatus];
export type AssignPermissionsInput = {
  permissions: Array<Permission>;
  roleId: Scalars['ID']['input'];
};

export type ChangeTenderStatusInput = {
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  status: TenderStatus;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  tenderId: Scalars['ID']['input'];
};

export type ChangeVendorStatusInput = {
  newStatus: VendorStatus;
  remarks?: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['ID']['input'];
};

export type CommissionBreakdown = {
  __typename?: 'CommissionBreakdown';
  baseAmount: Scalars['Float']['output'];
  commissionAmount: Scalars['Float']['output'];
  gstAmount: Scalars['Float']['output'];
  totalAmount: Scalars['Float']['output'];
};

export const CommissionStructure = {
  FULL_ON_PAYMENT: 'FULL_ON_PAYMENT',
  SPLIT_50_50: 'SPLIT_50_50'
} as const;

export type CommissionStructure = typeof CommissionStructure[keyof typeof CommissionStructure];
export const CommissionType = {
  FIXED: 'FIXED',
  PERCENTAGE: 'PERCENTAGE'
} as const;

export type CommissionType = typeof CommissionType[keyof typeof CommissionType];
export const CompanyType = {
  Approved: 'Approved',
  Draft: 'Draft',
  Rejected: 'Rejected',
  Submitted: 'Submitted'
} as const;

export type CompanyType = typeof CompanyType[keyof typeof CompanyType];
export type CreateAgreementInput = {
  agreementEndDate: Scalars['String']['input'];
  agreementStartDate: Scalars['String']['input'];
  commissionStructure?: InputMaybe<CommissionStructure>;
  commissionType?: InputMaybe<CommissionType>;
  commissionValue?: InputMaybe<Scalars['Float']['input']>;
  gstApplicable?: InputMaybe<Scalars['Boolean']['input']>;
  hasOtherBenefits?: InputMaybe<Scalars['Boolean']['input']>;
  otherBenefitsDescription?: InputMaybe<Scalars['String']['input']>;
  paymentAmount?: InputMaybe<Scalars['Float']['input']>;
  paymentFrequency?: InputMaybe<PaymentFrequency>;
  vendorId: Scalars['ID']['input'];
};

export type CreateApprovalInput = {
  vendorId: Scalars['ID']['input'];
};

export type CreateFollowUpInput = {
  courierDeliveryRemarks?: InputMaybe<Scalars['String']['input']>;
  courierProvider?: InputMaybe<Scalars['String']['input']>;
  courierTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  nextFollowUpDate?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  type: FollowUpType;
  vendorId: Scalars['ID']['input'];
};

export type CreateMdRequestInput = {
  empId?: InputMaybe<Scalars['String']['input']>;
  empRemark?: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['ID']['input'];
};

export type CreatePaymentTermInput = {
  agreementDate?: InputMaybe<Scalars['String']['input']>;
  benefitDetails?: InputMaybe<Scalars['String']['input']>;
  commissionStructure?: InputMaybe<Scalars['String']['input']>;
  companyType: Scalars['String']['input'];
  fillAmount?: InputMaybe<Scalars['String']['input']>;
  otherBenefits?: InputMaybe<Scalars['Boolean']['input']>;
  paymentTermType: Scalars['String']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CreateProposalInput = {
  remarks?: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['ID']['input'];
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTagInput = {
  name: Scalars['String']['input'];
};

export type CreateTenderDocumentInput = {
  documentName: Scalars['String']['input'];
  documentUrl: Scalars['String']['input'];
  expiresOn?: InputMaybe<Scalars['String']['input']>;
  tenderId: Scalars['ID']['input'];
};

export type CreateTenderInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  issuingDepartment?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  submissionDeadline?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTendersBatchResult = {
  __typename?: 'CreateTendersBatchResult';
  created: Array<Tender>;
  skipped: Array<SkippedTenderInfo>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateVendorContactPersonInput = {
  bcc?: InputMaybe<Scalars['String']['input']>;
  cc?: InputMaybe<Scalars['String']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type CreateVendorContactPersonStandaloneInput = {
  bcc?: InputMaybe<Scalars['String']['input']>;
  cc?: InputMaybe<Scalars['String']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  vendorId: Scalars['ID']['input'];
};

export type CreateVendorDocumentInput = {
  documentName: Scalars['String']['input'];
  documentUrl: Scalars['String']['input'];
  expiresOn?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVendorInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  agreementWith?: InputMaybe<Scalars['String']['input']>;
  cinNumber?: InputMaybe<Scalars['String']['input']>;
  contactPersons?: InputMaybe<Array<CreateVendorContactPersonInput>>;
  documents?: InputMaybe<Array<CreateVendorDocumentInput>>;
  gstNumber?: InputMaybe<Scalars['String']['input']>;
  isRailwayLinked?: InputMaybe<Scalars['Boolean']['input']>;
  msmeUdyamNumber?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  panNumber?: InputMaybe<Scalars['String']['input']>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVendorTagInput = {
  enableMail?: InputMaybe<Scalars['Boolean']['input']>;
  tagId: Scalars['ID']['input'];
  vendorId: Scalars['ID']['input'];
};

export type DecideApprovalInput = {
  approvalId: Scalars['ID']['input'];
  remarks?: InputMaybe<Scalars['String']['input']>;
  status: ApprovalStatus;
};

export const FollowUpStatus = {
  COMPLETED: 'COMPLETED',
  COURIER_DISPATCHED: 'COURIER_DISPATCHED',
  PENDING: 'PENDING',
  YES_RECEIVED: 'YES_RECEIVED'
} as const;

export type FollowUpStatus = typeof FollowUpStatus[keyof typeof FollowUpStatus];
export const FollowUpType = {
  DIGITAL_SIGNATURE_COURIER: 'DIGITAL_SIGNATURE_COURIER',
  EMAIL: 'EMAIL',
  HARD_COPY_COURIER: 'HARD_COPY_COURIER'
} as const;

export type FollowUpType = typeof FollowUpType[keyof typeof FollowUpType];
export type GenerateUploadUrlInput = {
  contentType: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  folder: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignPermissions: RolePermissionResult;
  changeTenderStatus: Tender;
  changeVendorStatus: Vendor;
  createMdRequest: VendorMdRequest;
  createPaymentTerm: PaymentTerm;
  createRole: Role;
  createTag: Tag;
  createTender: Tender;
  createTenderDocument: TenderDocument;
  createTendersBatch: CreateTendersBatchResult;
  createUser: User;
  createVendor: Vendor;
  createVendorAgreement: VendorAgreement;
  createVendorContactPerson: VendorContactPerson;
  createVendorFollowUp: VendorFollowUp;
  createVendorProposal: VendorProposal;
  createVendorTag: VendorTag;
  decideVendorApproval: Vendor;
  deletePaymentTerm: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteTag: Scalars['Boolean']['output'];
  deleteTags: Scalars['Boolean']['output'];
  deleteTender: Scalars['Boolean']['output'];
  deleteTenderDocument: Scalars['Boolean']['output'];
  deleteTenderDocuments: Scalars['Boolean']['output'];
  deleteTenders: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  deleteUsers: Scalars['Boolean']['output'];
  deleteVendor: Scalars['Boolean']['output'];
  deleteVendorContactPerson: Scalars['Boolean']['output'];
  deleteVendorContactPersons: Scalars['Boolean']['output'];
  deleteVendorDocument: Scalars['Boolean']['output'];
  deleteVendorDocuments: Scalars['Boolean']['output'];
  deleteVendorFollowUp: Scalars['Boolean']['output'];
  deleteVendorTag: Scalars['Boolean']['output'];
  deleteVendors: Scalars['Boolean']['output'];
  generatePresignedUploadUrl: UploadUrlResult;
  participateInTender: VendorTender;
  requestVendorApproval: VendorApproval;
  resolveMdRequest: VendorMdRequest;
  updateAgreementSignature: VendorAgreement;
  updatePaymentTerm: PaymentTerm;
  updateRole: Role;
  updateTag: Tag;
  updateTender: Tender;
  updateTenderDocument: TenderDocument;
  updateTenderParticipation: VendorTender;
  updateUser: User;
  updateVendor: Vendor;
  updateVendorContactPerson: VendorContactPerson;
  updateVendorDocument: VendorDocument;
  updateVendorFollowUp: VendorFollowUp;
  updateVendorProposalStatus: VendorProposal;
  updateVendorTagEmail: VendorTag;
  uploadVendorDocument: VendorDocument;
};


export type MutationAssignPermissionsArgs = {
  input: AssignPermissionsInput;
};


export type MutationChangeTenderStatusArgs = {
  input: ChangeTenderStatusInput;
};


export type MutationChangeVendorStatusArgs = {
  input: ChangeVendorStatusInput;
};


export type MutationCreateMdRequestArgs = {
  input: CreateMdRequestInput;
};


export type MutationCreatePaymentTermArgs = {
  input: CreatePaymentTermInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateTenderArgs = {
  input: CreateTenderInput;
};


export type MutationCreateTenderDocumentArgs = {
  input: CreateTenderDocumentInput;
};


export type MutationCreateTendersBatchArgs = {
  inputs: Array<CreateTenderInput>;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateVendorArgs = {
  input: CreateVendorInput;
};


export type MutationCreateVendorAgreementArgs = {
  input: CreateAgreementInput;
};


export type MutationCreateVendorContactPersonArgs = {
  input: CreateVendorContactPersonStandaloneInput;
};


export type MutationCreateVendorFollowUpArgs = {
  input: CreateFollowUpInput;
};


export type MutationCreateVendorProposalArgs = {
  input: CreateProposalInput;
};


export type MutationCreateVendorTagArgs = {
  input: CreateVendorTagInput;
};


export type MutationDecideVendorApprovalArgs = {
  input: DecideApprovalInput;
};


export type MutationDeletePaymentTermArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTagsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteTenderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTenderDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTenderDocumentsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteTendersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUsersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteVendorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorContactPersonArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorContactPersonsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteVendorDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorDocumentsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteVendorFollowUpArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVendorsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationGeneratePresignedUploadUrlArgs = {
  input: GenerateUploadUrlInput;
};


export type MutationParticipateInTenderArgs = {
  input: ParticipateInTenderInput;
};


export type MutationRequestVendorApprovalArgs = {
  input: CreateApprovalInput;
};


export type MutationResolveMdRequestArgs = {
  input: ResolveMdRequestInput;
};


export type MutationUpdateAgreementSignatureArgs = {
  input: UpdateSignatureInput;
};


export type MutationUpdatePaymentTermArgs = {
  input: UpdatePaymentTermInput;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationUpdateTagArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTagInput;
};


export type MutationUpdateTenderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTenderInput;
};


export type MutationUpdateTenderDocumentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTenderDocumentInput;
};


export type MutationUpdateTenderParticipationArgs = {
  input: UpdateTenderParticipationInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationUpdateVendorArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorInput;
};


export type MutationUpdateVendorContactPersonArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorContactPersonStandaloneInput;
};


export type MutationUpdateVendorDocumentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVendorDocumentStandaloneInput;
};


export type MutationUpdateVendorFollowUpArgs = {
  input: UpdateFollowUpInput;
};


export type MutationUpdateVendorProposalStatusArgs = {
  input: UpdateProposalStatusInput;
};


export type MutationUpdateVendorTagEmailArgs = {
  enableMail: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUploadVendorDocumentArgs = {
  input: UploadVendorDocumentInput;
};

export type ParticipateInTenderInput = {
  quotedAmount: Scalars['Float']['input'];
  tenderId: Scalars['ID']['input'];
  vendorId: Scalars['ID']['input'];
};

export const PaymentFrequency = {
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  YEARLY: 'YEARLY'
} as const;

export type PaymentFrequency = typeof PaymentFrequency[keyof typeof PaymentFrequency];
export type PaymentScheduleItem = {
  __typename?: 'PaymentScheduleItem';
  baseAmount: Scalars['Float']['output'];
  dueDate: Scalars['String']['output'];
  gstAmount: Scalars['Float']['output'];
  installmentNumber: Scalars['Int']['output'];
  totalAmount: Scalars['Float']['output'];
};

export type PaymentScheduleResponse = {
  __typename?: 'PaymentScheduleResponse';
  frequency: PaymentFrequency;
  schedule: Array<PaymentScheduleItem>;
  totalInstallments: Scalars['Int']['output'];
};

export type PaymentTerm = {
  __typename?: 'PaymentTerm';
  agreementDate?: Maybe<Scalars['String']['output']>;
  benefitDetails?: Maybe<Scalars['String']['output']>;
  commissionStructure?: Maybe<Scalars['String']['output']>;
  companyType: Scalars['String']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate: Scalars['String']['output'];
  fillAmount?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  otherBenefits: Scalars['Boolean']['output'];
  paymentTermType: Scalars['String']['output'];
  vendorId: Scalars['ID']['output'];
};

export const Permission = {
  CREATE_ROLE: 'CREATE_ROLE',
  CREATE_USER: 'CREATE_USER',
  DELETE_ROLE: 'DELETE_ROLE',
  DELETE_USER: 'DELETE_USER',
  READ_APP_SETTING: 'READ_APP_SETTING',
  READ_ROLE: 'READ_ROLE',
  READ_USER: 'READ_USER',
  UPDATE_APP_SETTING: 'UPDATE_APP_SETTING',
  UPDATE_ROLE: 'UPDATE_ROLE',
  UPDATE_USER: 'UPDATE_USER'
} as const;

export type Permission = typeof Permission[keyof typeof Permission];
export const ProposalStatus = {
  ACCEPTED: 'ACCEPTED',
  DRAFT: 'DRAFT',
  PENDING_RESPONSE: 'PENDING_RESPONSE',
  REJECTED: 'REJECTED',
  SENT: 'SENT'
} as const;

export type ProposalStatus = typeof ProposalStatus[keyof typeof ProposalStatus];
export type Query = {
  __typename?: 'Query';
  calculateVendorCommission: CommissionBreakdown;
  generateVendorPaymentSchedule: PaymentScheduleResponse;
  getActivePendingRequest?: Maybe<VendorMdRequest>;
  getMdRequestsByVendor: Array<VendorMdRequest>;
  getPaymentTermsByVendor: Array<PaymentTerm>;
  getPendingMdRequests: Array<VendorMdRequest>;
  getPermissionsByRoleId: Array<Permission>;
  getResolvedMdRequests: Array<VendorMdRequest>;
  getRoleById?: Maybe<Role>;
  getSharedTenders: Array<VendorTender>;
  getTagById?: Maybe<Tag>;
  getTenderById?: Maybe<Tender>;
  getTenderDocumentById?: Maybe<TenderDocument>;
  getTendersByTag: Array<Tender>;
  getUserById?: Maybe<User>;
  getVendorApprovals: Array<VendorApproval>;
  getVendorById?: Maybe<Vendor>;
  getVendorContactPersonById?: Maybe<VendorContactPerson>;
  getVendorDocumentById?: Maybe<VendorDocument>;
  getVendorFollowUps: Array<VendorFollowUp>;
  getVendorProposals: Array<VendorProposal>;
  getVendorTenders: Array<VendorTender>;
  getVendorWorkflow: Array<VendorWorkflow>;
  getVendorsByTag: Array<Vendor>;
  searchRoles: Array<Role>;
  searchTags: Array<Tag>;
  searchTenderDocuments: Array<TenderDocument>;
  searchTenders: Array<Tender>;
  searchUsers: Array<User>;
  searchVendorContactPersons: Array<VendorContactPerson>;
  searchVendorDocuments: Array<VendorDocument>;
  searchVendors: Array<Vendor>;
};


export type QueryCalculateVendorCommissionArgs = {
  baseAmount: Scalars['Float']['input'];
  commissionType: CommissionType;
  commissionValue: Scalars['Float']['input'];
  gstApplicable: Scalars['Boolean']['input'];
};


export type QueryGenerateVendorPaymentScheduleArgs = {
  frequency: PaymentFrequency;
  gstApplicable: Scalars['Boolean']['input'];
  startDate: Scalars['String']['input'];
  totalAmount: Scalars['Float']['input'];
};


export type QueryGetActivePendingRequestArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryGetMdRequestsByVendorArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryGetPaymentTermsByVendorArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryGetPermissionsByRoleIdArgs = {
  roleId: Scalars['ID']['input'];
};


export type QueryGetRoleByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetSharedTendersArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryGetTagByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTenderByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTenderDocumentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTendersByTagArgs = {
  tagId: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVendorApprovalsArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryGetVendorByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVendorContactPersonByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVendorDocumentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVendorFollowUpsArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryGetVendorProposalsArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryGetVendorTendersArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryGetVendorWorkflowArgs = {
  vendorId: Scalars['ID']['input'];
};


export type QueryGetVendorsByTagArgs = {
  tagId: Scalars['ID']['input'];
};


export type QuerySearchRolesArgs = {
  searchInput?: InputMaybe<SearchRoleInput>;
};


export type QuerySearchTagsArgs = {
  searchInput?: InputMaybe<SearchTagInput>;
};


export type QuerySearchTenderDocumentsArgs = {
  searchInput?: InputMaybe<SearchTenderDocumentInput>;
};


export type QuerySearchTendersArgs = {
  searchInput?: InputMaybe<SearchTenderInput>;
};


export type QuerySearchUsersArgs = {
  searchInput?: InputMaybe<SearchUserInput>;
};


export type QuerySearchVendorContactPersonsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerySearchVendorDocumentsArgs = {
  searchInput?: InputMaybe<SearchVendorDocumentInput>;
};


export type QuerySearchVendorsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<VendorStatus>;
};

export type ResolveMdRequestInput = {
  approved: Scalars['Boolean']['input'];
  mdId?: InputMaybe<Scalars['String']['input']>;
  mdRemark?: InputMaybe<Scalars['String']['input']>;
  requestId: Scalars['ID']['input'];
};

export type Role = {
  __typename?: 'Role';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedBy: Scalars['String']['output'];
  updatedDate: Scalars['String']['output'];
};

export type RolePermissionResult = {
  __typename?: 'RolePermissionResult';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  permissions: Array<Permission>;
  roleId: Scalars['ID']['output'];
};

export type SearchRoleInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SearchTagInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SearchTenderDocumentInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  tenderId?: InputMaybe<Scalars['ID']['input']>;
};

export type SearchTenderInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TenderStatus>;
};

export type SearchUserInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SearchVendorDocumentInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  vendorId?: InputMaybe<Scalars['ID']['input']>;
};

export const SignatureStatus = {
  EXPIRED: 'EXPIRED',
  PENDING: 'PENDING',
  SIGNED: 'SIGNED'
} as const;

export type SignatureStatus = typeof SignatureStatus[keyof typeof SignatureStatus];
export type SkippedTenderInfo = {
  __typename?: 'SkippedTenderInfo';
  name: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  referenceNumber?: Maybe<Scalars['String']['output']>;
};

export type Tag = {
  __typename?: 'Tag';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  enabledMailCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  tenderCount: Scalars['Int']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
  vendorCount: Scalars['Int']['output'];
};

export type Tender = {
  __typename?: 'Tender';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  deletedBy?: Maybe<Scalars['String']['output']>;
  deletedDate?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  documents?: Maybe<Array<TenderDocument>>;
  id: Scalars['ID']['output'];
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  issuingDepartment?: Maybe<Scalars['String']['output']>;
  mailSentAt?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  referenceNumber?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status: TenderStatus;
  submissionDeadline?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<TenderTag>>;
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
};

export type TenderDocument = {
  __typename?: 'TenderDocument';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  documentName: Scalars['String']['output'];
  documentUrl: Scalars['String']['output'];
  expiresOn?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  tenderId: Scalars['ID']['output'];
};

export const TenderParticipationStatus = {
  PARTICIPATED: 'PARTICIPATED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED'
} as const;

export type TenderParticipationStatus = typeof TenderParticipationStatus[keyof typeof TenderParticipationStatus];
export const TenderStatus = {
  DOCS_UPLOADED: 'DOCS_UPLOADED',
  DRAFT: 'DRAFT',
  MAIL_SENT: 'MAIL_SENT',
  MD_TAGGED: 'MD_TAGGED',
  NIT_UPLOADED: 'NIT_UPLOADED',
  NIT_VERIFIED: 'NIT_VERIFIED',
  PENDING_MD_TAGGING: 'PENDING_MD_TAGGING',
  READY_FOR_NIT: 'READY_FOR_NIT',
  READY_TO_MAIL: 'READY_TO_MAIL',
  REJECTED: 'REJECTED'
} as const;

export type TenderStatus = typeof TenderStatus[keyof typeof TenderStatus];
export type TenderTag = {
  __typename?: 'TenderTag';
  id: Scalars['ID']['output'];
  tag?: Maybe<Tag>;
  tagId: Scalars['ID']['output'];
  tenderId: Scalars['ID']['output'];
};

export type UpdateFollowUpInput = {
  courierDeliveryRemarks?: InputMaybe<Scalars['String']['input']>;
  courierProvider?: InputMaybe<Scalars['String']['input']>;
  courierTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  documentName?: InputMaybe<Scalars['String']['input']>;
  documentUrl?: InputMaybe<Scalars['String']['input']>;
  followUpId: Scalars['ID']['input'];
  followUpStatus?: InputMaybe<FollowUpStatus>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  nextFollowUpDate?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePaymentTermInput = {
  agreementDate?: InputMaybe<Scalars['String']['input']>;
  benefitDetails?: InputMaybe<Scalars['String']['input']>;
  commissionStructure?: InputMaybe<Scalars['String']['input']>;
  fillAmount?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  otherBenefits?: InputMaybe<Scalars['Boolean']['input']>;
  paymentTermType?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProposalStatusInput = {
  followUpDate?: InputMaybe<Scalars['String']['input']>;
  proposalId: Scalars['ID']['input'];
  remarks?: InputMaybe<Scalars['String']['input']>;
  status: ProposalStatus;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSignatureInput = {
  agreementId: Scalars['ID']['input'];
  signatureStatus: SignatureStatus;
  signedDate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTagInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenderDocumentInput = {
  documentName?: InputMaybe<Scalars['String']['input']>;
  documentUrl?: InputMaybe<Scalars['String']['input']>;
  expiresOn?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenderInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  issuingDepartment?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
  submissionDeadline?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenderParticipationInput = {
  participationId: Scalars['ID']['input'];
  status: TenderParticipationStatus;
};

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateVendorContactPersonInput = {
  bcc?: InputMaybe<Scalars['String']['input']>;
  cc?: InputMaybe<Scalars['String']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorContactPersonStandaloneInput = {
  bcc?: InputMaybe<Scalars['String']['input']>;
  cc?: InputMaybe<Scalars['String']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorDocumentInput = {
  documentName?: InputMaybe<Scalars['String']['input']>;
  documentUrl?: InputMaybe<Scalars['String']['input']>;
  expiresOn?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateVendorDocumentStandaloneInput = {
  documentName?: InputMaybe<Scalars['String']['input']>;
  documentUrl?: InputMaybe<Scalars['String']['input']>;
  expiresOn?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  agreementWith?: InputMaybe<Scalars['String']['input']>;
  cinNumber?: InputMaybe<Scalars['String']['input']>;
  contactPersons?: InputMaybe<Array<UpdateVendorContactPersonInput>>;
  documents?: InputMaybe<Array<UpdateVendorDocumentInput>>;
  gstNumber?: InputMaybe<Scalars['String']['input']>;
  isRailwayLinked?: InputMaybe<Scalars['Boolean']['input']>;
  msmeUdyamNumber?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  panNumber?: InputMaybe<Scalars['String']['input']>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UploadUrlResult = {
  __typename?: 'UploadUrlResult';
  key: Scalars['String']['output'];
  publicUrl: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type UploadVendorDocumentInput = {
  documentName: Scalars['String']['input'];
  documentUrl: Scalars['String']['input'];
  expiresOn?: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  role: Role;
  roleId?: Maybe<Scalars['ID']['output']>;
  updatedBy: Scalars['String']['output'];
  updatedDate: Scalars['String']['output'];
};

export type Vendor = {
  __typename?: 'Vendor';
  address?: Maybe<Scalars['String']['output']>;
  agreementWith?: Maybe<Scalars['String']['output']>;
  agreements?: Maybe<Array<VendorAgreement>>;
  approvals?: Maybe<Array<VendorApproval>>;
  cinNumber?: Maybe<Scalars['String']['output']>;
  contactPersons?: Maybe<Array<VendorContactPerson>>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate: Scalars['String']['output'];
  documents?: Maybe<Array<VendorDocument>>;
  followUps?: Maybe<Array<VendorFollowUp>>;
  gstNumber?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isRailwayLinked: Scalars['Boolean']['output'];
  msmeUdyamNumber?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  panNumber?: Maybe<Scalars['String']['output']>;
  paymentTerms?: Maybe<Array<PaymentTerm>>;
  proposals?: Maybe<Array<VendorProposal>>;
  status: VendorStatus;
  tags?: Maybe<Array<VendorTag>>;
  tenders?: Maybe<Array<VendorTender>>;
  type?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
  workflows?: Maybe<Array<VendorWorkflow>>;
};

export type VendorAgreement = {
  __typename?: 'VendorAgreement';
  agreementEndDate: Scalars['String']['output'];
  agreementStartDate: Scalars['String']['output'];
  commissionStructure?: Maybe<CommissionStructure>;
  commissionType?: Maybe<CommissionType>;
  commissionValue?: Maybe<Scalars['Float']['output']>;
  createdDate: Scalars['String']['output'];
  gstApplicable: Scalars['Boolean']['output'];
  hasOtherBenefits: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  otherBenefitsDescription?: Maybe<Scalars['String']['output']>;
  paymentAmount?: Maybe<Scalars['Float']['output']>;
  paymentFrequency?: Maybe<PaymentFrequency>;
  renewalReminderDate?: Maybe<Scalars['String']['output']>;
  signatureStatus: SignatureStatus;
  signedDate?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
  vendorId: Scalars['ID']['output'];
};

export type VendorApproval = {
  __typename?: 'VendorApproval';
  approvedBy?: Maybe<Scalars['String']['output']>;
  approvedDate?: Maybe<Scalars['String']['output']>;
  createdDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  remarks?: Maybe<Scalars['String']['output']>;
  status: ApprovalStatus;
  vendorId: Scalars['ID']['output'];
};

export type VendorContactPerson = {
  __typename?: 'VendorContactPerson';
  bcc?: Maybe<Scalars['String']['output']>;
  cc?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  designation?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
  vendorId: Scalars['ID']['output'];
};

export type VendorDocument = {
  __typename?: 'VendorDocument';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  documentName: Scalars['String']['output'];
  documentUrl: Scalars['String']['output'];
  expiresOn?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
  vendorId: Scalars['ID']['output'];
};

export type VendorFollowUp = {
  __typename?: 'VendorFollowUp';
  autoMailSent: Scalars['Boolean']['output'];
  courierDeliveryRemarks?: Maybe<Scalars['String']['output']>;
  courierProvider?: Maybe<Scalars['String']['output']>;
  courierTrackingNumber?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  documentName?: Maybe<Scalars['String']['output']>;
  documentUrl?: Maybe<Scalars['String']['output']>;
  followUpStatus: FollowUpStatus;
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  nextFollowUpDate?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  type: FollowUpType;
  updatedDate: Scalars['String']['output'];
  vendorId: Scalars['ID']['output'];
};

export type VendorMdRequest = {
  __typename?: 'VendorMdRequest';
  createdDate: Scalars['String']['output'];
  empId: Scalars['String']['output'];
  empRemark?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isResolved: Scalars['Boolean']['output'];
  mdId?: Maybe<Scalars['String']['output']>;
  mdRemark?: Maybe<Scalars['String']['output']>;
  updatedDate: Scalars['String']['output'];
  vendor?: Maybe<Vendor>;
  vendorId: Scalars['ID']['output'];
};

export type VendorProposal = {
  __typename?: 'VendorProposal';
  createdDate: Scalars['String']['output'];
  followUpDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  remarks?: Maybe<Scalars['String']['output']>;
  sentDate?: Maybe<Scalars['String']['output']>;
  status: ProposalStatus;
  vendorId: Scalars['ID']['output'];
};

export const VendorStatus = {
  APPROVED: 'APPROVED',
  DELETED: 'DELETED',
  FINAL: 'FINAL',
  INTERESTED: 'INTERESTED',
  NEW: 'NEW',
  NOT_INTERESTED: 'NOT_INTERESTED',
  PENDING_MD_APPROVAL: 'PENDING_MD_APPROVAL'
} as const;

export type VendorStatus = typeof VendorStatus[keyof typeof VendorStatus];
export type VendorTag = {
  __typename?: 'VendorTag';
  createdBy: Scalars['String']['output'];
  createdDate: Scalars['String']['output'];
  enableMail: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  tag?: Maybe<Tag>;
  tagId: Scalars['ID']['output'];
  vendorId: Scalars['ID']['output'];
};

export type VendorTender = {
  __typename?: 'VendorTender';
  createdDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  participationStatus: TenderParticipationStatus;
  quotedAmount?: Maybe<Scalars['Float']['output']>;
  sharedDate?: Maybe<Scalars['String']['output']>;
  tender?: Maybe<Tender>;
  tenderId: Scalars['ID']['output'];
  vendorId: Scalars['ID']['output'];
};

export const VendorType = {
  Consultant: 'Consultant',
  Vendor: 'Vendor'
} as const;

export type VendorType = typeof VendorType[keyof typeof VendorType];
export type VendorWorkflow = {
  __typename?: 'VendorWorkflow';
  changedAt: Scalars['String']['output'];
  changedBy: Scalars['String']['output'];
  fromStatus: VendorStatus;
  id: Scalars['ID']['output'];
  remarks?: Maybe<Scalars['String']['output']>;
  toStatus: VendorStatus;
  vendorId: Scalars['ID']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ApprovalStatus: ApprovalStatus;
  AssignPermissionsInput: AssignPermissionsInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ChangeTenderStatusInput: ChangeTenderStatusInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ChangeVendorStatusInput: ChangeVendorStatusInput;
  CommissionBreakdown: ResolverTypeWrapper<CommissionBreakdown>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  CommissionStructure: CommissionStructure;
  CommissionType: CommissionType;
  CompanyType: CompanyType;
  CreateAgreementInput: CreateAgreementInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateApprovalInput: CreateApprovalInput;
  CreateFollowUpInput: CreateFollowUpInput;
  CreateMdRequestInput: CreateMdRequestInput;
  CreatePaymentTermInput: CreatePaymentTermInput;
  CreateProposalInput: CreateProposalInput;
  CreateRoleInput: CreateRoleInput;
  CreateTagInput: CreateTagInput;
  CreateTenderDocumentInput: CreateTenderDocumentInput;
  CreateTenderInput: CreateTenderInput;
  CreateTendersBatchResult: ResolverTypeWrapper<CreateTendersBatchResult>;
  CreateUserInput: CreateUserInput;
  CreateVendorContactPersonInput: CreateVendorContactPersonInput;
  CreateVendorContactPersonStandaloneInput: CreateVendorContactPersonStandaloneInput;
  CreateVendorDocumentInput: CreateVendorDocumentInput;
  CreateVendorInput: CreateVendorInput;
  CreateVendorTagInput: CreateVendorTagInput;
  DecideApprovalInput: DecideApprovalInput;
  FollowUpStatus: FollowUpStatus;
  FollowUpType: FollowUpType;
  GenerateUploadUrlInput: GenerateUploadUrlInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ParticipateInTenderInput: ParticipateInTenderInput;
  PaymentFrequency: PaymentFrequency;
  PaymentScheduleItem: ResolverTypeWrapper<PaymentScheduleItem>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  PaymentScheduleResponse: ResolverTypeWrapper<PaymentScheduleResponse>;
  PaymentTerm: ResolverTypeWrapper<PaymentTerm>;
  Permission: Permission;
  ProposalStatus: ProposalStatus;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ResolveMdRequestInput: ResolveMdRequestInput;
  Role: ResolverTypeWrapper<Role>;
  RolePermissionResult: ResolverTypeWrapper<RolePermissionResult>;
  SearchRoleInput: SearchRoleInput;
  SearchTagInput: SearchTagInput;
  SearchTenderDocumentInput: SearchTenderDocumentInput;
  SearchTenderInput: SearchTenderInput;
  SearchUserInput: SearchUserInput;
  SearchVendorDocumentInput: SearchVendorDocumentInput;
  SignatureStatus: SignatureStatus;
  SkippedTenderInfo: ResolverTypeWrapper<SkippedTenderInfo>;
  Tag: ResolverTypeWrapper<Tag>;
  Tender: ResolverTypeWrapper<Tender>;
  TenderDocument: ResolverTypeWrapper<TenderDocument>;
  TenderParticipationStatus: TenderParticipationStatus;
  TenderStatus: TenderStatus;
  TenderTag: ResolverTypeWrapper<TenderTag>;
  UpdateFollowUpInput: UpdateFollowUpInput;
  UpdatePaymentTermInput: UpdatePaymentTermInput;
  UpdateProposalStatusInput: UpdateProposalStatusInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateSignatureInput: UpdateSignatureInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTenderDocumentInput: UpdateTenderDocumentInput;
  UpdateTenderInput: UpdateTenderInput;
  UpdateTenderParticipationInput: UpdateTenderParticipationInput;
  UpdateUserInput: UpdateUserInput;
  UpdateVendorContactPersonInput: UpdateVendorContactPersonInput;
  UpdateVendorContactPersonStandaloneInput: UpdateVendorContactPersonStandaloneInput;
  UpdateVendorDocumentInput: UpdateVendorDocumentInput;
  UpdateVendorDocumentStandaloneInput: UpdateVendorDocumentStandaloneInput;
  UpdateVendorInput: UpdateVendorInput;
  UploadUrlResult: ResolverTypeWrapper<UploadUrlResult>;
  UploadVendorDocumentInput: UploadVendorDocumentInput;
  User: ResolverTypeWrapper<User>;
  Vendor: ResolverTypeWrapper<Vendor>;
  VendorAgreement: ResolverTypeWrapper<VendorAgreement>;
  VendorApproval: ResolverTypeWrapper<VendorApproval>;
  VendorContactPerson: ResolverTypeWrapper<VendorContactPerson>;
  VendorDocument: ResolverTypeWrapper<VendorDocument>;
  VendorFollowUp: ResolverTypeWrapper<VendorFollowUp>;
  VendorMdRequest: ResolverTypeWrapper<VendorMdRequest>;
  VendorProposal: ResolverTypeWrapper<VendorProposal>;
  VendorStatus: VendorStatus;
  VendorTag: ResolverTypeWrapper<VendorTag>;
  VendorTender: ResolverTypeWrapper<VendorTender>;
  VendorType: VendorType;
  VendorWorkflow: ResolverTypeWrapper<VendorWorkflow>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AssignPermissionsInput: AssignPermissionsInput;
  ID: Scalars['ID']['output'];
  ChangeTenderStatusInput: ChangeTenderStatusInput;
  String: Scalars['String']['output'];
  ChangeVendorStatusInput: ChangeVendorStatusInput;
  CommissionBreakdown: CommissionBreakdown;
  Float: Scalars['Float']['output'];
  CreateAgreementInput: CreateAgreementInput;
  Boolean: Scalars['Boolean']['output'];
  CreateApprovalInput: CreateApprovalInput;
  CreateFollowUpInput: CreateFollowUpInput;
  CreateMdRequestInput: CreateMdRequestInput;
  CreatePaymentTermInput: CreatePaymentTermInput;
  CreateProposalInput: CreateProposalInput;
  CreateRoleInput: CreateRoleInput;
  CreateTagInput: CreateTagInput;
  CreateTenderDocumentInput: CreateTenderDocumentInput;
  CreateTenderInput: CreateTenderInput;
  CreateTendersBatchResult: CreateTendersBatchResult;
  CreateUserInput: CreateUserInput;
  CreateVendorContactPersonInput: CreateVendorContactPersonInput;
  CreateVendorContactPersonStandaloneInput: CreateVendorContactPersonStandaloneInput;
  CreateVendorDocumentInput: CreateVendorDocumentInput;
  CreateVendorInput: CreateVendorInput;
  CreateVendorTagInput: CreateVendorTagInput;
  DecideApprovalInput: DecideApprovalInput;
  GenerateUploadUrlInput: GenerateUploadUrlInput;
  Mutation: Record<PropertyKey, never>;
  ParticipateInTenderInput: ParticipateInTenderInput;
  PaymentScheduleItem: PaymentScheduleItem;
  Int: Scalars['Int']['output'];
  PaymentScheduleResponse: PaymentScheduleResponse;
  PaymentTerm: PaymentTerm;
  Query: Record<PropertyKey, never>;
  ResolveMdRequestInput: ResolveMdRequestInput;
  Role: Role;
  RolePermissionResult: RolePermissionResult;
  SearchRoleInput: SearchRoleInput;
  SearchTagInput: SearchTagInput;
  SearchTenderDocumentInput: SearchTenderDocumentInput;
  SearchTenderInput: SearchTenderInput;
  SearchUserInput: SearchUserInput;
  SearchVendorDocumentInput: SearchVendorDocumentInput;
  SkippedTenderInfo: SkippedTenderInfo;
  Tag: Tag;
  Tender: Tender;
  TenderDocument: TenderDocument;
  TenderTag: TenderTag;
  UpdateFollowUpInput: UpdateFollowUpInput;
  UpdatePaymentTermInput: UpdatePaymentTermInput;
  UpdateProposalStatusInput: UpdateProposalStatusInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateSignatureInput: UpdateSignatureInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTenderDocumentInput: UpdateTenderDocumentInput;
  UpdateTenderInput: UpdateTenderInput;
  UpdateTenderParticipationInput: UpdateTenderParticipationInput;
  UpdateUserInput: UpdateUserInput;
  UpdateVendorContactPersonInput: UpdateVendorContactPersonInput;
  UpdateVendorContactPersonStandaloneInput: UpdateVendorContactPersonStandaloneInput;
  UpdateVendorDocumentInput: UpdateVendorDocumentInput;
  UpdateVendorDocumentStandaloneInput: UpdateVendorDocumentStandaloneInput;
  UpdateVendorInput: UpdateVendorInput;
  UploadUrlResult: UploadUrlResult;
  UploadVendorDocumentInput: UploadVendorDocumentInput;
  User: User;
  Vendor: Vendor;
  VendorAgreement: VendorAgreement;
  VendorApproval: VendorApproval;
  VendorContactPerson: VendorContactPerson;
  VendorDocument: VendorDocument;
  VendorFollowUp: VendorFollowUp;
  VendorMdRequest: VendorMdRequest;
  VendorProposal: VendorProposal;
  VendorTag: VendorTag;
  VendorTender: VendorTender;
  VendorWorkflow: VendorWorkflow;
};

export type CommissionBreakdownResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommissionBreakdown'] = ResolversParentTypes['CommissionBreakdown']> = {
  baseAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  commissionAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  gstAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type CreateTendersBatchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTendersBatchResult'] = ResolversParentTypes['CreateTendersBatchResult']> = {
  created?: Resolver<Array<ResolversTypes['Tender']>, ParentType, ContextType>;
  skipped?: Resolver<Array<ResolversTypes['SkippedTenderInfo']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  assignPermissions?: Resolver<ResolversTypes['RolePermissionResult'], ParentType, ContextType, RequireFields<MutationAssignPermissionsArgs, 'input'>>;
  changeTenderStatus?: Resolver<ResolversTypes['Tender'], ParentType, ContextType, RequireFields<MutationChangeTenderStatusArgs, 'input'>>;
  changeVendorStatus?: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationChangeVendorStatusArgs, 'input'>>;
  createMdRequest?: Resolver<ResolversTypes['VendorMdRequest'], ParentType, ContextType, RequireFields<MutationCreateMdRequestArgs, 'input'>>;
  createPaymentTerm?: Resolver<ResolversTypes['PaymentTerm'], ParentType, ContextType, RequireFields<MutationCreatePaymentTermArgs, 'input'>>;
  createRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationCreateRoleArgs, 'input'>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'input'>>;
  createTender?: Resolver<ResolversTypes['Tender'], ParentType, ContextType, RequireFields<MutationCreateTenderArgs, 'input'>>;
  createTenderDocument?: Resolver<ResolversTypes['TenderDocument'], ParentType, ContextType, RequireFields<MutationCreateTenderDocumentArgs, 'input'>>;
  createTendersBatch?: Resolver<ResolversTypes['CreateTendersBatchResult'], ParentType, ContextType, RequireFields<MutationCreateTendersBatchArgs, 'inputs'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createVendor?: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationCreateVendorArgs, 'input'>>;
  createVendorAgreement?: Resolver<ResolversTypes['VendorAgreement'], ParentType, ContextType, RequireFields<MutationCreateVendorAgreementArgs, 'input'>>;
  createVendorContactPerson?: Resolver<ResolversTypes['VendorContactPerson'], ParentType, ContextType, RequireFields<MutationCreateVendorContactPersonArgs, 'input'>>;
  createVendorFollowUp?: Resolver<ResolversTypes['VendorFollowUp'], ParentType, ContextType, RequireFields<MutationCreateVendorFollowUpArgs, 'input'>>;
  createVendorProposal?: Resolver<ResolversTypes['VendorProposal'], ParentType, ContextType, RequireFields<MutationCreateVendorProposalArgs, 'input'>>;
  createVendorTag?: Resolver<ResolversTypes['VendorTag'], ParentType, ContextType, RequireFields<MutationCreateVendorTagArgs, 'input'>>;
  decideVendorApproval?: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationDecideVendorApprovalArgs, 'input'>>;
  deletePaymentTerm?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePaymentTermArgs, 'id'>>;
  deleteRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  deleteTag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'id'>>;
  deleteTags?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTagsArgs, 'ids'>>;
  deleteTender?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTenderArgs, 'id'>>;
  deleteTenderDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTenderDocumentArgs, 'id'>>;
  deleteTenderDocuments?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTenderDocumentsArgs, 'ids'>>;
  deleteTenders?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTendersArgs, 'ids'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteUsers?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUsersArgs, 'ids'>>;
  deleteVendor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorArgs, 'id'>>;
  deleteVendorContactPerson?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorContactPersonArgs, 'id'>>;
  deleteVendorContactPersons?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorContactPersonsArgs, 'ids'>>;
  deleteVendorDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorDocumentArgs, 'id'>>;
  deleteVendorDocuments?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorDocumentsArgs, 'ids'>>;
  deleteVendorFollowUp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorFollowUpArgs, 'id'>>;
  deleteVendorTag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorTagArgs, 'id'>>;
  deleteVendors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVendorsArgs, 'ids'>>;
  generatePresignedUploadUrl?: Resolver<ResolversTypes['UploadUrlResult'], ParentType, ContextType, RequireFields<MutationGeneratePresignedUploadUrlArgs, 'input'>>;
  participateInTender?: Resolver<ResolversTypes['VendorTender'], ParentType, ContextType, RequireFields<MutationParticipateInTenderArgs, 'input'>>;
  requestVendorApproval?: Resolver<ResolversTypes['VendorApproval'], ParentType, ContextType, RequireFields<MutationRequestVendorApprovalArgs, 'input'>>;
  resolveMdRequest?: Resolver<ResolversTypes['VendorMdRequest'], ParentType, ContextType, RequireFields<MutationResolveMdRequestArgs, 'input'>>;
  updateAgreementSignature?: Resolver<ResolversTypes['VendorAgreement'], ParentType, ContextType, RequireFields<MutationUpdateAgreementSignatureArgs, 'input'>>;
  updatePaymentTerm?: Resolver<ResolversTypes['PaymentTerm'], ParentType, ContextType, RequireFields<MutationUpdatePaymentTermArgs, 'input'>>;
  updateRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationUpdateRoleArgs, 'input'>>;
  updateTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'id' | 'input'>>;
  updateTender?: Resolver<ResolversTypes['Tender'], ParentType, ContextType, RequireFields<MutationUpdateTenderArgs, 'id' | 'input'>>;
  updateTenderDocument?: Resolver<ResolversTypes['TenderDocument'], ParentType, ContextType, RequireFields<MutationUpdateTenderDocumentArgs, 'id' | 'input'>>;
  updateTenderParticipation?: Resolver<ResolversTypes['VendorTender'], ParentType, ContextType, RequireFields<MutationUpdateTenderParticipationArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
  updateVendor?: Resolver<ResolversTypes['Vendor'], ParentType, ContextType, RequireFields<MutationUpdateVendorArgs, 'id' | 'input'>>;
  updateVendorContactPerson?: Resolver<ResolversTypes['VendorContactPerson'], ParentType, ContextType, RequireFields<MutationUpdateVendorContactPersonArgs, 'id' | 'input'>>;
  updateVendorDocument?: Resolver<ResolversTypes['VendorDocument'], ParentType, ContextType, RequireFields<MutationUpdateVendorDocumentArgs, 'id' | 'input'>>;
  updateVendorFollowUp?: Resolver<ResolversTypes['VendorFollowUp'], ParentType, ContextType, RequireFields<MutationUpdateVendorFollowUpArgs, 'input'>>;
  updateVendorProposalStatus?: Resolver<ResolversTypes['VendorProposal'], ParentType, ContextType, RequireFields<MutationUpdateVendorProposalStatusArgs, 'input'>>;
  updateVendorTagEmail?: Resolver<ResolversTypes['VendorTag'], ParentType, ContextType, RequireFields<MutationUpdateVendorTagEmailArgs, 'enableMail' | 'id'>>;
  uploadVendorDocument?: Resolver<ResolversTypes['VendorDocument'], ParentType, ContextType, RequireFields<MutationUploadVendorDocumentArgs, 'input'>>;
};

export type PaymentScheduleItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentScheduleItem'] = ResolversParentTypes['PaymentScheduleItem']> = {
  baseAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  dueDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gstAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  installmentNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type PaymentScheduleResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentScheduleResponse'] = ResolversParentTypes['PaymentScheduleResponse']> = {
  frequency?: Resolver<ResolversTypes['PaymentFrequency'], ParentType, ContextType>;
  schedule?: Resolver<Array<ResolversTypes['PaymentScheduleItem']>, ParentType, ContextType>;
  totalInstallments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type PaymentTermResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentTerm'] = ResolversParentTypes['PaymentTerm']> = {
  agreementDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  benefitDetails?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  commissionStructure?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  companyType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fillAmount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  otherBenefits?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  paymentTermType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  calculateVendorCommission?: Resolver<ResolversTypes['CommissionBreakdown'], ParentType, ContextType, RequireFields<QueryCalculateVendorCommissionArgs, 'baseAmount' | 'commissionType' | 'commissionValue' | 'gstApplicable'>>;
  generateVendorPaymentSchedule?: Resolver<ResolversTypes['PaymentScheduleResponse'], ParentType, ContextType, RequireFields<QueryGenerateVendorPaymentScheduleArgs, 'frequency' | 'gstApplicable' | 'startDate' | 'totalAmount'>>;
  getActivePendingRequest?: Resolver<Maybe<ResolversTypes['VendorMdRequest']>, ParentType, ContextType, RequireFields<QueryGetActivePendingRequestArgs, 'vendorId'>>;
  getMdRequestsByVendor?: Resolver<Array<ResolversTypes['VendorMdRequest']>, ParentType, ContextType, RequireFields<QueryGetMdRequestsByVendorArgs, 'vendorId'>>;
  getPaymentTermsByVendor?: Resolver<Array<ResolversTypes['PaymentTerm']>, ParentType, ContextType, RequireFields<QueryGetPaymentTermsByVendorArgs, 'vendorId'>>;
  getPendingMdRequests?: Resolver<Array<ResolversTypes['VendorMdRequest']>, ParentType, ContextType>;
  getPermissionsByRoleId?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType, RequireFields<QueryGetPermissionsByRoleIdArgs, 'roleId'>>;
  getResolvedMdRequests?: Resolver<Array<ResolversTypes['VendorMdRequest']>, ParentType, ContextType>;
  getRoleById?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryGetRoleByIdArgs, 'id'>>;
  getSharedTenders?: Resolver<Array<ResolversTypes['VendorTender']>, ParentType, ContextType, RequireFields<QueryGetSharedTendersArgs, 'vendorId'>>;
  getTagById?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryGetTagByIdArgs, 'id'>>;
  getTenderById?: Resolver<Maybe<ResolversTypes['Tender']>, ParentType, ContextType, RequireFields<QueryGetTenderByIdArgs, 'id'>>;
  getTenderDocumentById?: Resolver<Maybe<ResolversTypes['TenderDocument']>, ParentType, ContextType, RequireFields<QueryGetTenderDocumentByIdArgs, 'id'>>;
  getTendersByTag?: Resolver<Array<ResolversTypes['Tender']>, ParentType, ContextType, RequireFields<QueryGetTendersByTagArgs, 'tagId'>>;
  getUserById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByIdArgs, 'id'>>;
  getVendorApprovals?: Resolver<Array<ResolversTypes['VendorApproval']>, ParentType, ContextType, RequireFields<QueryGetVendorApprovalsArgs, 'vendorId'>>;
  getVendorById?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<QueryGetVendorByIdArgs, 'id'>>;
  getVendorContactPersonById?: Resolver<Maybe<ResolversTypes['VendorContactPerson']>, ParentType, ContextType, RequireFields<QueryGetVendorContactPersonByIdArgs, 'id'>>;
  getVendorDocumentById?: Resolver<Maybe<ResolversTypes['VendorDocument']>, ParentType, ContextType, RequireFields<QueryGetVendorDocumentByIdArgs, 'id'>>;
  getVendorFollowUps?: Resolver<Array<ResolversTypes['VendorFollowUp']>, ParentType, ContextType, RequireFields<QueryGetVendorFollowUpsArgs, 'vendorId'>>;
  getVendorProposals?: Resolver<Array<ResolversTypes['VendorProposal']>, ParentType, ContextType, RequireFields<QueryGetVendorProposalsArgs, 'vendorId'>>;
  getVendorTenders?: Resolver<Array<ResolversTypes['VendorTender']>, ParentType, ContextType, RequireFields<QueryGetVendorTendersArgs, 'vendorId'>>;
  getVendorWorkflow?: Resolver<Array<ResolversTypes['VendorWorkflow']>, ParentType, ContextType, RequireFields<QueryGetVendorWorkflowArgs, 'vendorId'>>;
  getVendorsByTag?: Resolver<Array<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<QueryGetVendorsByTagArgs, 'tagId'>>;
  searchRoles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType, Partial<QuerySearchRolesArgs>>;
  searchTags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType, Partial<QuerySearchTagsArgs>>;
  searchTenderDocuments?: Resolver<Array<ResolversTypes['TenderDocument']>, ParentType, ContextType, Partial<QuerySearchTenderDocumentsArgs>>;
  searchTenders?: Resolver<Array<ResolversTypes['Tender']>, ParentType, ContextType, Partial<QuerySearchTendersArgs>>;
  searchUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QuerySearchUsersArgs>>;
  searchVendorContactPersons?: Resolver<Array<ResolversTypes['VendorContactPerson']>, ParentType, ContextType, Partial<QuerySearchVendorContactPersonsArgs>>;
  searchVendorDocuments?: Resolver<Array<ResolversTypes['VendorDocument']>, ParentType, ContextType, Partial<QuerySearchVendorDocumentsArgs>>;
  searchVendors?: Resolver<Array<ResolversTypes['Vendor']>, ParentType, ContextType, Partial<QuerySearchVendorsArgs>>;
};

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type RolePermissionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RolePermissionResult'] = ResolversParentTypes['RolePermissionResult']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
  roleId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type SkippedTenderInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SkippedTenderInfo'] = ResolversParentTypes['SkippedTenderInfo']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabledMailCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tenderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type TenderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tender'] = ResolversParentTypes['Tender']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deletedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documents?: Resolver<Maybe<Array<ResolversTypes['TenderDocument']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDeleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  issuingDepartment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mailSentAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rejectionReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TenderStatus'], ParentType, ContextType>;
  submissionDeadline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['TenderTag']>>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type TenderDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['TenderDocument'] = ResolversParentTypes['TenderDocument']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresOn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tenderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type TenderTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['TenderTag'] = ResolversParentTypes['TenderTag']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>;
  tagId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tenderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type UploadUrlResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadUrlResult'] = ResolversParentTypes['UploadUrlResult']> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publicUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  roleId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type VendorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vendor'] = ResolversParentTypes['Vendor']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  agreementWith?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  agreements?: Resolver<Maybe<Array<ResolversTypes['VendorAgreement']>>, ParentType, ContextType>;
  approvals?: Resolver<Maybe<Array<ResolversTypes['VendorApproval']>>, ParentType, ContextType>;
  cinNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactPersons?: Resolver<Maybe<Array<ResolversTypes['VendorContactPerson']>>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documents?: Resolver<Maybe<Array<ResolversTypes['VendorDocument']>>, ParentType, ContextType>;
  followUps?: Resolver<Maybe<Array<ResolversTypes['VendorFollowUp']>>, ParentType, ContextType>;
  gstNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isRailwayLinked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  msmeUdyamNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  panNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paymentTerms?: Resolver<Maybe<Array<ResolversTypes['PaymentTerm']>>, ParentType, ContextType>;
  proposals?: Resolver<Maybe<Array<ResolversTypes['VendorProposal']>>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['VendorStatus'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['VendorTag']>>, ParentType, ContextType>;
  tenders?: Resolver<Maybe<Array<ResolversTypes['VendorTender']>>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workflows?: Resolver<Maybe<Array<ResolversTypes['VendorWorkflow']>>, ParentType, ContextType>;
};

export type VendorAgreementResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorAgreement'] = ResolversParentTypes['VendorAgreement']> = {
  agreementEndDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  agreementStartDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  commissionStructure?: Resolver<Maybe<ResolversTypes['CommissionStructure']>, ParentType, ContextType>;
  commissionType?: Resolver<Maybe<ResolversTypes['CommissionType']>, ParentType, ContextType>;
  commissionValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gstApplicable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasOtherBenefits?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  otherBenefitsDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paymentAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  paymentFrequency?: Resolver<Maybe<ResolversTypes['PaymentFrequency']>, ParentType, ContextType>;
  renewalReminderDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signatureStatus?: Resolver<ResolversTypes['SignatureStatus'], ParentType, ContextType>;
  signedDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorApprovalResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorApproval'] = ResolversParentTypes['VendorApproval']> = {
  approvedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  approvedDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  remarks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ApprovalStatus'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorContactPersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorContactPerson'] = ResolversParentTypes['VendorContactPerson']> = {
  bcc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  designation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorDocument'] = ResolversParentTypes['VendorDocument']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresOn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorFollowUpResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorFollowUp'] = ResolversParentTypes['VendorFollowUp']> = {
  autoMailSent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  courierDeliveryRemarks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  courierProvider?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  courierTrackingNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  documentName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documentUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  followUpStatus?: Resolver<ResolversTypes['FollowUpStatus'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  nextFollowUpDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remarks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['FollowUpType'], ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorMdRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorMdRequest'] = ResolversParentTypes['VendorMdRequest']> = {
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  empId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  empRemark?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isResolved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  mdId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mdRemark?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendor?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorProposalResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorProposal'] = ResolversParentTypes['VendorProposal']> = {
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followUpDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  remarks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sentDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ProposalStatus'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorTag'] = ResolversParentTypes['VendorTag']> = {
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enableMail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>;
  tagId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorTenderResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorTender'] = ResolversParentTypes['VendorTender']> = {
  createdDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  participationStatus?: Resolver<ResolversTypes['TenderParticipationStatus'], ParentType, ContextType>;
  quotedAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sharedDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tender?: Resolver<Maybe<ResolversTypes['Tender']>, ParentType, ContextType>;
  tenderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type VendorWorkflowResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorWorkflow'] = ResolversParentTypes['VendorWorkflow']> = {
  changedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromStatus?: Resolver<ResolversTypes['VendorStatus'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  remarks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  toStatus?: Resolver<ResolversTypes['VendorStatus'], ParentType, ContextType>;
  vendorId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CommissionBreakdown?: CommissionBreakdownResolvers<ContextType>;
  CreateTendersBatchResult?: CreateTendersBatchResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaymentScheduleItem?: PaymentScheduleItemResolvers<ContextType>;
  PaymentScheduleResponse?: PaymentScheduleResponseResolvers<ContextType>;
  PaymentTerm?: PaymentTermResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  RolePermissionResult?: RolePermissionResultResolvers<ContextType>;
  SkippedTenderInfo?: SkippedTenderInfoResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  Tender?: TenderResolvers<ContextType>;
  TenderDocument?: TenderDocumentResolvers<ContextType>;
  TenderTag?: TenderTagResolvers<ContextType>;
  UploadUrlResult?: UploadUrlResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vendor?: VendorResolvers<ContextType>;
  VendorAgreement?: VendorAgreementResolvers<ContextType>;
  VendorApproval?: VendorApprovalResolvers<ContextType>;
  VendorContactPerson?: VendorContactPersonResolvers<ContextType>;
  VendorDocument?: VendorDocumentResolvers<ContextType>;
  VendorFollowUp?: VendorFollowUpResolvers<ContextType>;
  VendorMdRequest?: VendorMdRequestResolvers<ContextType>;
  VendorProposal?: VendorProposalResolvers<ContextType>;
  VendorTag?: VendorTagResolvers<ContextType>;
  VendorTender?: VendorTenderResolvers<ContextType>;
  VendorWorkflow?: VendorWorkflowResolvers<ContextType>;
};

