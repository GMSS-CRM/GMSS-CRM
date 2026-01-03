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
  Timeline,
  Row,
  Col,
  Card,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  SendOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Vendor, VendorDocument, Tag as VendorTag, ApprovalHistory, DocumentType } from '../../types';
import Button from '../../../../components/button';
import SubMenu from '../../../../components/sub-menu';
import type { SubMenuItemConfig } from '../../../../components/sub-menu';
import {
  fetchVendorById,
  createVendor,
  updateVendor,
  fetchTags,
  fetchVendorDocuments,
  fetchApprovalHistory,
} from '../../services/vendors.service';
import styles from './styles.module.css';

const { TextArea } = Input;

type VendorSubMenuItem = 'basic' | 'documents' | 'approval' | 'users';

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
  {
    key: 'approval',
    icon: <CheckCircleOutlined />,
    label: 'Approval',
  },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: 'Vendor Users',
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
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
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
              contactPersonName: vendorData.contactPersonName,
              contactEmail: vendorData.contactEmail,
              contactPhone: vendorData.contactPhone,
              gstNumber: vendorData.gstNumber,
              panNumber: vendorData.panNumber,
              msmeNumber: vendorData.msmeNumber,
              cinNumber: vendorData.cinNumber,
              tags: vendorData.tags,
            });

            // Load documents and approval history
            const docsData = await fetchVendorDocuments(id);
            setDocuments(docsData);

            const historyData = await fetchApprovalHistory(id);
            setApprovalHistory(historyData);
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
    contactPersonName: values.contactPersonName,
    contactEmail: values.contactEmail,
    contactPhone: values.contactPhone,
    gstNumber: values.gstNumber,
    panNumber: values.panNumber,
    msmeNumber: values.msmeNumber,
    cinNumber: values.cinNumber,
    tags: values.tags || [],
    status,
    createdBy: 'current-user', // TODO: Get from auth context
  }), []);

  const handleSaveAsDraft = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const vendorData = buildVendorData(values, 'Draft');

      if (isEditMode && vendor) {
        await updateVendor(vendor.id, vendorData);
        message.success('Vendor saved as draft');
      } else {
        await createVendor(vendorData);
        message.success('Vendor created as draft');
      }

      navigate('/vendors');
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        message.warning('Please fill in all required fields');
      } else {
        message.error('Failed to save vendor');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, [form, isEditMode, vendor, navigate, buildVendorData]);

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

  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Submitted':
        return 'processing';
      case 'Rejected':
        return 'error';
      case 'Draft':
        return 'default';
      default:
        return 'default';
    }
  }, []);

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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => (
        <Tag
          color={
            status === 'Verified'
              ? 'success'
              : status === 'Rejected'
              ? 'error'
              : 'warning'
          }
        >
          {status}
        </Tag>
      ),
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
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className={styles.backButton}
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
        {/* Show buttons only for Draft, Rejected, or new vendors */}
        {(!vendor || vendor.status === 'Draft' || vendor.status === 'Rejected') && (
          <Space>
            <AntButton
              icon={<SaveOutlined />}
              onClick={handleSaveAsDraft}
              loading={loading}
            >
              Save as Draft
            </AntButton>
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
            />
          )}

          {selectedSubMenu === 'approval' && (
            <ApprovalSection
              vendor={vendor}
              approvalHistory={approvalHistory}
              getStatusColor={getStatusColor}
            />
          )}

          {selectedSubMenu === 'users' && (
            <VendorUsersPlaceholder />
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
                  <Select.Option value="OEM">OEM</Select.Option>
                  <Select.Option value="Trader">Trader</Select.Option>
                  <Select.Option value="Distributor">Distributor</Select.Option>
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
              </div>
            </Col>

            <Col span={12}>
              <Form.Item label="Contact Person Name" name="contactPersonName">
                <Input placeholder="Enter contact person name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Contact Email"
                name="contactEmail"
                rules={[{ type: 'email', message: 'Please enter valid email' }]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Contact Phone" name="contactPhone">
                <Input placeholder="Enter phone number" />
              </Form.Item>
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
interface DocumentsSectionProps {
  documents: VendorDocument[];
  documentColumns: ColumnsType<VendorDocument>;
}

function DocumentsSection({ documents, documentColumns }: DocumentsSectionProps) {
  // Define all required document types
  const requiredDocTypes: DocumentType[] = [
    'GST Certificate',
    'PAN Card',
    'MSME / UDYAM Certificate',
    'Experience Certificate',
  ];

  // Create a complete document list with all required types
  const completeDocuments = requiredDocTypes.map((docType) => {
    const existing = documents.find((doc) => doc.documentType === docType);
    return existing || {
      id: `placeholder-${docType}`,
      vendorId: '',
      documentType: docType,
      status: 'Pending' as const,
    };
  });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Compliance Documents</h2>
          <p className={styles.sectionSubtitle}>
            Upload and verify required business documents for compliance
          </p>
        </div>
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
          dataSource={completeDocuments}
          rowKey={(record) => record.id}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
}

// Approval Section Component
interface ApprovalSectionProps {
  vendor: Vendor | null;
  approvalHistory: ApprovalHistory[];
  getStatusColor: (status: string) => string;
}

function ApprovalSection({ vendor, approvalHistory, getStatusColor }: ApprovalSectionProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
    };
  };

  const getActionColor = (action: string) => {
    if (action.includes('Approved')) return 'success';
    if (action.includes('Rejected')) return 'error';
    if (action.includes('Submitted')) return 'processing';
    return 'default';
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Approval & Status</h2>
        <p className={styles.sectionSubtitle}>Track approval workflow and current vendor status</p>
      </div>

      <Card className={styles.card}>
        <div className={styles.approvalStatusContainer}>
          <div className={styles.approvalStatusWrapper}>
            <div>
              <div className={styles.statusLabelText}>
                Current Status
              </div>
              <Tag
                color={getStatusColor(vendor?.status || 'Draft')}
                className={styles.statusTag}
              >
                {vendor?.status || 'Draft'}
              </Tag>
            </div>
            {vendor?.status === 'Submitted' && (
              <div className={`${styles.approvalBadge} ${styles.approvalBadgeInfo}`}>
                <Space>
                  <InfoCircleOutlined />
                  <span>
                    Under Review
                  </span>
                </Space>
              </div>
            )}
            {vendor?.status === 'Rejected' && (
              <div className={`${styles.approvalBadge} ${styles.approvalBadgeError}`}>
                <Space>
                  <ExclamationCircleOutlined />
                  <span>
                    Action Required
                  </span>
                </Space>
              </div>
            )}
          </div>
        </div>

        {approvalHistory.length > 0 && (
          <div className={styles.historySection}>
            <h3 className={styles.historyTitleText}>
              Approval History
            </h3>
            <Timeline className={styles.timeline} mode="left">
              {approvalHistory.map((item) => {
                const dateTime = formatDateTime(item.performedDate);
                return (
                  <Timeline.Item 
                    key={item.id}
                    color={getActionColor(item.action) === 'success' ? 'green' : 
                           getActionColor(item.action) === 'error' ? 'red' :
                           getActionColor(item.action) === 'processing' ? 'blue' : 'gray'}
                  >
                    <div className={styles.historyItem}>
                      <div className={styles.historyItemRow}>
                        <Tag color={getActionColor(item.action)} style={{ margin: 0, fontWeight: 500 }}>
                          {item.action}
                        </Tag>
                        <span className={styles.historyDate}>
                          {dateTime.date} at {dateTime.time}
                        </span>
                      </div>
                      <div className={styles.historyDetailsText} style={{ marginBottom: item.comments ? '8px' : '0' }}>
                        Performed by: <span style={{ fontWeight: 500 }}>{item.performedBy}</span>
                      </div>
                      {item.comments && (
                        <div className={styles.historyCommentsBox}>
                          <span style={{ fontWeight: 500, marginRight: '4px' }}>Note:</span>
                          {item.comments}
                        </div>
                      )}
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
        )}

        {approvalHistory.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <CheckCircleOutlined className={styles.emptyStateIcon} />
            <p className={styles.emptyStateText}>No approval history yet</p>
            <p className={styles.emptyStateSubtext}>
              History will appear after vendor submission
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

// Vendor Users Placeholder Component
function VendorUsersPlaceholder() {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Vendor Users</h2>
        <p className={styles.sectionSubtitle}>Manage vendor user accounts and access</p>
      </div>

      <Card className={styles.card}>
        <div className={styles.placeholderContainer}>
          <UserOutlined className={styles.placeholderIcon} />
          <div>
            <h3 className={styles.placeholderTitle}>
              Coming Soon
            </h3>
            <p className={styles.placeholderText}>
              Vendor user management functionality will be available in a future release. 
              This feature will allow you to create and manage user accounts for vendor representatives.
            </p>
          </div>
          <Tag color="blue" style={{ fontSize: '12px', padding: '4px 12px', marginTop: '8px' }}>
            Feature Under Development
          </Tag>
        </div>
      </Card>
    </div>
  );
}
