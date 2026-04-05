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
  Upload,
  Progress,
  Typography 
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CalculatorOutlined,
  SafetyCertificateOutlined,
  InboxOutlined,
  FilePdfOutlined,
  BellOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useGetVendorAgreements,
  useCreateVendorAgreement,
  useUpdateAgreementSignature,
  type VendorAgreement,
} from '../services/vendors.service';
import { useFirebaseUpload } from '../../tender-workflow/hooks/useFirebaseUpload';
import { useLazyQuery } from '@apollo/client/react';
import { gql } from 'graphql-tag';

const { Text } = Typography;
const GST_RATE = 0.18;

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
  companyType?: string;
}

const SIGNATURE_STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: 'Pending Signature' },
  SIGNED: { color: 'green', label: 'Signed' },
  EXPIRED: { color: 'red', label: 'Expired' },
};

const PAYMENT_TERM_LABELS: Record<string, string> = {
  ADVANCE_PAYMENT: 'Advance Payment',
  PAYMENT_WITHIN_30_DAYS: 'Payment Within 30 Days',
  PAYMENT_AFTER_30_DAYS: 'Payment After 30 Days',
};

export default function AgreementSection({ vendorId, companyType }: AgreementSectionProps) {
  const [form] = Form.useForm();
  const [signatureForm] = Form.useForm();
  const [calcForm] = Form.useForm();
  const { agreements, loading, refetch } = useGetVendorAgreements(vendorId);
  const { createAgreement, loading: creating } = useCreateVendorAgreement();
  const { updateSignature, loading: updatingSignature } = useUpdateAgreementSignature();
  const { uploadFile, isLoading: uploading } = useFirebaseUpload();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [calcVisible, setCalcVisible] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<VendorAgreement | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string; path: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [hasOtherBenefits, setHasOtherBenefits] = useState(false);
  const [isDirtyAgreement, setIsDirtyAgreement] = useState(false);
  const [isDirtySignature, setIsDirtySignature] = useState(false);

  const gstAmount = paymentAmount ? Math.round(paymentAmount * GST_RATE) : null;
  const totalWithGst = paymentAmount && gstAmount ? paymentAmount + gstAmount : null;
  const isVendor = companyType === 'Vendor';

  const [calculateCommission, { data: calcData, loading: calculating }] = useLazyQuery<{
    calculateVendorCommission: { baseAmount: number; commissionAmount: number; gstAmount: number; totalAmount: number };
  }>(CALCULATE_COMMISSION_QUERY);

  const calcResult = calcData?.calculateVendorCommission ?? null;

  const openModal = useCallback(() => {
    form.resetFields();
    setUploadedFile(null);
    setUploadProgress(0);
    setPaymentAmount(null);
    setHasOtherBenefits(false);
    setIsDirtyAgreement(false);
    setModalOpen(true);
  }, [form]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    form.resetFields();
    setUploadedFile(null);
    setUploadProgress(0);
    setPaymentAmount(null);
    setHasOtherBenefits(false);
    setIsDirtyAgreement(false);
  }, [form]);

  const handleCreateAgreement = useCallback(async () => {
    try {
      const values = await form.validateFields();
      if (!vendorId) return;
      await createAgreement({
        vendorId,
        agreementStartDate: values.agreementStartDate?.toISOString(),
        agreementEndDate: values.agreementEndDate?.toISOString(),
        renewalReminderDate: values.renewalReminderDate?.toISOString(),
        paymentTermType: values.paymentTermType,
        commissionType: values.commissionType,
        commissionValue: values.commissionValue,
        commissionStructure: values.commissionStructure,
        paymentFrequency: values.paymentFrequency,
        paymentAmount: values.paymentAmount,
        gstApplicable: true,
        hasOtherBenefits: values.hasOtherBenefits ?? false,
        otherBenefitsDescription: values.otherBenefitsDescription,
        documentUrl: uploadedFile?.url,
        documentPath: uploadedFile?.path,
      });
      message.success('Agreement created successfully');
      closeModal();
      refetch();
    } catch (err: any) {
      if (err?.errorFields) return; // Inline validation messages shown by Form
      const msg = err instanceof Error ? err.message : 'Failed to create agreement';
      message.error(msg);
    }
  }, [form, vendorId, createAgreement, refetch, uploadedFile, closeModal]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setUploadProgress(0);
        const result = await uploadFile(file, `agreements/vendor-${vendorId}`);
        setUploadedFile({
          name: file.name,
          url: result.downloadUrl,
          path: result.path,
        });
        message.success('Agreement document uploaded successfully');
        return false; // Prevent default upload
      } catch (err) {
        const msg = (err as Error)?.message || 'Upload failed';
        message.error(msg);
        return false;
      }
    },
    [uploadFile, vendorId]
  );

  const handleUpdateSignature = useCallback(async () => {
    if (!selectedAgreement) return;
    try {
      const values = await signatureForm.validateFields();
      await updateSignature(
        selectedAgreement.id,
        values.signatureStatus,
        values.signedDate?.toISOString()
      );
      message.success('Signature status updated');
      setSignatureModalOpen(false);
      signatureForm.resetFields();
      setSelectedAgreement(null);
      refetch();
    } catch (err: any) {
      if (err?.errorFields) return;
      const msg = err instanceof Error ? err.message : 'Failed to update signature';
      message.error(msg);
    }
  }, [selectedAgreement, signatureForm, updateSignature, refetch]);

  const openSignatureModal = useCallback((agreement: VendorAgreement) => {
    setSelectedAgreement(agreement);
    signatureForm.setFieldsValue({
      signatureStatus: agreement.signatureStatus,
      signedDate: agreement.signedDate ? dayjs(agreement.signedDate) : undefined,
    });
    setIsDirtySignature(false);
    setSignatureModalOpen(true);
  }, [signatureForm]);

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
      width: 110,
      render: (d: string) => {
        // Strict parsing with multiple format options from backend
        const parsed = dayjs(d, ['YYYY-MM-DDTHH:mm:ss.SSSZ', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DD'], true);
        if (parsed.isValid()) {
          return parsed.format('DD MMM YYYY');
        }
        // Fallback for invalid format
        return dayjs(d).format('DD MMM YYYY');
      },
    },
    {
      title: 'End Date',
      dataIndex: 'agreementEndDate',
      key: 'agreementEndDate',
      width: 110,
      render: (d: string) => {
        // Strict parsing with multiple format options from backend
        const parsed = dayjs(d, ['YYYY-MM-DDTHH:mm:ss.SSSZ', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DD'], true);
        if (parsed.isValid()) {
          return parsed.format('DD MMM YYYY');
        }
        // Fallback for invalid format
        return dayjs(d).format('DD MMM YYYY');
      },
    },
    ...(isVendor ? [{
      title: 'Payment Term',
      dataIndex: 'paymentTermType',
      key: 'paymentTermType',
      width: 160,
      render: (type?: string) =>
        type ? <Tag color="purple">{PAYMENT_TERM_LABELS[type] ?? type}</Tag>
             : <span style={{ color: '#bfbfbf' }}>—</span>,
    }] : []),
    {
      title: 'Signature',
      dataIndex: 'signatureStatus',
      key: 'signatureStatus',
      width: 130,
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
      title: 'Other Benefits',
      dataIndex: 'hasOtherBenefits',
      key: 'hasOtherBenefits',
      width: 100,
      render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Payment (incl. GST)',
      key: 'payment',
      render: (_: unknown, record: VendorAgreement) => {
        if (!record.paymentAmount) return <span style={{ color: '#bfbfbf' }}>—</span>;
        const total = Math.round(record.paymentAmount * (1 + GST_RATE));
        return (
          <span>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.paymentFrequency} | </Text>
            ₹{total.toLocaleString()}
            <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>(incl. 18%)</Text>
          </span>
        );
      },
    },
    {
      title: 'Doc',
      key: 'document',
      width: 60,
      render: (_: unknown, record: VendorAgreement) =>
        record.documentUrl ? (
          <Tooltip title="Download Agreement">
            <AntButton type="link" size="small" icon={<FilePdfOutlined />} href={record.documentUrl} target="_blank" />
          </Tooltip>
        ) : <span style={{ color: '#bfbfbf' }}>—</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 70,
      align: 'center' as const,
      render: (_: unknown, record: VendorAgreement) => (
        <Tooltip title="Update Signature">
          <AntButton type="text" size="small" icon={<EditOutlined />} onClick={() => openSignatureModal(record)} />
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
            Agreement & Payment Terms
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            {isVendor
              ? 'GMSS Vendor — commission structure, payment terms and agreement documents'
              : 'Consulting Party — commission structure and other benefit details'}
          </p>
        </div>
        <Space>
          <AntButton
            icon={<CalculatorOutlined />}
            onClick={() => setCalcVisible(!calcVisible)}
          >
            Commission Calculator
          </AntButton>
          <AntButton type="primary" icon={<PlusOutlined />} onClick={openModal}>
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
          scroll={{ x: 900 }}
          locale={{ emptyText: 'No agreements yet. Click "New Agreement" to create one.' }}
        />
      </Card>

      {/* Create Agreement Modal */}
      <Modal
        open={modalOpen}
        title={
          <span>
            <SafetyCertificateOutlined style={{ marginRight: 8 }} />
            {isVendor ? 'New Agreement — GMSS Vendor' : 'New Agreement — Consulting Party'}
          </span>
        }
        onOk={handleCreateAgreement}
        onCancel={closeModal}
        okText="Create Agreement"
        confirmLoading={creating || uploading}
        width={720}
        centered
        destroyOnHidden
        okButtonProps={{ disabled: !isDirtyAgreement }}
      >
        <Alert
          type="info"
          showIcon
          message="An accepted proposal must exist for this vendor before creating an agreement."
          style={{ marginBottom: 16 }}
        />
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 8 }}
          onValuesChange={(changed) => {
            if ('paymentAmount' in changed) setPaymentAmount(changed.paymentAmount ?? null);
            if ('hasOtherBenefits' in changed) setHasOtherBenefits(changed.hasOtherBenefits ?? false);
            setIsDirtyAgreement(true);
          }}
        >
          <Divider>Agreement Dates</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Start Date"
                name="agreementStartDate"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="End Date"
                name="agreementEndDate"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Renewal Reminder" name="renewalReminderDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {isVendor && (
            <>
              <Divider>Payment Terms</Divider>
              <Form.Item
                label="Select Payment Term"
                name="paymentTermType"
                rules={[{ required: true, message: 'Payment term is required' }]}
              >
                <Select placeholder="Select payment term">
                  <Select.Option value="ADVANCE_PAYMENT">Advance Payment</Select.Option>
                  <Select.Option value="PAYMENT_WITHIN_30_DAYS">Payment Within 30 Days</Select.Option>
                  <Select.Option value="PAYMENT_AFTER_30_DAYS">Payment After 30 Days</Select.Option>
                </Select>
              </Form.Item>
              <Alert
                type="warning"
                showIcon
                icon={<BellOutlined />}
                message="A notification will be auto-generated for the selected payment term."
                style={{ marginBottom: 16 }}
              />
            </>
          )}

          <Divider>Commission</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Commission Type" name="commissionType">
                <Select placeholder="Select type">
                  <Select.Option value="PERCENTAGE">Percentage (%)</Select.Option>
                  <Select.Option value="FIXED">Fixed Amount (₹)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Commission Value" name="commissionValue">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="e.g. 5" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Commission Structure" name="commissionStructure">
                <Select placeholder="Select structure">
                  <Select.Option value="SPLIT_50_50">50% Order + 50% Payment</Select.Option>
                  <Select.Option value="FULL_ON_PAYMENT">100% On Payment Release</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Alert
            type="info"
            showIcon
            icon={<BellOutlined />}
            message="A notification will be auto-generated based on the commission structure selected."
            style={{ marginBottom: 16 }}
          />

          <Divider>Other Benefits from Other Party</Divider>
          <Form.Item
            label="Does this agreement include other benefits?"
            name="hasOtherBenefits"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>

          {!hasOtherBenefits ? (
            <Alert
              type="success"
              showIcon
              icon={<InfoCircleOutlined />}
              message="No additional benefits — this vendor will be eligible to be marked as Final Company once the agreement is signed."
              style={{ marginBottom: 8 }}
            />
          ) : (
            <>
              <Form.Item
                label="Benefits Description"
                name="otherBenefitsDescription"
                rules={[{ required: true, message: 'Please describe the other benefits' }]}
              >
                <Input.TextArea rows={3} placeholder="Describe the other benefits included in this agreement" />
              </Form.Item>

              <Divider>Benefit Payment Details</Divider>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Payment Frequency"
                    name="paymentFrequency"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Select placeholder="Select frequency">
                      <Select.Option value="MONTHLY">Monthly</Select.Option>
                      <Select.Option value="QUARTERLY">Quarterly</Select.Option>
                      <Select.Option value="YEARLY">Yearly</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Payment Amount (₹)"
                    name="paymentAmount"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Amount per period" />
                  </Form.Item>
                </Col>
                {totalWithGst !== null && (
                  <Col span={8}>
                    <div style={{ padding: '4px 0', fontSize: 13 }}>
                      <div style={{ marginBottom: 4, fontWeight: 500 }}>GST Breakdown (18%)</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div>
                          <Text type="secondary">Base: </Text>
                          <Text>₹{paymentAmount?.toLocaleString()}</Text>
                        </div>
                        <div>
                          <Text type="secondary">GST: </Text>
                          <Text>₹{gstAmount?.toLocaleString()}</Text>
                        </div>
                        <div>
                          <Text strong>Total: ₹{totalWithGst.toLocaleString()}</Text>
                        </div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
              <Alert
                type="info"
                showIcon
                icon={<BellOutlined />}
                message="A notification will be auto-generated for this benefit payment. Vendor can still be marked as Final Company after agreement is signed."
                style={{ marginBottom: 8 }}
              />
            </>
          )}

          <Divider>Agreement Document</Divider>

          {uploadedFile ? (
            <div style={{ padding: '12px', background: 'var(--bg-muted)', borderRadius: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FilePdfOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{uploadedFile.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Document uploaded successfully</div>
                </div>
              </div>
              <AntButton
                type="text"
                danger
                size="small"
                onClick={() => setUploadedFile(null)}
              >
                Remove
              </AntButton>
            </div>
          ) : (
            <Form.Item name="document">
              <Upload.Dragger
                maxCount={1}
                beforeUpload={handleFileUpload}
                fileList={[]}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Progress type="circle" percent={uploadProgress} width={60} />
                    <p style={{ marginTop: '8px' }}>Uploading...</p>
                  </>
                ) : (
                  <>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to upload agreement document</p>
                    <p className="ant-upload-hint">Supported: PDF, DOCX, DOC, XLS, XLSX</p>
                  </>
                )}
              </Upload.Dragger>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Update Signature Modal */}
      <Modal
        open={signatureModalOpen}
        title={<span><CheckCircleOutlined style={{ marginRight: 8 }} />Update Signature Status</span>}
        onOk={handleUpdateSignature}
        onCancel={() => { setSignatureModalOpen(false); signatureForm.resetFields(); setSelectedAgreement(null); }}
        okText="Update"
        confirmLoading={updatingSignature}
        centered
        destroyOnHidden
        okButtonProps={{ disabled: !isDirtySignature }}
      >
        <Form form={signatureForm} layout="vertical" style={{ marginTop: 16 }} onValuesChange={() => setIsDirtySignature(true)}>
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
