import React from 'react';
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
} from 'antd';
import { ArrowLeftOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  useGetTenderPostAward,
  useUpdateOrderFollowUp,
  useUpdateOrderProcessing,
  useUpdateInspection,
  useUpdateDispatchDelivery,
  useUpdateWarranty,
  useUpdateBillPayment,
  useAdvancePostAwardStage,
} from '../../services/tender-post-award.service';
import {
  OrderFollowUpSection,
  OrderProcessingSection,
  InspectionSection,
  DispatchDeliverySection,
  WarrantySection,
  BillPaymentSection,
} from './StageSections';
import VendorFollowUpSection from './VendorFollowUpSection';

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
  { key: 'ORDER_PROCESSING',  label: 'Order Processing' },
  { key: 'INSPECTION',        label: 'Inspection' },
  { key: 'DISPATCH_DELIVERY', label: 'Dispatch & Delivery' },
  { key: 'WARRANTY',          label: 'Warranty' },
  { key: 'BILL_PAYMENT',      label: 'Bill & Payment' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

const TenderDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: tenderData, loading: tenderLoading } = useQuery<{ getTenderById: TenderBasic }>(
    GET_TENDER_BASIC, { variables: { id }, skip: !id },
  );
  const { data: postAwardData, loading: postAwardLoading } = useGetTenderPostAward(id);

  const [updateOrderFollowUp, { loading: savingFollowUp }]     = useUpdateOrderFollowUp();
  const [updateOrderProcessing, { loading: savingProcessing }] = useUpdateOrderProcessing();
  const [updateInspection, { loading: savingInspection }]      = useUpdateInspection();
  const [updateDispatchDelivery, { loading: savingDispatch }]  = useUpdateDispatchDelivery();
  const [updateWarranty, { loading: savingWarranty }]          = useUpdateWarranty();
  const [updateBillPayment, { loading: savingBill }]           = useUpdateBillPayment();
  const [advanceStage, { loading: advancing }]                 = useAdvancePostAwardStage();

  const tender    = tenderData?.getTenderById;
  const postAward = postAwardData?.getTenderPostAward;

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
          <Tag color="blue" style={{ fontSize: 12 }}>{tender?.status?.replace(/_/g, ' ')}</Tag>
        </Space>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', background: '#fafafa' }}>

        {/* ── Section 1: Vendor Responses ───────────────────────────────────── */}
        <Card
          title={<Text strong style={{ fontSize: 15 }}>Vendor Responses</Text>}
          style={{ marginBottom: 24, borderRadius: 8 }}
          bodyStyle={{ padding: '16px 20px' }}
        >
          <VendorFollowUpSection tenderId={id} />
        </Card>

        {/* ── Section 2: Post-Award Progress ───────────────────────────────── */}
        <Card
          title={
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 15 }}>Post-Award Progress</Text>
              {postAward && postAward.currentStage !== 'CLOSED' && (
                <Button
                  type="primary"
                  icon={<RightCircleOutlined />}
                  size="small"
                  loading={advancing}
                  onClick={handleAdvance}
                >
                  Advance Stage
                </Button>
              )}
            </Space>
          }
          style={{ borderRadius: 8 }}
          bodyStyle={{ padding: '20px 24px' }}
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
          {!postAward ? (
            <Text type="secondary">Post-award record not yet created.</Text>
          ) : (
            <>
              {postAward.currentStage === 'ORDER_FOLLOWUP' && (
                <OrderFollowUpSection
                  data={postAward} saving={savingFollowUp}
                  onSave={makeSaveHandler(updateOrderFollowUp as MutationFn, 'Order Follow-Up')}
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
            </>
          )}
        </Card>

      </div>
    </div>
  );
};

export default TenderDetailPage;
