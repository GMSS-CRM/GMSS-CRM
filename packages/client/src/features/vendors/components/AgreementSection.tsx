import { useState, useCallback } from 'react';
import {
  Card,
  Form,
  Input,
  Button as AntButton,
  Space,
  Table,
  Tag,
  message,
  Divider,
  Switch,
  DatePicker,
  Row,
  Col,
  Modal,
  Tooltip,
  Select,
  InputNumber,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CalculatorOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useGetVendorAgreements,
  useCreateVendorAgreement,
  useUpdateAgreementSignature,
  type VendorAgreement,
} from '../services/vendors.service';
import { useLazyQuery } from '@apollo/client/react';
import { gql } from 'graphql-tag';

const CALCULATE_COMMISSION_QUERY = gql`
  query CalcCommission(
    $baseAmount: Float!
    $commissionType: CommissionType!
    $commissionValue: Float!
    $gstApplicable: Boolean!
  ) {
    calculateVendorCommission(
      baseAmount: $baseAmount
      commissionType: $commissionType
      commissionValue: $commissionValue
      gstApplicable: $gstApplicable
    ) {
      baseAmount
      commissionAmount
      gstAmount
      totalAmount
    }
  }
`;

interface AgreementSectionProps {
  vendorId: string | undefined;
  vendorStatus?: string;
}

const SIGNATURE_STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: 'Pending Signature' },
  SIGNED: { color: 'green', label: 'Signed' },
  EXPIRED: { color: 'red', label: 'Expired' },
};

export default function AgreementSection({ vendorId }: AgreementSectionProps) {
  const [form] = Form.useForm();
  const [calcForm] = Form.useForm();
  const { agreements, loading, refetch } = useGetVendorAgreements(vendorId);
  const { createAgreement, loading: creating } = useCreateVendorAgreement();
  const { updateSignature, loading: updatingSignature } = useUpdateAgreementSignature();
  const [modalOpen, setModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [calcVisible, setCalcVisible] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<VendorAgreement | null>(null);

  const [calculateCommission, { data: calcData, loading: calculating }] = useLazyQuery<{
    calculateVendorCommission: { baseAmount: number; commissionAmount: number; gstAmount: number; totalAmount: number };
  }>(CALCULATE_COMMISSION_QUERY);

  const calcResult = calcData?.calculateVendorCommission ?? null;

  const handleCreateAgreement = useCallback(async () => {
    try {
      const values = await form.validateFields();
      if (!vendorId) return;
      await createAgreement({
        vendorId,
        agreementStartDate: values.agreementStartDate?.toISOString(),
        agreementEndDate: values.agreementEndDate?.toISOString(),
        renewalReminderDate: values.renewalReminderDate?.toISOString(),
        commissionType: values.commissionType,
        commissionValue: values.commissionValue,
        commissionStructure: values.commissionStructure,
        paymentFrequency: values.paymentFrequency,
        paymentAmount: values.paymentAmount,
        gstApplicable: values.gstApplicable ?? true,
        hasOtherBenefits: values.hasOtherBenefits ?? false,
        otherBenefitsDescription: values.otherBenefitsDescription,
      });
      message.success('Agreement created successfully');
      setModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err) {
      const msg = (err as Error)?.message;
      if (msg && !msg.includes('validation')) message.error(msg);
    }
  }, [form, vendorId, createAgreement, refetch]);

  const handleUpdateSignature = useCallback(async () => {
    if (!selectedAgreement) return;
    try {
      const values = await form.validateFields();
      await updateSignature(
        selectedAgreement.id,
        values.signatureStatus,
        values.signedDate?.toISOString()
      );
      message.success('Signature status updated');
      setSignatureModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err) {
      const msg = (err as Error)?.message;
      if (msg && !msg.includes('validation')) message.error(msg);
    }
  }, [selectedAgreement, form, updateSignature, refetch]);

  const openSignatureModal = useCallback((agreement: VendorAgreement) => {
    setSelectedAgreement(agreement);
    form.setFieldsValue({
      signatureStatus: agreement.signatureStatus,
      signedDate: agreement.signedDate ? dayjs(agreement.signedDate) : undefined,
    });
    setSignatureModalOpen(true);
  }, [form]);

  const handleCalculate = useCallback(async () => {
    try {
      const values = await calcForm.validateFields();
      calculateCommission({
        variables: {
          baseAmount: values.baseAmount,
          commissionType: values.commissionType,
          commissionValue: values.commissionValue,
          gstApplicable: values.gstApplicable ?? false,
        },
      });
    } catch {
      // validation error
    }
  }, [calcForm, calculateCommission]);

  const columns = [
    {
      title: 'Start Date',
      dataIndex: 'agreementStartDate',
      key: 'agreementStartDate',
      render: (d: string) => dayjs(d).format('DD MMM YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'agreementEndDate',
      key: 'agreementEndDate',
      render: (d: string) => dayjs(d).format('DD MMM YYYY'),
    },
    {
      title: 'Signature',
      dataIndex: 'signatureStatus',
      key: 'signatureStatus',
      render: (status: string) => {
        const cfg = SIGNATURE_STATUS_CONFIG[status] ?? { color: 'default', label: status };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Commission',
      key: 'commission',
      render: (_: unknown, record: VendorAgreement) => {
        if (!record.commissionType) return <span style={{ color: '#bfbfbf' }}>—</span>;
        return (
          <span>
            {record.commissionType === 'PERCENTAGE' ? `${record.commissionValue}%` : `₹${record.commissionValue?.toLocaleString()}`}
            {record.commissionStructure && (
              <Tag style={{ marginLeft: 6 }} color="geekblue">
                {record.commissionStructure === 'SPLIT_50_50' ? '50/50' : '100% On Payment'}
              </Tag>
            )}
          </span>
        );
      },
    },
    {
      title: 'GST',
      dataIndex: 'gstApplicable',
      key: 'gstApplicable',
      width: 70,
      render: (v: boolean) => <Tag color={v ? 'blue' : 'default'}>{v ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_: unknown, record: VendorAgreement) => {
        if (!record.paymentFrequency) return <span style={{ color: '#bfbfbf' }}>—</span>;
        return `${record.paymentFrequency} — ₹${record.paymentAmount?.toLocaleString() ?? 0}`;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, record: VendorAgreement) => (
        <Tooltip title="Update Signature">
          <AntButton
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openSignatureModal(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
            Tie-Up Agreements
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Manage vendor agreements, commission structures and payment terms
          </p>
        </div>
        <Space>
          <AntButton
            icon={<CalculatorOutlined />}
            onClick={() => setCalcVisible(!calcVisible)}
          >
            Commission Calculator
          </AntButton>
          <AntButton type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }}>
            New Agreement
          </AntButton>
        </Space>
      </div>

      {/* Commission Calculator */}
      {calcVisible && (
        <Card
          size="small"
          title={<span><CalculatorOutlined style={{ marginRight: 8 }} />Commission Calculator</span>}
          style={{ marginBottom: 16, border: '1px solid var(--border-color)' }}
          extra={<AntButton type="text" size="small" onClick={() => { setCalcVisible(false); calcForm.resetFields(); }}>Close</AntButton>}
        >
          <Form form={calcForm} layout="inline" style={{ flexWrap: 'wrap', gap: 8 }}>
            <Form.Item label="Base Amount (₹)" name="baseAmount" rules={[{ required: true }]}>
              <InputNumber min={0} placeholder="e.g. 100000" style={{ width: 160 }} />
            </Form.Item>
            <Form.Item label="Commission Type" name="commissionType" rules={[{ required: true }]}>
              <Select placeholder="Type" style={{ width: 130 }}>
                <Select.Option value="PERCENTAGE">Percentage</Select.Option>
                <Select.Option value="FIXED">Fixed Amount</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Value" name="commissionValue" rules={[{ required: true }]}>
              <InputNumber min={0} placeholder="e.g. 5" style={{ width: 100 }} />
            </Form.Item>
            <Form.Item label="GST Applicable" name="gstApplicable" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" onClick={handleCalculate} loading={calculating} icon={<CalculatorOutlined />}>
                Calculate
              </AntButton>
            </Form.Item>
          </Form>
          {calcResult && (
            <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Base Amount', value: `₹${calcResult.baseAmount.toLocaleString()}` },
                { label: 'Commission', value: `₹${calcResult.commissionAmount.toLocaleString()}`, highlight: true },
                { label: 'GST', value: `₹${calcResult.gstAmount.toLocaleString()}` },
                { label: 'Total Payable', value: `₹${calcResult.totalAmount.toLocaleString()}`, bold: true },
              ].map(({ label, value, highlight, bold }) => (
                <div key={label} style={{ background: 'var(--bg-muted)', padding: '8px 16px', borderRadius: 6, minWidth: 140 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: bold ? 700 : highlight ? 600 : 400, color: highlight ? 'var(--color-primary, #1677ff)' : 'var(--text-primary)' }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Agreements table */}
      <Card style={{ border: '1px solid var(--border-color)', borderRadius: 8 }}>
        <Table
          columns={columns}
          dataSource={agreements}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{ emptyText: 'No agreements yet. Click "New Agreement" to create one.' }}
        />
      </Card>

      {/* Create Agreement Modal */}
      <Modal
        open={modalOpen}
        title={<span><SafetyCertificateOutlined style={{ marginRight: 8 }} />Create Tie-Up Agreement</span>}
        onOk={handleCreateAgreement}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okText="Create Agreement"
        confirmLoading={creating}
        width={720}
        centered
        destroyOnHidden
      >
        <Alert
          type="info"
          showIcon
          message="An accepted proposal must exist for this vendor before creating an agreement."
          style={{ marginBottom: 16 }}
        />
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Agreement Start Date"
                name="agreementStartDate"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Agreement End Date"
                name="agreementEndDate"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Renewal Reminder Date" name="renewalReminderDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Commission Terms</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Commission Type" name="commissionType">
                <Select placeholder="Select type">
                  <Select.Option value="PERCENTAGE">Percentage (%)</Select.Option>
                  <Select.Option value="FIXED">Fixed Amount (₹)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Commission Value" name="commissionValue">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="e.g. 5 for 5%" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Commission Structure" name="commissionStructure">
                <Select placeholder="Select structure">
                  <Select.Option value="SPLIT_50_50">50% on Order + 50% on Payment Release</Select.Option>
                  <Select.Option value="FULL_ON_PAYMENT">100% on Against Payment Release</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Payment Terms</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Payment Frequency" name="paymentFrequency">
                <Select placeholder="Select frequency">
                  <Select.Option value="MONTHLY">Monthly</Select.Option>
                  <Select.Option value="QUARTERLY">Quarterly</Select.Option>
                  <Select.Option value="YEARLY">Yearly</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Payment Amount (₹)" name="paymentAmount">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Amount per period" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="GST Applicable" name="gstApplicable" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Other Benefits</Divider>

          <Form.Item label="Other Benefits" name="hasOtherBenefits" valuePropName="checked" initialValue={false}>
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.hasOtherBenefits !== curr.hasOtherBenefits}
          >
            {({ getFieldValue }) =>
              getFieldValue('hasOtherBenefits') ? (
                <Form.Item label="Benefits Description" name="otherBenefitsDescription">
                  <Input.TextArea rows={3} placeholder="Describe the other benefits included in this agreement" />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Signature Modal */}
      <Modal
        open={signatureModalOpen}
        title={<span><CheckCircleOutlined style={{ marginRight: 8 }} />Update Signature Status</span>}
        onOk={handleUpdateSignature}
        onCancel={() => { setSignatureModalOpen(false); form.resetFields(); setSelectedAgreement(null); }}
        okText="Update"
        confirmLoading={updatingSignature}
        centered
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Signature Status"
            name="signatureStatus"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Select>
              <Select.Option value="PENDING">Pending Signature</Select.Option>
              <Select.Option value="SIGNED">Signed</Select.Option>
              <Select.Option value="EXPIRED">Expired</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.signatureStatus !== curr.signatureStatus}
          >
            {({ getFieldValue }) =>
              getFieldValue('signatureStatus') === 'SIGNED' ? (
                <Form.Item label="Signed Date" name="signedDate">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
        {selectedAgreement?.signatureStatus === 'PENDING' && (
          <Alert
            type="warning"
            showIcon
            message="Marking as SIGNED will automatically move this vendor to Final status."
            style={{ marginTop: 8 }}
          />
        )}
      </Modal>
    </div>
  );
}
