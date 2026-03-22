import { Container } from 'inversify';
import { TYPES } from './types';

import { UserRepository } from '../components/user';
import { UserService } from '../components/user/';
import { IUserRepository } from '../components/user/types';
import { IUserService } from '../components/user/types';
import { AppDataSource } from '../config/data-source';

import { RolePermissionRepository } from '../components/role-permission/repository';
import { RolePermissionService } from '../components/role-permission/service';
import {
  IRolePermissionRepository,
  IRolePermissionService,
} from '../components/role-permission/types';
import { IRoleRepository, IRoleService } from '../components/role/types';
import { RoleRepository } from '../components/role/repository';
import { RoleService } from '../components/role/service';

import { TagRepository } from '../components/tag/repository';
import { TagService } from '../components/tag/service';
import { ITagRepository, ITagService } from '../components/tag/types';

import { VendorRepository } from '../components/vendor/repository';
import { VendorService } from '../components/vendor/service';
import { IVendorRepository, IVendorService } from '../components/vendor/types';

import { VendorContactPersonRepository } from '../components/vendor-contact-person/repository';
import { VendorContactPersonService } from '../components/vendor-contact-person/service';
import { IVendorContactPersonRepository, IVendorContactPersonService } from '../components/vendor-contact-person/types';

import { VendorDocumentRepository } from '../components/vendor-document/repository';
import { VendorDocumentService } from '../components/vendor-document/service';
import { IVendorDocumentRepository, IVendorDocumentService } from '../components/vendor-document/types';

import { VendorTagRepository } from '../components/vendor-tag/repository';
import { VendorTagService } from '../components/vendor-tag/service';
import { IVendorTagRepository, IVendorTagService } from '../components/vendor-tag/types';

import { TenderRepository } from '../components/tender/repository';
import { TenderService } from '../components/tender/service';
import { ITenderRepository, ITenderService } from '../components/tender/types';

import { TenderDocumentRepository } from '../components/tender-document/repository';
import { TenderDocumentService } from '../components/tender-document/service';
import { ITenderDocumentRepository, ITenderDocumentService } from '../components/tender-document/types';
import {
  IVendorAgreementRepository,
  IVendorAgreementService,
} from '../components/vendor-agreement/types';

import { VendorAgreementRepository } from '../components/vendor-agreement/repository';
import { VendorAgreementService } from '../components/vendor-agreement/service';
import {
  IVendorWorkflowRepository,
  IVendorWorkflowService,
} from '../components/vendor-workflow/types';

import {
  IVendorApprovalRepository,
  IVendorApprovalService,
} from '../components/vendor-approval/types';

import { VendorApprovalRepository } from '../components/vendor-approval/repository';
import { VendorApprovalService } from '../components/vendor-approval/service';

import {
  IVendorProposalRepository,
  IVendorProposalService,
} from '../components/vendor-proposal/types';

import { VendorProposalRepository } from '../components/vendor-proposal/repository';
import { VendorProposalService } from '../components/vendor-proposal/service';

import { IVendorCommissionService } from '../components/vendor-commission/types';
import { VendorCommissionService } from '../components/vendor-commission/service';

import { VendorWorkflowRepository } from '../components/vendor-workflow/repository';
import { VendorWorkflowService } from '../components/vendor-workflow/service';

import {
  IVendorFollowUpRepository,
  IVendorFollowUpService,
} from '../components/vendor-followup/types';

import { VendorFollowUpRepository } from '../components/vendor-followup/repository';
import { VendorFollowUpService } from '../components/vendor-followup/service';
import { IVendorPaymentService } from '../components/vendor-payment/types';
import { VendorPaymentService } from '../components/vendor-payment/service';
import {
  IVendorTenderRepository,
  IVendorTenderService,
} from '../components/vendor-tender/types';

import { VendorTenderRepository } from '../components/vendor-tender/repository';
import { VendorTenderService } from '../components/vendor-tender/service';

import {
  IVendorMdRequestRepository,
  IVendorMdRequestService,
} from '../components/vendor-md-request/types';

import { VendorMdRequestRepository } from '../components/vendor-md-request/repository';
import { VendorMdRequestService } from '../components/vendor-md-request/service';

import { PaymentTermRepository, IPaymentTermRepository } from '../components/payment-term/repository';
import { PaymentTermService, IPaymentTermService } from '../components/payment-term/service';

import { S3Service } from '../components/upload/service';
import { IS3Service } from '../components/upload/types';

import { TenderPostAwardRepository } from '../components/tender-post-award/repository';
import { TenderPostAwardService } from '../components/tender-post-award/service';
import {
  ITenderPostAwardRepository,
  ITenderPostAwardService,
} from '../components/tender-post-award/types';

import { TenderActivityLogRepository } from '../components/tender-activity-log/repository';
import { TenderActivityLogService } from '../components/tender-activity-log/service';
import {
  ITenderActivityLogRepository,
  ITenderActivityLogService,
} from '../components/tender-activity-log/types';

import { PostAwardFollowUpRepository } from '../components/post-award-follow-up/repository';
import { PostAwardFollowUpService } from '../components/post-award-follow-up/service';
import {
  IPostAwardFollowUpRepository,
  IPostAwardFollowUpService,
} from '../components/post-award-follow-up/types';

import { PostAwardDocumentRepository } from '../components/post-award-document/repository';
import { PostAwardDocumentService } from '../components/post-award-document/service';
import {
  IPostAwardDocumentRepository,
  IPostAwardDocumentService,
} from '../components/post-award-document/types';

import { NotificationRepository } from '../components/notification/repository';
import { NotificationService } from '../components/notification/service';
import {
  INotificationRepository,
  INotificationService,
} from '../components/notification/types';

import { TicketRepository } from '../components/ticket/repository';
import { TicketService } from '../components/ticket/service';
import {
  ITicketRepository,
  ITicketService,
} from '../components/ticket/types';

import { TenderContactRepository } from '../components/tender-contact/repository';
import { TenderContactService } from '../components/tender-contact/service';
import {
  ITenderContactRepository,
  ITenderContactService,
} from '../components/tender-contact/types';

import { CourierRecordRepository } from '../components/courier-record/repository';
import { CourierRecordService } from '../components/courier-record/service';
import {
  ICourierRecordRepository,
  ICourierRecordService,
} from '../components/courier-record/types';

import { TagAutoMailRestrictionRepository } from '../components/tag-auto-mail-restriction/repository';
import { TagAutoMailRestrictionService } from '../components/tag-auto-mail-restriction/service';
import {
  ITagAutoMailRestrictionRepository,
  ITagAutoMailRestrictionService,
} from '../components/tag-auto-mail-restriction/types';

import { TenderDeliveryScheduleRepository } from '../components/tender-delivery-schedule/repository';
import { TenderDeliveryScheduleService } from '../components/tender-delivery-schedule/service';
import {
  ITenderDeliveryScheduleRepository,
  ITenderDeliveryScheduleService,
} from '../components/tender-delivery-schedule/types';



let _container: Container | null = null;

function createContainer(): Container {
  const container = new Container({ defaultScope: 'Singleton' });

  container.bind(TYPES.DbContext).toConstantValue(AppDataSource);

  container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
  container.bind<IUserService>(TYPES.IUserService).to(UserService);
  container
    .bind<IRolePermissionRepository>(TYPES.IRolePermissionRepository)
    .to(RolePermissionRepository);

  container
    .bind<IRolePermissionService>(TYPES.IRolePermissionService)
    .to(RolePermissionService);
  container
    .bind<IRoleRepository>(TYPES.IRoleRepository)
    .to(RoleRepository);

    container
  .bind<IVendorTenderRepository>(TYPES.IVendorTenderRepository)
  .to(VendorTenderRepository);

container
  .bind<IVendorTenderService>(TYPES.IVendorTenderService)
  .to(VendorTenderService);


  container
    .bind<IRoleService>(TYPES.IRoleService)
    .to(RoleService);

    container
  .bind<IVendorPaymentService>(TYPES.IVendorPaymentService)
  .to(VendorPaymentService);


  container.bind<ITagRepository>(TYPES.ITagRepository).to(TagRepository);
  container.bind<ITagService>(TYPES.ITagService).to(TagService);

  container.bind<IVendorRepository>(TYPES.IVendorRepository).to(VendorRepository);
  container.bind<IVendorService>(TYPES.IVendorService).to(VendorService);

  container
    .bind<IVendorContactPersonRepository>(TYPES.IVendorContactPersonRepository)
    .to(VendorContactPersonRepository);
  container
    .bind<IVendorContactPersonService>(TYPES.IVendorContactPersonService)
    .to(VendorContactPersonService);

  container
    .bind<IVendorDocumentRepository>(TYPES.IVendorDocumentRepository)
    .to(VendorDocumentRepository);
  container
    .bind<IVendorDocumentService>(TYPES.IVendorDocumentService)
    .to(VendorDocumentService);

  container
    .bind<IVendorTagRepository>(TYPES.IVendorTagRepository)
    .to(VendorTagRepository);
  container
    .bind<IVendorTagService>(TYPES.IVendorTagService)
    .to(VendorTagService);

  container.bind<ITenderRepository>(TYPES.ITenderRepository).to(TenderRepository);
  container.bind<ITenderService>(TYPES.ITenderService).to(TenderService);

  container
    .bind<ITenderDocumentRepository>(TYPES.ITenderDocumentRepository)
    .to(TenderDocumentRepository);
  container
    .bind<ITenderDocumentService>(TYPES.ITenderDocumentService)
    .to(TenderDocumentService);

  container
    .bind<IVendorAgreementRepository>(TYPES.IVendorAgreementRepository)
    .to(VendorAgreementRepository);

  container
    .bind<IVendorAgreementService>(TYPES.IVendorAgreementService)
    .to(VendorAgreementService);

  container
    .bind<IVendorWorkflowRepository>(TYPES.IVendorWorkflowRepository)
    .to(VendorWorkflowRepository);

  container
    .bind<IVendorWorkflowService>(TYPES.IVendorWorkflowService)
    .to(VendorWorkflowService);

    container
  .bind<IVendorApprovalRepository>(TYPES.IVendorApprovalRepository)
  .to(VendorApprovalRepository);

container
  .bind<IVendorApprovalService>(TYPES.IVendorApprovalService)
  .to(VendorApprovalService);

  container
  .bind<IVendorProposalRepository>(TYPES.IVendorProposalRepository)
  .to(VendorProposalRepository);

container
  .bind<IVendorProposalService>(TYPES.IVendorProposalService)
  .to(VendorProposalService);

  container
  .bind<IVendorCommissionService>(TYPES.IVendorCommissionService)
  .to(VendorCommissionService);

  container
  .bind<IVendorFollowUpRepository>(TYPES.IVendorFollowUpRepository)
  .to(VendorFollowUpRepository);

container
  .bind<IVendorFollowUpService>(TYPES.IVendorFollowUpService)
  .to(VendorFollowUpService);

  container
    .bind<IVendorMdRequestRepository>(TYPES.IVendorMdRequestRepository)
    .to(VendorMdRequestRepository);

  container
    .bind<IVendorMdRequestService>(TYPES.IVendorMdRequestService)
    .to(VendorMdRequestService);

  container
    .bind<IPaymentTermRepository>(TYPES.IPaymentTermRepository)
    .to(PaymentTermRepository);

  container
    .bind<IPaymentTermService>(TYPES.IPaymentTermService)
    .to(PaymentTermService);

  container
    .bind<IS3Service>(TYPES.IS3Service)
    .to(S3Service);

  container
    .bind<ITenderPostAwardRepository>(TYPES.ITenderPostAwardRepository)
    .to(TenderPostAwardRepository);

  container
    .bind<ITenderPostAwardService>(TYPES.ITenderPostAwardService)
    .to(TenderPostAwardService);

  container
    .bind<ITenderActivityLogRepository>(TYPES.ITenderActivityLogRepository)
    .to(TenderActivityLogRepository);

  container
    .bind<ITenderActivityLogService>(TYPES.ITenderActivityLogService)
    .to(TenderActivityLogService);

  container
    .bind<IPostAwardFollowUpRepository>(TYPES.IPostAwardFollowUpRepository)
    .to(PostAwardFollowUpRepository);

  container
    .bind<IPostAwardFollowUpService>(TYPES.IPostAwardFollowUpService)
    .to(PostAwardFollowUpService);

  container
    .bind<IPostAwardDocumentRepository>(TYPES.IPostAwardDocumentRepository)
    .to(PostAwardDocumentRepository);

  container
    .bind<IPostAwardDocumentService>(TYPES.IPostAwardDocumentService)
    .to(PostAwardDocumentService);

  // Notification
  container
    .bind<INotificationRepository>(TYPES.INotificationRepository)
    .to(NotificationRepository);
  container
    .bind<INotificationService>(TYPES.INotificationService)
    .to(NotificationService);

  // Ticket
  container
    .bind<ITicketRepository>(TYPES.ITicketRepository)
    .to(TicketRepository);
  container
    .bind<ITicketService>(TYPES.ITicketService)
    .to(TicketService);

  // TenderContact
  container
    .bind<ITenderContactRepository>(TYPES.ITenderContactRepository)
    .to(TenderContactRepository);
  container
    .bind<ITenderContactService>(TYPES.ITenderContactService)
    .to(TenderContactService);

  // CourierRecord
  container
    .bind<ICourierRecordRepository>(TYPES.ICourierRecordRepository)
    .to(CourierRecordRepository);
  container
    .bind<ICourierRecordService>(TYPES.ICourierRecordService)
    .to(CourierRecordService);

  // TagAutoMailRestriction
  container
    .bind<ITagAutoMailRestrictionRepository>(TYPES.ITagAutoMailRestrictionRepository)
    .to(TagAutoMailRestrictionRepository);
  container
    .bind<ITagAutoMailRestrictionService>(TYPES.ITagAutoMailRestrictionService)
    .to(TagAutoMailRestrictionService);

  // TenderDeliverySchedule
  container
    .bind<ITenderDeliveryScheduleRepository>(TYPES.ITenderDeliveryScheduleRepository)
    .to(TenderDeliveryScheduleRepository);
  container
    .bind<ITenderDeliveryScheduleService>(TYPES.ITenderDeliveryScheduleService)
    .to(TenderDeliveryScheduleService);

  return container;
}

export function getContainer(): Container {
  if (!_container) {
    _container = createContainer();
  }
  return _container;
}

