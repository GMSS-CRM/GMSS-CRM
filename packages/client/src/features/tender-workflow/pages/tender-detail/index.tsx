import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Spin,
  Typography,
  Space,
  Button,
  Tag,
  Breadcrumb,
  Steps,
  Divider,
  message,
  Card,
  Tabs,
} from 'antd';
import {
  ArrowLeftOutlined,
  RightCircleOutlined,
  BellOutlined,
  TeamOutlined,
  TrophyOutlined,
  FileTextOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import type { VendorTender, TenderDocument as GqlTenderDocument } from '@gmss/types';
import {
  useGetTenderPostAward,
  useUpdateOrderFollowUp,
  useUpdateOrderProcessing,
  useUpdateInspection,
  useUpdateDispatchDelivery,
  useUpdateWarranty,
  useUpdateBillPayment,
  useUpdateLoaProcessing,
  useUpdateSdReturn,
  useAdvancePostAwardStage,
  useRevertPostAwardStage,
} from '../../services/tender-post-award.service';
import {
  OrderFollowUpSection,
  OrderProcessingSection,
  InspectionSection,
  DispatchDeliverySection,
  WarrantySection,
  BillPaymentSection,
  LoaProcessingSection,
  SdReturnSection,
} from './StageSections';
import VendorFollowUpSection from './VendorFollowUpSection';
import PostAwardFollowUpsPanel from './PostAwardFollowUpsPanel';
import { STATUS_COLORS, STATUS_LABELS } from '../../types/tender.types';
import type { TenderStatus } from '../../types/tender.types';

const { Title, Text } = Typography;

// ─── Constants ────────────────────────────────────────────────────────────────

interface TenderBasic {
  id: string;
  name: string;
  referenceNumber: string;
  issuingDepartment: string;
  status: string;
  description?: string;
  submissionDeadline?: string;
  updatedSubmissionDeadline?: string;
  sourcePortal?: string;
  tenderType?: string;
  mailSentAt?: string;
  countdownSilenceReason?: string;
  drawingRequired?: boolean;
  strRequired?: boolean;
  specificationsRequired?: boolean;
  rejectionReason?: string;
  tags?: Array<{ id: string; name: string; color?: string }>;
  documents?: GqlTenderDocument[];
}

type MutationFn = (opts: { variables: { input: Record<string, unknown> } }) => Promise<unknown>;

function serializeFormValues(values: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(values).map(([k, v]) => [
      k,
      v != null && typeof (v as Record<string, unknown>)['toISOString'] === 'function'
        ? (v as { toISOString: () => string }).toISOString()
        : v,
    ]),
  );
}

const GET_TENDER_BASIC = gql`
  query GetTenderBasic($id: ID!) {
    getTenderById(id: $id) {
      id
      name
      referenceNumber
      issuingDepartment
      status
      description
      submissionDeadline
      updatedSubmissionDeadline
      sourcePortal
      tenderType
      mailSentAt
      countdownSilenceReason
      drawingRequired
      strRequired
      specificationsRequired
      rejectionReason
      tags {
        id
        name
        color
      }
      documents {
        id
        documentName
        documentUrl
        createdBy
        createdDate
      }
    }
  }
`;

const POST_AWARD_STAGES = [
  { key: 'ORDER_FOLLOWUP',    label: 'Order Follow-Up' },
  { key: 'LOA_PROCESSING',    label: 'LOA Processing' },
  { key: 'ORDER_PROCESSING',  label: 'Order Processing' },
  { key: 'INSPECTION',        label: 'Inspection' },
  { key: 'DISPATCH_DELIVERY', label: 'Dispatch & Delivery' },
  { key: 'WARRANTY',          label: 'Warranty' },
  { key: 'BILL_PAYMENT',      label: 'Bill & Payment' },
  { key: 'SD_RETURN',         label: 'SD Return' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

const TenderDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedVendor, setSelectedVendor] = useState<VendorTender | null>(null);

  const { data: tenderData, loading: tenderLoading } = useQuery<{ getTenderById: TenderBasic }>(
    GET_TENDER_BASIC, { variables: { id }, skip: !id },
  );
  const { data: postAwardData, loading: postAwardLoading } = useGetTenderPostAward(id, selectedVendor?.id);

  const [updateOrderFollowUp, { loading: savingFollowUp }]     = useUpdateOrderFollowUp();
  const [updateOrderProcessing, { loading: savingProcessing }] = useUpdateOrderProcessing();
  const [updateInspection, { loading: savingInspection }]      = useUpdateInspection();
  const [updateDispatchDelivery, { loading: savingDispatch }]  = useUpdateDispatchDelivery();
  const [updateWarranty, { loading: savingWarranty }]          = useUpdateWarranty();
  const [updateBillPayment, { loading: savingBill }]           = useUpdateBillPayment();
  const [updateLoaProcessing, { loading: savingLoa }]          = useUpdateLoaProcessing();
  const [updateSdReturn, { loading: savingSdReturn }]          = useUpdateSdReturn();
  const [advanceStage, { loading: advancing }]                 = useAdvancePostAwardStage();
  const [revertStage, { loading: reverting }]                  = useRevertPostAwardStage();

  const tender    = tenderData?.getTenderById;
  const postAward = postAwardData?.getTenderPostAward;

  const tenderStatus = (tender?.status ?? 'DRAFT') as TenderStatus;

  const currentStageIdx = postAward
    ? POST_AWARD_STAGES.findIndex((s) => s.key === postAward.currentStage)
    : -1;

  const makeSaveHandler = (mutationFn: MutationFn, stageName: string) =>
    async (values: Record<string, unknown>) => {
      try {
        await mutationFn({ variables: { input: { tenderId: id, ...serializeFormValues(values) } } });
        message.success(`${stageName} saved`);
      } catch {
        message.error(`Failed to save ${stageName}`);
      }
    };

  const handleAdvance = async () => {
    try {
      await advanceStage({ variables: { tenderId: id } });
      message.success('Stage advanced');
    } catch {
      message.error('Failed to advance stage');
    }
  };

  const handleRevert = async () => {
    try {
      await revertStage({ variables: { tenderId: id } });
      message.success('Stage reverted');
    } catch {
      message.error('Failed to revert stage');
    }
  };

  if (tenderLoading || postAwardLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 24px', borderBottom: '1px solid #f0f0f0', background: '#fff', flexShrink: 0 }}>
        <Breadcrumb
          items={[
            { title: <a onClick={() => navigate('/tender-workflow')}>Tender Workflow</a> },
            { title: tender?.referenceNumber || tender?.name || 'Tender Details' },
          ]}
          style={{ marginBottom: 6 }}
        />
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tender-workflow')} />
            <div>
              <Title level={4} style={{ margin: 0 }}>{tender?.name ?? 'Tender Details'}</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {tender?.referenceNumber}
                {tender?.issuingDepartment && <> · {tender.issuingDepartment}</>}
              </Text>
            </div>
          </Space>
          <Tag
            color={STATUS_COLORS[tenderStatus] ?? 'blue'}
            style={{ fontSize: 12 }}
          >
            {STATUS_LABELS[tenderStatus] ?? tender?.status?.replace(/_/g, ' ')}
          </Tag>
        </Space>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', background: '#fafafa' }}>

        {/* ── Tender Properties ─────────────────────────────────────────────── */}
        <Card
          title={
            <Space>
              <FileTextOutlined />
              <Text strong style={{ fontSize: 15 }}>Tender Information</Text>
            </Space>
          }
          style={{ marginBottom: 24, borderRadius: 8 }}
          styles={{ body: { padding: '16px 20px' } }}
        >
          {/* Tender Name (prominent) */}
          <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Tender Name</Text>
            <Title level={5} style={{ margin: 0 }}>{tender?.name ?? '—'}</Title>
          </div>

          {/* Basic Information */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>Basic Information</Text>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 20px' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Reference Number</Text>
                <Text>{tender?.referenceNumber ?? '—'}</Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Issuing Department</Text>
                <Text>{tender?.issuingDepartment ?? '—'}</Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Status</Text>
                <Tag color={STATUS_COLORS[tenderStatus] ?? 'blue'} style={{ fontSize: 11 }}>
                  {STATUS_LABELS[tenderStatus] ?? tender?.status?.replace(/_/g, ' ')}
                </Tag>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Source Portal</Text>
                <Text>{tender?.sourcePortal ?? '—'}</Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Tender Type</Text>
                <Text>{tender?.tenderType ?? '—'}</Text>
              </div>
            </div>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Deadlines & Dates */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>Deadlines & Dates</Text>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 20px' }}>
              {tender?.submissionDeadline && (
                <div>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Submission Deadline</Text>
                  <Text>{new Date(tender.submissionDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                </div>
              )}
              {tender?.updatedSubmissionDeadline && (
                <div>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Updated Deadline</Text>
                  <Text>{new Date(tender.updatedSubmissionDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                </div>
              )}
              {tender?.mailSentAt && (
                <div>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Mail Sent At</Text>
                  <Text>{new Date(tender.mailSentAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                </div>
              )}
            </div>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Document Requirements */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>Document Requirements</Text>
            <Space direction="vertical" size={6}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {tender?.drawingRequired ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#d9d9d9' }} />}
                <Text>Drawing Required</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {tender?.strRequired ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#d9d9d9' }} />}
                <Text>STR Required</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {tender?.specificationsRequired ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#d9d9d9' }} />}
                <Text>Specifications Required</Text>
              </div>
            </Space>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Description */}
          {tender?.description && (
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>Description</Text>
              <Text style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{tender.description}</Text>
            </div>
          )}

          {/* Rejection Reason */}
          {tender?.rejectionReason && (
            <>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ padding: 12, background: '#fff2f0', borderRadius: 6, borderLeft: '3px solid #ff4d4f' }}>
                <Text strong style={{ color: '#ff4d4f', display: 'block', marginBottom: 4 }}>Rejection Reason</Text>
                <Text style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{tender.rejectionReason}</Text>
              </div>
            </>
          )}

          {tender?.countdownSilenceReason && (
            <>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ padding: 12, background: '#fffbe6', borderRadius: 6, borderLeft: '3px solid #faad14' }}>
                <Text strong style={{ color: '#ad6800', display: 'block', marginBottom: 4 }}>Countdown Silence Reason</Text>
                <Text style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{tender.countdownSilenceReason}</Text>
              </div>
            </>
          )}

          {tender?.tags && tender.tags.length > 0 && (
            <>
              <Divider style={{ margin: '16px 0' }} />
              <div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>Tags</Text>
                <Space wrap>
                  {tender.tags.map((tag) => (
                    <Tag key={tag.id} color={tag.color || 'blue'} style={{ fontSize: 10 }}>
                      {tag.name}
                    </Tag>
                  ))}
                </Space>
              </div>
            </>
          )}

        </Card>

        {/* ── Vendor Responses ──────────────────────────────────────────────── */}
        <Card
          title={
            <Space>
              <TeamOutlined />
              <Text strong style={{ fontSize: 15 }}>Vendor Responses</Text>
            </Space>
          }
          style={{ marginBottom: 24, borderRadius: 8 }}
          styles={{ body: { padding: '16px 20px' } }}
        >
          <VendorFollowUpSection tenderId={id} tenderStatus={tenderStatus} onVendorSelected={setSelectedVendor} selectedVendor={selectedVendor} postAwardData={postAward} />
        </Card>
        {/* Documents & Requirements */}
        <Card
          title={
            <Space>
              <FileTextOutlined />
              <Text strong style={{ fontSize: 15 }}>Uploaded Documents</Text>
              {tender?.documents && (
                <Tag color="blue">{tender.documents.length}</Tag>
              )}
            </Space>
          }
          style={{ marginBottom: 24, borderRadius: 8 }}
          styles={{ body: { padding: '16px 20px' } }}
        >
          {/* Requirement Flags */}
          <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Space size={4}>
              {tender?.drawingRequired
                ? <CheckCircleFilled style={{ color: '#52c41a' }} />
                : <CloseCircleFilled style={{ color: '#d9d9d9' }} />}
              <Text style={{ fontSize: 13 }}>Drawing Required</Text>
            </Space>
            <Space size={4}>
              {tender?.strRequired
                ? <CheckCircleFilled style={{ color: '#52c41a' }} />
                : <CloseCircleFilled style={{ color: '#d9d9d9' }} />}
              <Text style={{ fontSize: 13 }}>STR Required</Text>
            </Space>
            <Space size={4}>
              {tender?.specificationsRequired
                ? <CheckCircleFilled style={{ color: '#52c41a' }} />
                : <CloseCircleFilled style={{ color: '#d9d9d9' }} />}
              <Text style={{ fontSize: 13 }}>Specifications Required</Text>
            </Space>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {tender?.documents && tender.documents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tender.documents.map((doc) => {
                const isNIT = doc.documentName?.toLowerCase().includes('nit');
                return (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: isNIT ? '#e6f7ff' : '#fafafa',
                      borderRadius: 6,
                      border: isNIT ? '1px solid #1677ff' : '1px solid #f0f0f0',
                    }}
                  >
                    <Space size={8}>
                      <FileTextOutlined style={{ color: isNIT ? '#1677ff' : '#999' }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontSize: 13 }}>{doc.documentName}</Text>
                          {isNIT && <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>NIT</Tag>}
                        </div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Uploaded by {doc.createdBy} on{' '}
                          {new Date(doc.createdDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Text>
                      </div>
                    </Space>
                    {doc.documentUrl && (
                      <Button
                        type="link"
                        size="small"
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <Text type="secondary">No documents uploaded yet.</Text>
          )}
        </Card>
        {/* ── Post-Award Progress (only when record exists) ────────────────── */}
        {postAward && selectedVendor ? (
          <Card
            title={
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                  <TrophyOutlined />
                  <Text strong style={{ fontSize: 15 }}>Post-Award Progress</Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {selectedVendor.vendor?.name ?? `Vendor ${selectedVendor.vendorId}`}
                  </Text>
                </Space>
                {postAward.currentStage !== 'CLOSED' && (
                  <Space>
                    <Button
                      icon={<ArrowLeftOutlined />}
                      size="small"
                      loading={reverting}
                      disabled={currentStageIdx <= 0}
                      onClick={handleRevert}
                    >
                      Go Back
                    </Button>
                    <Button
                      type="primary"
                      icon={<RightCircleOutlined />}
                      size="small"
                      loading={advancing}
                      onClick={handleAdvance}
                    >
                      Advance Stage
                    </Button>
                  </Space>
                )}
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 8 }}
            styles={{ body: { padding: '20px 24px' } }}
          >
            {/* Stage progress bar */}
            <Steps
              current={currentStageIdx}
              size="small"
              style={{ marginBottom: 28 }}
              items={POST_AWARD_STAGES.map((s, i) => ({
                title: s.label,
                status: i < currentStageIdx ? 'finish' : i === currentStageIdx ? 'process' : 'wait',
              }))}
            />

            <Divider style={{ margin: '0 0 20px' }} />

            {/* Stage form content */}
            {postAward.currentStage === 'ORDER_FOLLOWUP' && (
              <OrderFollowUpSection
                data={postAward} saving={savingFollowUp}
                onSave={makeSaveHandler(updateOrderFollowUp as MutationFn, 'Order Follow-Up')}
              />
            )}
            {postAward.currentStage === 'LOA_PROCESSING' && (
              <LoaProcessingSection
                data={postAward} saving={savingLoa}
                onSave={makeSaveHandler(updateLoaProcessing as MutationFn, 'LOA Processing')}
              />
            )}
            {postAward.currentStage === 'ORDER_PROCESSING' && (
              <OrderProcessingSection
                data={postAward} saving={savingProcessing}
                onSave={makeSaveHandler(updateOrderProcessing as MutationFn, 'Order Processing')}
              />
            )}
            {postAward.currentStage === 'INSPECTION' && (
              <InspectionSection
                data={postAward} saving={savingInspection}
                onSave={makeSaveHandler(updateInspection as MutationFn, 'Inspection')}
              />
            )}
            {postAward.currentStage === 'DISPATCH_DELIVERY' && (
              <DispatchDeliverySection
                data={postAward} saving={savingDispatch}
                onSave={makeSaveHandler(updateDispatchDelivery as MutationFn, 'Dispatch & Delivery')}
              />
            )}
            {postAward.currentStage === 'WARRANTY' && (
              <WarrantySection
                data={postAward} saving={savingWarranty}
                onSave={makeSaveHandler(updateWarranty as MutationFn, 'Warranty')}
              />
            )}
            {postAward.currentStage === 'BILL_PAYMENT' && (
              <BillPaymentSection
                data={postAward} saving={savingBill}
                onSave={makeSaveHandler(updateBillPayment as MutationFn, 'Bill & Payment')}
              />
            )}
            {postAward.currentStage === 'SD_RETURN' && (
              <SdReturnSection
                data={postAward} saving={savingSdReturn}
                onSave={makeSaveHandler(updateSdReturn as MutationFn, 'SD Return')}
              />
            )}
          </Card>
        ) : selectedVendor ? (
          <Card style={{ borderRadius: 8 }}>
            <Text type="secondary">
              No post-award record found for {selectedVendor.vendor?.name ?? `Vendor ${selectedVendor.vendorId}`}. 
              Post-award tracking will be available after vendor is marked as winner.
            </Text>
          </Card>
        ) : (
          <Card style={{ borderRadius: 8 }}>
            <Text type="secondary">
              Click on a vendor in the Vendor Responses table to view their post-award progress.
            </Text>
          </Card>
        )}

        {/* ── Documents, Follow-Ups & Activity ─────────────────────────────── */}
        {postAward && selectedVendor && (
          <Card
            style={{ borderRadius: 8 }}
            styles={{ body: { padding: '0 20px 20px' } }}
          >
            <Tabs
              defaultActiveKey="activity"
              items={[
                // {
                //   key: 'documents',
                //   label: (
                //     <span><FileOutlined style={{ marginRight: 6 }} />Documents</span>
                //   ),
                //   children: (
                //     <PostAwardDocumentsPanel
                //       postAwardId={postAward.id}
                //       tenderId={id}
                //       currentStage={postAward.currentStage}
                //     />
                //   ),
                // },
                {
                  key: 'followups',
                  label: (
                    <span><BellOutlined style={{ marginRight: 6 }} />Follow-Ups</span>
                  ),
                  children: (
                    <PostAwardFollowUpsPanel
                      postAwardId={postAward.id}
                      tenderId={id}
                      currentStage={postAward.currentStage}
                    />
                  ),
                },
                // {
                //   key: 'activity',
                //   label: (
                //     <span><HistoryOutlined style={{ marginRight: 6 }} />Activity Log</span>
                //   ),
                //   children: <ActivityTimeline tenderId={id} />,
                // },
              ]}
            />
          </Card>
        )}

      </div>
    </div>
  );
};

export default TenderDetailPage;
