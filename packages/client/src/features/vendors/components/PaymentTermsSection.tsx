import { useState, useCallback } from 'react';
import { Card, Form, Select, Input, Button as AntButton, Space, Table, Tag, message, Divider, Switch, DatePicker, Modal, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGetPaymentTermsByVendor, useCreatePaymentTerm, useUpdatePaymentTerm, useDeletePaymentTerm } from '../services/payment-terms.service';
import styles from './PaymentTermsSection.module.css';

interface PaymentTerm {
  id: string;
  vendorId: string;
  companyType: string;
  paymentTermType: string;
  commissionStructure?: string;
  otherBenefits: boolean;
  benefitDetails?: string;
  agreementDate?: string;
  fillAmount?: string;
  isActive: boolean;
  createdDate: string;
  createdBy: string;
}

interface PaymentTermsSectionProps {
  vendorId: string | undefined;
  companyType?: string;
  onDataChange?: () => void;
}

const PAYMENT_TERMS_FOR_GMSS = [
  'Advance Payment',
  'Payment Within 30 Days',
  'Payment After 30 Days'
];

const PAYMENT_TERMS_FOR_CONSULTING = [
  'Advance Payment',
  'Payment Within 30 Days',
  'Payment After 30 Days'
];

export default function PaymentTermsSection({ vendorId, companyType, onDataChange }: PaymentTermsSectionProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Hooks for API calls
  const { paymentTerms, loading: termsLoading } = useGetPaymentTermsByVendor(vendorId);
  const createPaymentTerm = useCreatePaymentTerm();
  const updatePaymentTerm = useUpdatePaymentTerm();
  const deletePaymentTerm = useDeletePaymentTerm();

  const isGmssTerm = companyType === 'GMSS' || companyType === 'Vendor';
  const paymentTermOptions = isGmssTerm ? PAYMENT_TERMS_FOR_GMSS : PAYMENT_TERMS_FOR_CONSULTING;

  const handleAddPaymentTerm = useCallback(() => {
    setEditingId(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const handleEditPaymentTerm = useCallback((term: PaymentTerm) => {
    setEditingId(term.id);
    form.setFieldsValue({
      paymentTermType: term.paymentTermType,
      commissionStructure: term.commissionStructure,
      otherBenefits: term.otherBenefits,
      benefitDetails: term.benefitDetails,
      agreementDate: term.agreementDate ? dayjs(term.agreementDate) : undefined,
      fillAmount: term.fillAmount,
    });
    setModalOpen(true);
  }, [form]);

  const handleDeletePaymentTerm = useCallback((id: string) => {
    Modal.confirm({
      title: 'Delete Payment Term',
      content: 'Are you sure you want to delete this payment term?',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deletePaymentTerm(id);
          message.success('Payment term deleted');
          onDataChange?.();
        } catch {
          message.error('Failed to delete payment term');
        }
      },
    });
  }, [deletePaymentTerm, onDataChange]);

  const handleSavePaymentTerm = async () => {
    try {
      await form.validateFields();
      if (!vendorId) {
        message.error('Vendor ID is required');
        return;
      }
      
      setLoading(true);
      const values = form.getFieldsValue();
      
      if (editingId) {
        // Update existing payment term
        await updatePaymentTerm({
          id: editingId,
          ...values,
          agreementDate: values.agreementDate ? values.agreementDate.toISOString() : undefined,
        });
        message.success('Payment term updated');
      } else {
        // Create new payment term
        await createPaymentTerm({
          vendorId,
          companyType: companyType || '',
          ...values,
          agreementDate: values.agreementDate ? values.agreementDate.toISOString() : undefined,
        });
        message.success('Payment term added');
      }
      
      setModalOpen(false);
      form.resetFields();
      onDataChange?.();
    } catch (error) {
      message.error(editingId ? 'Failed to update payment term' : 'Failed to add payment term');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Payment Term Type',
      dataIndex: 'paymentTermType',
      key: 'paymentTermType',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Commission Structure',
      dataIndex: 'commissionStructure',
      key: 'commissionStructure',
      render: (text?: string) => text || '—',
    },
    {
      title: 'Other Benefits',
      dataIndex: 'otherBenefits',
      key: 'otherBenefits',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'default'}>
          {value ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Agreement Date',
      dataIndex: 'agreementDate',
      key: 'agreementDate',
      render: (date?: string) => (date ? dayjs(date).format('DD MMM YYYY') : '—'),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'red'}>
          {value ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_: unknown, record: PaymentTerm) => (
        <Space size={4}>
          <Tooltip title="Edit">
            <AntButton
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditPaymentTerm(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <AntButton
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDeletePaymentTerm(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Payment Terms</h2>
          <p className={styles.sectionSubtitle}>
            Configure payment terms and commission structure based on company type
          </p>
        </div>
        <AntButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddPaymentTerm}
        >
          Add Payment Term
        </AntButton>
      </div>

      {/* Payment Terms Table */}
      <Card className={styles.card}>
        <Table
          columns={columns}
          dataSource={paymentTerms}
          rowKey="id"
          pagination={false}
          loading={termsLoading}
          locale={{
            emptyText: 'No payment terms configured. Click "Add Payment Term" to create one.',
          }}
        />
      </Card>

      {/* Add/Edit Payment Term Modal */}
      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Payment Term' : 'Add Payment Term'}
        onOk={handleSavePaymentTerm}
        onCancel={() => {
          setModalOpen(false);
          setEditingId(null);
          form.resetFields();
        }}
        okText={editingId ? 'Update' : 'Add'}
        cancelText="Cancel"
        centered
        width={700}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Payment Term Type"
            name="paymentTermType"
            rules={[{ required: true, message: 'Please select a payment term type' }]}
          >
            <Select
              placeholder="Select payment term type"
              options={paymentTermOptions.map(term => ({ label: term, value: term }))}
            />
          </Form.Item>

          <Form.Item label="Commission Structure" name="commissionStructure">
            <Select
              placeholder="Select commission structure"
              options={[
                { label: '50% commission on Order and 50% commission on Against payment release', value: '50_50' },
                { label: '100% commission on Against Payment release', value: '100_against' },
              ]}
            />
          </Form.Item>

          <Divider />

          <Form.Item label="Other Benefits" name="otherBenefits" valuePropName="checked">
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.otherBenefits !== currentValues.otherBenefits}>
            {({ getFieldValue }) => getFieldValue('otherBenefits') ? (
              <Form.Item label="Benefit Details" name="benefitDetails">
                <Input.TextArea
                  placeholder="Enter details about other benefits provided"
                  rows={3}
                />
              </Form.Item>
            ) : null}
          </Form.Item>

          <Form.Item label="Agreement Date" name="agreementDate">
            <DatePicker style={{ width: '100%' }} placeholder="Select agreement date" />
          </Form.Item>

          <Form.Item label="Fill Amount" name="fillAmount">
            <Input placeholder="Enter monthly, quarterly, or yearly amount details" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
