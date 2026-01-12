import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button as AntButton,
  Space,
  message,
  Tag,
  Table,
  Row,
  Col,
  Card,
} from 'antd';
import {
  ArrowLeftOutlined,
  SendOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Vendor, VendorDocument, Tag as VendorTag } from '../../types';
import Button from '../../../../components/button';
import SubMenu from '../../../../components/sub-menu';
import type { SubMenuItemConfig } from '../../../../components/sub-menu';
import {
  fetchVendorById,
  createVendor,
  updateVendor,
  fetchTags,
  fetchVendorDocuments,
} from '../../services/vendors.service';
import styles from './styles.module.css';

const { TextArea } = Input;

type VendorSubMenuItem = 'basic' | 'documents';

const VENDOR_MENU_ITEMS: SubMenuItemConfig[] = [
  {
    key: 'basic',
    icon: <InfoCircleOutlined />,
    label: 'Basic Info',
  },
  {
    key: 'documents',
    icon: <FileTextOutlined />,
    label: 'Documents',
  },
];

export default function VendorDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [tags, setTags] = useState<VendorTag[]>([]);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [selectedSubMenu, setSelectedSubMenu] = useState<VendorSubMenuItem>('basic');

  const isEditMode = !!id;

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load tags
        const tagsData = await fetchTags();
        setTags(tagsData);

        // Load vendor if editing
        if (id) {
          const vendorData = await fetchVendorById(id);
          if (vendorData) {
            setVendor(vendorData);
            form.setFieldsValue({
              companyName: vendorData.companyName,
              vendorType: vendorData.vendorType,
              address: vendorData.address,
              contactPersons: vendorData.contactPersons,
              gstNumber: vendorData.gstNumber,
              panNumber: vendorData.panNumber,
              msmeNumber: vendorData.msmeNumber,
              cinNumber: vendorData.cinNumber,
              tags: vendorData.tags,
            });

            // Load documents
            const docsData = await fetchVendorDocuments(id);
            setDocuments(docsData);
          } else {
            message.error('Vendor not found');
            navigate('/vendors');
          }
        }
      } catch (error) {
        message.error('Failed to load data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, form, navigate]);

  const handleBack = useCallback(() => {
    navigate('/vendors');
  }, [navigate]);

  const buildVendorData = useCallback((values: any, status: 'Draft' | 'Submitted') => ({
    companyName: values.companyName,
    vendorType: values.vendorType,
    address: values.address,
    contactPersons: values.contactPersons,
    gstNumber: values.gstNumber,
    panNumber: values.panNumber,
    msmeNumber: values.msmeNumber,
    cinNumber: values.cinNumber,
    tags: values.tags || [],
    status,
    createdBy: 'current-user', // TODO: Get from auth context
  }), []);


  const handleSubmitForApproval = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const vendorData = buildVendorData(values, 'Submitted');

      if (isEditMode && vendor) {
        await updateVendor(vendor.id, vendorData);
        message.success('Vendor submitted for approval');
      } else {
        await createVendor(vendorData);
        message.success('Vendor submitted for approval');
      }

      navigate('/vendors');
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        message.warning('Please fill in all required fields');
      } else {
        message.error('Failed to submit vendor');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, [form, isEditMode, vendor, navigate, buildVendorData]);

  const documentColumns: ColumnsType<VendorDocument> = [
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      key: 'documentType',
      width: '25%',
      render: (type: string) => (
        <span style={{ fontWeight: 500 }}>{type}</span>
      ),
    },
    {
      title: 'File',
      dataIndex: 'fileName',
      key: 'fileName',
      width: '25%',
      render: (fileName: string | undefined) => (
        fileName ? (
          <AntButton 
            type="link" 
            size="small" 
            icon={<FileTextOutlined />}
            style={{ padding: 0 }}
          >
            View
          </AntButton>
        ) : (
          <AntButton 
            type="link" 
            size="small" 
            icon={<UploadOutlined />}
            style={{ padding: 0 }}
          >
            Upload
          </AntButton>
        )
      ),
    },
    {
      title: 'Expired',
      dataIndex: 'expired',
      key: 'expired',
      width: '15%',
      render: (_: any, record: VendorDocument) => {
        if (record.expired) {
          return <Tag color="error">Expired{record.expiryDate ? ` (${record.expiryDate})` : ''}</Tag>;
        }
        return <Tag color="success">Not Expired</Tag>;
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '35%',
      render: (remarks?: string) => (
        <span style={{ color: remarks ? '#595959' : '#bfbfbf', fontSize: '13px' }}>
          {remarks || '—'}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Space>
          <Button
            variant="ghost"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          />
          <div>
            <Space size="middle" align="center">
              <h1 className={styles.title}>
                {isEditMode ? 'Edit Vendor' : 'Create Vendor'}
              </h1>
              {isEditMode && vendor?.vendorCode && (
                <Tag color="blue" style={{ fontSize: '13px', padding: '4px 12px' }}>
                  {vendor.vendorCode}
                </Tag>
              )}
              {!isEditMode && (
                <Tag color="default" style={{ fontSize: '12px', padding: '3px 10px' }}>
                  Code: Will be generated after save
                </Tag>
              )}
            </Space>
            <p className={styles.subtitle}>
              {isEditMode
                ? 'Update vendor information'
                : 'Add a new vendor to the system'}
            </p>
          </div>
        </Space>
        {/* Show submit button only for Draft, Rejected, or new vendors */}
        {(!vendor || vendor.status === 'Draft' || vendor.status === 'Rejected') && (
          <Space>
            <AntButton
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmitForApproval}
              loading={loading}
            >
              {vendor?.status === 'Rejected' ? 'Resubmit for Approval' : 'Submit for Approval'}
            </AntButton>
          </Space>
        )}
        {/* Show read-only indicator for Submitted/Approved vendors */}
        {vendor && (vendor.status === 'Submitted' || vendor.status === 'Approved') && (
          <Tag 
            icon={<LockOutlined />} 
            color={vendor.status === 'Approved' ? 'success' : 'processing'}
            style={{ fontSize: '13px', padding: '6px 14px' }}
          >
            {vendor.status === 'Approved' ? 'Approved - Read Only' : 'Under Review - Read Only'}
          </Tag>
        )}
      </div>

      <div className={styles.content}>
        {/* Left Sidebar - SubMenu */}
        <div className={styles.sidebar}>
          <SubMenu
            title="Vendor Details"
            selectedMenu={selectedSubMenu}
            onMenuChange={(key) => setSelectedSubMenu(key as VendorSubMenuItem)}
            items={VENDOR_MENU_ITEMS}
          />
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {selectedSubMenu === 'basic' && (
            <BasicInfoSection form={form} tags={tags} vendor={vendor} />
          )}

          {selectedSubMenu === 'documents' && (
            <DocumentsSection
              documents={documents}
              documentColumns={documentColumns}
              onAddDocument={(doc) => setDocuments((prev) => [...prev, doc])}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Basic Info Section Component
interface BasicInfoSectionProps {
  form: any;
  tags: VendorTag[];
  vendor: Vendor | null;
}

function BasicInfoSection({ form, tags, vendor }: BasicInfoSectionProps) {
  // Determine if form should be disabled based on status
  const isFormDisabled = vendor?.status === 'Submitted' || vendor?.status === 'Approved';
  const isRejected = vendor?.status === 'Rejected';

  // Reusable handler for uppercase input fields
  const handleUppercaseInput = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    form.setFieldValue(fieldName, value);
  };

  return (
    <div className={styles.section}>
      {/* Status-based banners */}
      {vendor?.status === 'Submitted' && (
        <div className={`${styles.statusBanner} ${styles.statusBannerInfo}`}>
          <InfoCircleOutlined style={{ fontSize: '16px' }} />
          <span>
            Under Review - This vendor is currently being reviewed by approvers. Form is read-only.
          </span>
        </div>
      )}

      {vendor?.status === 'Approved' && (
        <div className={`${styles.statusBanner} ${styles.statusBannerSuccess}`}>
          <CheckCircleOutlined style={{ fontSize: '16px' }} />
          <span>
            Approved - This vendor has been approved and is active in the system.
          </span>
        </div>
      )}

      {isRejected && (
        <div className={`${styles.statusBanner} ${styles.statusBannerError}`}>
          <ExclamationCircleOutlined style={{ fontSize: '16px', marginTop: '2px' }} />
          <div className={styles.statusBannerContent}>
            <div className={styles.statusBannerTitle}>
              Rejected - Action Required
            </div>
            <div className={styles.statusBannerText}>
              Please review the rejection comments in the Approval tab, make necessary changes, and resubmit.
            </div>
          </div>
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Basic Information</h2>
        <p className={styles.sectionSubtitle}>Enter vendor company and contact details</p>
      </div>

      <Card className={styles.card}>
        <Form form={form} layout="vertical" className={styles.form} disabled={isFormDisabled}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Company Name"
                name="companyName"
                rules={[
                  { required: true, message: 'Please enter company name' },
                ]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Vendor Type"
                name="vendorType"
                rules={[
                  { required: true, message: 'Please select vendor type' },
                ]}
              >
                <Select placeholder="Select vendor type">
                  <Select.Option value="Vendor">Vendor</Select.Option>
                  <Select.Option value="Consultant">Consultant</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Business Identity Section */}
            <Col span={24}>
              <div className={styles.sectionDivider}>
                <h3 className={styles.sectionDividerTitle}>
                  Business Identity
                </h3>
                <p className={styles.sectionDividerSubtitle}>
                  Company registration and tax identification details
                </p>
              </div>
            </Col>

            <Col span={12}>
              <Form.Item
                label="GST Number"
                name="gstNumber"
                tooltip="Goods and Services Tax Identification Number (15 digits)"
              >
                <Input 
                  placeholder="e.g., 29ABCDE1234F1Z5" 
                  maxLength={15}
                  style={{ textTransform: 'uppercase' }}
                  onChange={handleUppercaseInput('gstNumber')}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="PAN Number"
                name="panNumber"
                tooltip="Permanent Account Number (10 characters)"
              >
                <Input 
                  placeholder="e.g., ABCDE1234F" 
                  maxLength={10}
                  style={{ textTransform: 'uppercase' }}
                  onChange={handleUppercaseInput('panNumber')}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="MSME / UDYAM Number"
                name="msmeNumber"
                tooltip="Micro, Small and Medium Enterprises registration number (Optional)"
              >
                <Input 
                  placeholder="e.g., UDYAM-KA-12-1234567" 
                  style={{ textTransform: 'uppercase' }}
                  onChange={handleUppercaseInput('msmeNumber')}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="CIN Number"
                name="cinNumber"
                tooltip="Corporate Identity Number (21 characters, Optional)"
              >
                <Input 
                  placeholder="e.g., U72900KA2015PTC123456" 
                  maxLength={21}
                  style={{ textTransform: 'uppercase' }}
                  onChange={handleUppercaseInput('cinNumber')}
                />
              </Form.Item>
            </Col>

            {/* Contact Information Section */}
            <Col span={24}>
              <div className={styles.sectionDivider}>
                <h3 className={styles.sectionDividerTitle}>
                  Contact Information
                </h3>
                <p className={styles.sectionDividerSubtitle}>
                  Add one or more contact persons for this vendor
                </p>
              </div>
            </Col>

            <Col span={24}>
              <ContactPersonsSection form={form} disabled={isFormDisabled} />
            </Col>

            <Col span={12}>
              <Form.Item label="Tags / Categories" name="tags">
                <Select
                  mode="multiple"
                  placeholder="Select tags"
                  allowClear
                >
                  {tags.map((tag) => (
                    <Select.Option key={tag.id} value={tag.id}>
                      {tag.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Address" name="address">
                <TextArea
                  placeholder="Enter complete address"
                  rows={3}
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>

          {form.getFieldValue('tags')?.length > 0 && tags.length > 0 && (
            <div className={styles.tagsPreview}>
              <div className={styles.tagsPreviewLabel}>Selected Tags:</div>
              <div className={styles.selectedTags}>
                {form.getFieldValue('tags')?.map((tagId: string) => {
                  const tag = tags.find((t) => t.id === tagId);
                  return tag ? (
                    <Tag key={tag.id} color={tag.color} className={styles.tag}>
                      {tag.name}
                    </Tag>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
}

// Documents Section Component
import { Modal, DatePicker, Switch } from 'antd';
import { useRef } from 'react';

interface DocumentsSectionProps {
  documents: VendorDocument[];
  documentColumns: ColumnsType<VendorDocument>;
  onAddDocument: (doc: VendorDocument) => void;
}

function DocumentsSection({ documents, documentColumns, onAddDocument }: DocumentsSectionProps) {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string>('');
  const [expired, setExpired] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<any>(null);

  const handleOpenModal = () => setUploadModalVisible(true);
  const handleCloseModal = () => {
    setUploadModalVisible(false);
    setFile(null);
    setDocType('');
    setExpired(false);
    setExpiryDate(null);
    setRemarks('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file || !docType.trim()) {
      message.error('Please select a file and enter document type.');
      return;
    }
    setUploading(true);
    setTimeout(() => {
      const newDoc: VendorDocument = {
        id: `doc-${Date.now()}`,
        vendorId: '',
        documentType: docType,
        fileName: file.name,
        status: 'Pending',
        remarks,
        uploadedDate: new Date().toISOString(),
        uploadedBy: 'current-user',
        ...(expired && expiryDate ? { expiryDate } : {}),
      };
      onAddDocument(newDoc);
      setUploading(false);
      handleCloseModal();
      message.success('Document uploaded');
    }, 800);
  };
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Compliance Documents</h2>
          <p className={styles.sectionSubtitle}>
            Upload and verify required business documents for compliance
          </p>
        </div>
        <AntButton
          type="primary"
          icon={<UploadOutlined />}
          onClick={handleOpenModal}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          Upload Document
        </AntButton>
      </div>
      <Card className={styles.card}>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f5ff', borderRadius: '6px', border: '1px solid #adc6ff' }}>
          <Space>
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontSize: '13px', color: '#1890ff' }}>
              All documents are required for vendor approval. Upload valid certificates and supporting documents.
            </span>
          </Space>
        </div>
        <Table
          columns={documentColumns}
          dataSource={documents}
          rowKey={(record) => record.id}
          pagination={false}
          size="middle"
        />
      </Card>
      <Modal
        open={uploadModalVisible}
        title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><UploadOutlined /> Upload Document</span>}
        onCancel={handleCloseModal}
        onOk={handleUpload}
        okText={uploading ? 'Uploading...' : 'Upload'}
        okButtonProps={{ loading: uploading }}
        cancelButtonProps={{ disabled: uploading }}
        centered
        className={styles.uploadModal}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <b>Note:</b> Please select a document file and fill all required fields. Only one document can be uploaded at a time.
          </div>
        </div>
        <input
          type="file"
          accept="application/pdf,image/*,.doc,.docx"
          style={{ marginBottom: 16 }}
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Input
          placeholder="Enter Document Type"
          value={docType}
          onChange={e => setDocType(e.target.value as string)}
          style={{ width: '100%', marginBottom: 16 }}
          disabled={uploading}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
          <span>Expired?</span>
          <Switch checked={expired} onChange={setExpired} disabled={uploading} />
          {expired && (
            <DatePicker
              placeholder="Expiry Date"
              onChange={(_, dateStr) => setExpiryDate(dateStr)}
              style={{ marginLeft: 8 }}
              disabled={uploading}
            />
          )}
        </div>
        <TextArea
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={2}
          maxLength={200}
          style={{ marginBottom: 0 }}
          disabled={uploading}
        />
      </Modal>
    </div>
  );
}

// Contact Persons Section Component
interface ContactPersonsSectionProps {
  form: any;
  disabled: boolean;
}

function ContactPersonsSection({ form, disabled }: ContactPersonsSectionProps) {
  const [contactPersons, setContactPersons] = useState<any[]>([]);

  // Initialize contact persons from form
  useEffect(() => {
    const formContactPersons = form.getFieldValue('contactPersons') || [];
    if (formContactPersons.length === 0) {
      // Add at least one contact person by default
      const defaultContact = {
        id: `cp_${Date.now()}`,
        name: '',
        designation: '',
        phone: '',
        email: {
          mailto: [],
          cc: [],
          bcc: [],
        },
      };
      form.setFieldsValue({ contactPersons: [defaultContact] });
      setContactPersons([defaultContact]);
    } else {
      setContactPersons(formContactPersons);
    }
  }, [form]);

  const addContactPerson = () => {
    const newContact = {
      id: `cp_${Date.now()}`,
      name: '',
      designation: '',
      phone: '',
      email: {
        mailto: [],
        cc: [],
        bcc: [],
      },
    };
    const updatedContacts = [...contactPersons, newContact];
    setContactPersons(updatedContacts);
    form.setFieldsValue({ contactPersons: updatedContacts });
  };

  const removeContactPerson = (index: number) => {
    if (contactPersons.length > 1) {
      const updatedContacts = contactPersons.filter((_, i) => i !== index);
      setContactPersons(updatedContacts);
      form.setFieldsValue({ contactPersons: updatedContacts });
    }
  };

  const updateContactPerson = (index: number, field: string, value: any) => {
    const updatedContacts = [...contactPersons];
    if (field.startsWith('email.')) {
      const emailField = field.split('.')[1];
      updatedContacts[index].email[emailField] = value;
    } else {
      updatedContacts[index][field] = value;
    }
    setContactPersons(updatedContacts);
    form.setFieldsValue({ contactPersons: updatedContacts });
  };

  return (
    <div className={styles.contactPersonsContainer}>
      {contactPersons.map((contact, index) => (
        <div key={contact.id} className={styles.contactPersonCard}>
          <div className={styles.contactPersonHeader}>
            <h4 className={styles.contactPersonTitle}>
              Contact Person {index + 1}
            </h4>
            {!disabled && contactPersons.length > 1 && (
              <div className={styles.contactPersonActions}>
                <AntButton
                  type="text"
                  danger
                  size="small"
                  onClick={() => removeContactPerson(index)}
                  className={styles.removeContactButton}
                >
                  Remove
                </AntButton>
              </div>
            )}
          </div>
          <div className={styles.contactPersonContent}>
            <div className={styles.contactPersonFields}>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>
                  Name *
                </label>
                <Input
                  placeholder="Enter contact name"
                  value={contact.name}
                  onChange={(e) => updateContactPerson(index, 'name', e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>
                  Designation
                </label>
                <Input
                  placeholder="Enter designation"
                  value={contact.designation}
                  onChange={(e) => updateContactPerson(index, 'designation', e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>
                  Phone
                </label>
                <Input
                  placeholder="Enter phone number"
                  value={contact.phone}
                  onChange={(e) => updateContactPerson(index, 'phone', e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>
            <div className={styles.emailFields}>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>
                  Email To *
                </label>
                <Select
                  mode="tags"
                  placeholder="Enter email addresses"
                  value={contact.email.mailto}
                  onChange={(value) => updateContactPerson(index, 'email.mailto', value)}
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
              </div>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>
                  CC
                </label>
                <Select
                  mode="tags"
                  placeholder="Enter CC email addresses"
                  value={contact.email.cc}
                  onChange={(value) => updateContactPerson(index, 'email.cc', value)}
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
              </div>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>
                  BCC
                </label>
                <Select
                  mode="tags"
                  placeholder="Enter BCC email addresses"
                  value={contact.email.bcc}
                  onChange={(value) => updateContactPerson(index, 'email.bcc', value)}
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {!disabled && (
        <AntButton
          type="dashed"
          onClick={addContactPerson}
          block
          icon={<InfoCircleOutlined />}
          className={styles.addContactButton}
        >
          Add Another Contact Person
        </AntButton>
      )}

      <Form.Item
        name="contactPersons"
        rules={[
          {
            validator: (_, value) => {
              if (!value || value.length === 0) {
                return Promise.reject('At least one contact person is required');
              }
              const hasValidContact = value.some((contact: any) =>
                contact.name && contact.email?.mailto?.length > 0
              );
              if (!hasValidContact) {
                return Promise.reject('At least one contact person with name and email is required');
              }
              return Promise.resolve();
            },
          },
        ]}
        style={{ display: 'none' }}
      >
        <Input />
      </Form.Item>
    </div>
  );
}
