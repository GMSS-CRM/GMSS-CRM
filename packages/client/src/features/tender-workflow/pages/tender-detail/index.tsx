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
} from '@ant-design/icons';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import type { VendorTender } from '@gmss/types';
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
            { title: tender?.referenceNumber ?? id },
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
          <VendorFollowUpSection tenderId={id} onVendorSelected={setSelectedVendor} selectedVendor={selectedVendor} postAwardData={postAward} />
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
