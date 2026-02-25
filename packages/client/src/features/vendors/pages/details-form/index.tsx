import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  Switch,
  Modal,
  DatePicker,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  SendOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRef } from 'react';
import type {
  Vendor,
  VendorDocument,
  VendorMdRequest,
  Tag as VendorTag,
  UserRole,
  CompanyStatus,
  CompanyType,
} from '../../types';
import Button from '../../../../components/button';
import SubMenu from '../../../../components/sub-menu';
import type { SubMenuItemConfig } from '../../../../components/sub-menu';
import RemarkModal from '../../components/RemarkModal';
import {
  fetchVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  fetchTags,
  fetchVendorDocuments,
  sendVendorToMd,
  resolveMdRequest,
  getActivePendingRequest,
} from '../../services/vendors.service';
import styles from './styles.module.css';

const { TextArea } = Input;

type VendorSubMenuItem = 'basic' | 'documents';

const VENDOR_MENU_ITEMS: SubMenuItemConfig[] = [
  { key: 'basic', icon: <InfoCircleOutlined />, label: 'Basic Info' },
  { key: 'documents', icon: <FileTextOutlined />, label: 'Documents' },
];

export default function VendorDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  const role = (searchParams.get('role') as UserRole) ?? 'EMPLOYEE';
  const isPendingView = searchParams.get('pending') === 'true';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [tags, setTags] = useState<VendorTag[]>([]);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [pendingRequest, setPendingRequest] = useState<VendorMdRequest | null>(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState<VendorSubMenuItem>('basic');

  // Remark modals — only for Send to MD and Resolve
  const [sendToMdRemarkOpen, setSendToMdRemarkOpen] = useState(false);
  const [resolveRemarkOpen, setResolveRemarkOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const isEditMode = !!id;

  // Form is never read-only — both Employee and MD can edit
  const isFormReadOnly = false;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const tagsData = await fetchTags();
        setTags(tagsData);

        if (id) {
          const [vendorData, pendingReq] = await Promise.all([
            fetchVendorById(id),
            getActivePendingRequest(id),
          ]);
          if (vendorData) {
            setVendor(vendorData);
            setPendingRequest(pendingReq);
            form.setFieldsValue({
              companyName: vendorData.companyName,
              isLinkedWithRailways: vendorData.isLinkedWithRailways,
              companyType: vendorData.companyType,
              status: vendorData.status,
              address: vendorData.address,
              contactPersons: vendorData.contactPersons,
              gstNumber: vendorData.gstNumber,
              panNumber: vendorData.panNumber,
              msmeNumber: vendorData.msmeNumber,
              cinNumber: vendorData.cinNumber,
              tags: vendorData.tags,
            });
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
    navigate(`/vendors?role=${role}`);
  }, [navigate, role]);

  // ── Save (direct — no remark required) ─────────────────────────────────
  const handleSaveClick = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const vendorData = {
        companyName: values.companyName,
        companyType: values.companyType as CompanyType,
        isLinkedWithRailways: values.isLinkedWithRailways ?? false,
        status: values.status as CompanyStatus,
        address: values.address,
        contactPersons: values.contactPersons ?? [],
        gstNumber: values.gstNumber,
        panNumber: values.panNumber,
        msmeNumber: values.msmeNumber,
        cinNumber: values.cinNumber,
        tags: values.tags ?? [],
        createdBy: 'emp001',
      };

      if (isEditMode && vendor) {
        await updateVendor(vendor.id, vendorData);
        message.success('Vendor saved successfully');
      } else {
        await createVendor(vendorData);
        message.success('Vendor created successfully');
      }
      navigate(`/vendors?role=${role}`);
    } catch {
      message.warning('Please fill in all required fields');
    } finally {
      setSaving(false);
    }
  }, [form, isEditMode, vendor, navigate, role]);

  // ── Delete Vendor ──────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    if (!vendor) return;
    try {
      setSaving(true);
      await deleteVendor(vendor.id);
      message.success('Vendor deleted successfully');
      setDeleteConfirmOpen(false);
      navigate(`/vendors?role=${role}`);
    } catch (error) {
      message.error('Failed to delete vendor');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [vendor, navigate, role]);

  // ── Send to MD ────────────────────────────────────────────────────────────
  const handleSendToMd = useCallback(async () => {
    try {
      await form.validateFields(['companyName']);
      setSendToMdRemarkOpen(true);
    } catch {
      message.warning('Please enter the company name first');
    }
  }, [form]);

  const handleSendToMdConfirm = useCallback(
    async (remark: string) => {
      if (!vendor) return;
      try {
        setSaving(true);
        await sendVendorToMd(vendor.id, 'emp001', remark);
        const req = await getActivePendingRequest(vendor.id);
        setPendingRequest(req);
        setSendToMdRemarkOpen(false);
        message.success('Sent to MD for review. Vendor is now pending.');
      } catch (error) {
        message.error('Failed to send to MD');
        console.error(error);
      } finally {
        setSaving(false);
      }
    },
    [vendor]
  );

  // ── MD Resolve ────────────────────────────────────────────────────────────
  const handleResolve = useCallback(() => {
    setResolveRemarkOpen(true);
  }, []);

  const handleResolveConfirm = useCallback(
    async (remark: string) => {
      if (!pendingRequest) return;
      try {
        setSaving(true);
        await resolveMdRequest(pendingRequest.id, 'md001', remark);
        message.success('Request resolved. Vendor updated.');
        setResolveRemarkOpen(false);
        navigate(`/vendors?role=${role}`);
      } catch (error) {
        message.error('Failed to resolve request');
        console.error(error);
      } finally {
        setSaving(false);
      }
    },
    [pendingRequest, navigate, role]
  );

  const documentColumns: ColumnsType<VendorDocument> = [
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      key: 'documentType',
      width: '25%',
      render: (type: string) => <span style={{ fontWeight: 500 }}>{type}</span>,
    },
    {
      title: 'File',
      dataIndex: 'fileName',
      key: 'fileName',
      width: '25%',
      render: (fileName: string | undefined) =>
        fileName ? (
          <AntButton type="link" size="small" icon={<FileTextOutlined />} style={{ padding: 0 }}>
            View
          </AntButton>
        ) : (
          <AntButton type="link" size="small" icon={<UploadOutlined />} style={{ padding: 0 }}>
            Upload
          </AntButton>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => {
        const colorMap: Record<string, string> = { Verified: 'success', Pending: 'processing', Rejected: 'error' };
        return <Tag color={colorMap[status] ?? 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '35%',
      render: (remarks?: string) => (
        <span style={{ color: remarks ? '#595959' : '#bfbfbf', fontSize: 13 }}>{remarks || '—'}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading…</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <Space align="center">
          <Button variant="ghost" icon={<ArrowLeftOutlined />} onClick={handleBack} />
          <div>
            <Space size="middle" align="center">
              <h1 className={styles.title}>
                {isEditMode ? 'Edit Vendor' : 'Create Vendor'}
              </h1>
              {isEditMode && vendor?.vendorCode && (
                <Tag color="blue" style={{ fontSize: 13, padding: '4px 12px' }}>
                  {vendor.vendorCode}
                </Tag>
              )}
              {pendingRequest && (
                <Tag icon={<ClockCircleOutlined />} color="warning" style={{ fontSize: 12 }}>
                  Pending MD Review
                </Tag>
              )}
            </Space>
            <p className={styles.subtitle}>
              {isEditMode ? 'Update vendor information' : 'Register a new vendor company'}
            </p>
          </div>
        </Space>

        <Space align="center">
          {/* Delete button — edit mode only */}
          {isEditMode && (
            <AntButton
              danger
              icon={<DeleteOutlined />}
              onClick={() => setDeleteConfirmOpen(true)}
              loading={saving}
            >
              Delete
            </AntButton>
          )}

          {/* Create mode */}
          {!isEditMode && (
            <AntButton
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveClick}
              loading={saving}
            >
              Save Vendor
            </AntButton>
          )}

          {/* Edit mode — EMPLOYEE */}
          {isEditMode && role === 'EMPLOYEE' && (
            <>
              <AntButton
                icon={<SaveOutlined />}
                onClick={handleSaveClick}
                loading={saving}
              >
                Save Changes
              </AntButton>
              <AntButton
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendToMd}
                loading={saving}
              >
                Send to MD
              </AntButton>
            </>
          )}

          {/* Edit mode — MD — always can save; also Resolve when in pending view */}
          {isEditMode && role === 'MD' && (
            <>
              <AntButton
                icon={<SaveOutlined />}
                onClick={handleSaveClick}
                loading={saving}
              >
                Save Changes
              </AntButton>
              {isPendingView && pendingRequest && (
                <AntButton
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleResolve}
                  loading={saving}
                  style={{ background: '#059669', borderColor: '#059669' }}
                >
                  Resolve Request
                </AntButton>
              )}
            </>
          )}
        </Space>
      </div>

      <div className={styles.content}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          <SubMenu
            title="Vendor Details"
            selectedMenu={selectedSubMenu}
            onMenuChange={(key) => setSelectedSubMenu(key as VendorSubMenuItem)}
            items={VENDOR_MENU_ITEMS}
          />
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {selectedSubMenu === 'basic' && (
            <BasicInfoSection
              form={form}
              tags={tags}
              vendor={vendor}
              pendingRequest={pendingRequest}
              isReadOnly={isFormReadOnly}
              role={role}
              isPendingView={isPendingView}
            />
          )}
          {selectedSubMenu === 'documents' && (
            <DocumentsSection
              documents={documents}
              documentColumns={documentColumns}
              onAddDocument={(doc) => setDocuments((prev) => [...prev, doc])}
              isReadOnly={isFormReadOnly}
              vendorStatus={vendor?.status ?? form.getFieldValue('status') ?? 'New'}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        title="Delete Vendor"
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: saving }}
        centered
      >
        <p>Are you sure you want to delete <strong>{vendor?.companyName}</strong>? This action cannot be undone.</p>
      </Modal>

      {/* ── Remark Modals — Send to MD & Resolve only ── */}
      <RemarkModal
        open={sendToMdRemarkOpen}
        title="Send to MD — Add Remark"
        description="Provide context for the MD about why this vendor needs review or status change."
        onConfirm={handleSendToMdConfirm}
        onCancel={() => setSendToMdRemarkOpen(false)}
        confirmLoading={saving}
      />
      <RemarkModal
        open={resolveRemarkOpen}
        title="Resolve Pending Request"
        description="Add your remark as MD before resolving this request."
        onConfirm={handleResolveConfirm}
        onCancel={() => setResolveRemarkOpen(false)}
        confirmLoading={saving}
      />
    </div>
  );
}

// ─── Basic Info Section ───────────────────────────────────────────────────────

interface BasicInfoSectionProps {
  form: any;
  tags: VendorTag[];
  vendor: Vendor | null;
  pendingRequest: VendorMdRequest | null;
  isReadOnly: boolean;
  role: UserRole;
  isPendingView: boolean;
}

function BasicInfoSection({ form, tags, vendor, pendingRequest, isReadOnly, role, isPendingView }: BasicInfoSectionProps) {
  const handleUppercaseInput = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue(fieldName, e.target.value.toUpperCase());
  };

  return (
    <div className={styles.section}>
      {/* Pending banner for employee while their request is under review */}
      {role === 'EMPLOYEE' && pendingRequest && (
        <div className={`${styles.statusBanner} ${styles.statusBannerWarning}`}>
          <ClockCircleOutlined style={{ fontSize: 16 }} />
          <div className={styles.statusBannerContent}>
            <div className={styles.statusBannerTitle}>Pending MD Review</div>
            <div className={styles.statusBannerText}>
              You sent this vendor to MD on{' '}
              {new Date(pendingRequest.createdDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pending banner for MD — shows employee remark */}
      {role === 'MD' && isPendingView && pendingRequest && (
        <div className={`${styles.statusBanner} ${styles.statusBannerInfo}`}>
          <InfoCircleOutlined style={{ fontSize: 16 }} />
          <div className={styles.statusBannerContent}>
            <div className={styles.statusBannerTitle}>
              Pending Request — Employee Remark
            </div>
            <div className={styles.statusBannerText}>
              <strong>From employee:</strong> {pendingRequest.empRemark || 'No remark provided'}
            </div>
            <div className={styles.statusBannerText} style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted, #9ca3af)' }}>
              Requested on{' '}
              {new Date(pendingRequest.createdDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
              . Use the "Resolve Request" button in the header to act.
            </div>
          </div>
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Basic Information</h2>
        <p className={styles.sectionSubtitle}>Enter vendor company and contact details</p>
      </div>

      <Card className={styles.card}>
        <Form form={form} layout="vertical" className={styles.form} disabled={isReadOnly}>
          <Row gutter={24}>
            {/* Row 1: Company Name + Company Status */}
            <Col span={12}>
              <Form.Item
                label="Company Name"
                name="companyName"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Company Status"
                name="status"
                initialValue="New"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="New">New Company</Select.Option>
                  <Select.Option value="Interested">Interested Company</Select.Option>
                  <Select.Option value="Final">Final Company</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Row 2: Company Type + Linked with Railways */}
            <Col span={12}>
              <Form.Item
                label="Company Type"
                name="companyType"
                rules={[{ required: true, message: 'Please select company type' }]}
              >
                <Select placeholder="Select company type">
                  <Select.Option value="Vendor">Vendor</Select.Option>
                  <Select.Option value="Consultant">Consultant</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Linked with Railways?"
                name="isLinkedWithRailways"
                valuePropName="checked"
                tooltip="Is this company a registered railway vendor or partner?"
              >
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  disabled={isReadOnly}
                />
              </Form.Item>
            </Col>

            {/* Row 3: Tags */}
            <Col span={24}>
              <Form.Item label="Tags / Categories" name="tags">
                <Select mode="multiple" placeholder="Select tags" allowClear>
                  {tags.map((tag) => (
                    <Select.Option key={tag.id} value={tag.id}>
                      {tag.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Tags preview */}
            <Col span={24}>
              <Form.Item noStyle dependencies={['tags']}>
                {() => {
                  const selectedTags = form.getFieldValue('tags') || [];
                  if (!selectedTags.length || !tags.length) return null;
                  return (
                    <div className={styles.tagsPreview}>
                      <div className={styles.tagsPreviewLabel}>Selected Tags:</div>
                      <div className={styles.selectedTags}>
                        {selectedTags.map((tagId: string) => {
                          const t = tags.find((x) => x.id === tagId);
                          return t ? (
                            <Tag key={t.id} color={t.color} className={styles.tag}>{t.name}</Tag>
                          ) : null;
                        })}
                      </div>
                    </div>
                  );
                }}
              </Form.Item>
            </Col>

            {/* 4. Business Identity */}
            <Col span={24}>
              <div className={styles.sectionDivider}>
                <h3 className={styles.sectionDividerTitle}>Business Identity</h3>
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

            <Col span={24}>
              <Form.Item label="Address" name="address">
                <TextArea placeholder="Enter complete address" rows={3} maxLength={500} />
              </Form.Item>
            </Col>

            {/* 5. Contact Information */}
            <Col span={24}>
              <div className={styles.sectionDivider}>
                <h3 className={styles.sectionDividerTitle}>Contact Information</h3>
                <p className={styles.sectionDividerSubtitle}>
                  Add one or more contact persons for this vendor
                </p>
              </div>
            </Col>

            <Col span={24}>
              <ContactPersonsSection form={form} disabled={isReadOnly} />
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

// ─── Documents Section ────────────────────────────────────────────────────────

interface DocumentsSectionProps {
  documents: VendorDocument[];
  documentColumns: ColumnsType<VendorDocument>;
  onAddDocument: (doc: VendorDocument) => void;
  isReadOnly?: boolean;
  vendorStatus?: string;
}

function DocumentsSection({ documents, documentColumns, onAddDocument, isReadOnly, vendorStatus }: DocumentsSectionProps) {
  const isNewCompany = vendorStatus === 'New';
  const uploadDisabled = isReadOnly || isNewCompany;
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('');
  const [expired, setExpired] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCloseModal = () => {
    setUploadModalVisible(false);
    setFile(null);
    setDocType('');
    setExpired(false);
    setExpiryDate(null);
    setRemarks('');
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
        uploadedBy: 'emp001',
        ...(expired && expiryDate ? { expired: true, expiryDate } : {}),
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
          <p className={styles.sectionSubtitle}>Upload and manage required business documents</p>
          {isNewCompany && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#d97706' }}>
              Document upload is disabled for New Companies. Update status to Interested or Final to upload.
            </p>
          )}
        </div>
        {!uploadDisabled && (
          <AntButton
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setUploadModalVisible(true)}
          >
            Upload Document
          </AntButton>
        )}
      </div>
      <Card className={styles.card}>
        <Table
          columns={documentColumns}
          dataSource={documents}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>
      <Modal
        open={uploadModalVisible}
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UploadOutlined /> Upload Document
          </span>
        }
        onCancel={handleCloseModal}
        onOk={handleUpload}
        okText={uploading ? 'Uploading…' : 'Upload'}
        okButtonProps={{ loading: uploading }}
        cancelButtonProps={{ disabled: uploading }}
        centered
        destroyOnHidden
      >
        <input
          type="file"
          accept="application/pdf,image/*,.doc,.docx"
          style={{ marginBottom: 16, display: 'block' }}
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          disabled={uploading}
        />
        <Input
          placeholder="Enter Document Type"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          style={{ marginBottom: 16 }}
          disabled={uploading}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
          <span>Expired?</span>
          <Switch checked={expired} onChange={setExpired} disabled={uploading} />
          {expired && (
            <DatePicker
              placeholder="Expiry Date"
              onChange={(_, dateStr) => setExpiryDate(dateStr as string)}
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
          disabled={uploading}
        />
      </Modal>
    </div>
  );
}

// ─── Contact Persons Section ──────────────────────────────────────────────────

interface ContactPersonsSectionProps {
  form: any;
  disabled: boolean;
}

function ContactPersonsSection({ form, disabled }: ContactPersonsSectionProps) {
  const [contactPersons, setContactPersons] = useState<any[]>([]);

  useEffect(() => {
    const existing = form.getFieldValue('contactPersons') || [];
    if (existing.length === 0) {
      const defaultContact = {
        id: `cp_${Date.now()}`,
        name: '',
        designation: '',
        phone: '',
        email: { mailto: [], cc: [], bcc: [] },
      };
      form.setFieldsValue({ contactPersons: [defaultContact] });
      setContactPersons([defaultContact]);
    } else {
      setContactPersons(existing);
    }
  }, [form]);

  const addContactPerson = () => {
    const newContact = {
      id: `cp_${Date.now()}`,
      name: '',
      designation: '',
      phone: '',
      email: { mailto: [], cc: [], bcc: [] },
    };
    const updated = [...contactPersons, newContact];
    setContactPersons(updated);
    form.setFieldsValue({ contactPersons: updated });
  };

  const removeContactPerson = (index: number) => {
    if (contactPersons.length <= 1) return;
    const updated = contactPersons.filter((_, i) => i !== index);
    setContactPersons(updated);
    form.setFieldsValue({ contactPersons: updated });
  };

  const updateContactPerson = (index: number, field: string, value: any) => {
    const updated = [...contactPersons];
    if (field.startsWith('email.')) {
      updated[index].email[field.split('.')[1]] = value;
    } else {
      updated[index][field] = value;
    }
    setContactPersons(updated);
    form.setFieldsValue({ contactPersons: updated });
  };

  return (
    <div className={styles.contactPersonsContainer}>
      {contactPersons.map((contact, index) => (
        <div key={contact.id} className={styles.contactPersonCard}>
          <div className={styles.contactPersonHeader}>
            <h4 className={styles.contactPersonTitle}>Contact Person {index + 1}</h4>
            {!disabled && contactPersons.length > 1 && (
              <AntButton type="text" danger size="small" onClick={() => removeContactPerson(index)}>
                Remove
              </AntButton>
            )}
          </div>
          <div className={styles.contactPersonContent}>
            <div className={styles.contactPersonFields}>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>Name *</label>
                <Input
                  placeholder="Enter contact name"
                  value={contact.name}
                  onChange={(e) => updateContactPerson(index, 'name', e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>Designation</label>
                <Input
                  placeholder="Enter designation"
                  value={contact.designation}
                  onChange={(e) => updateContactPerson(index, 'designation', e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>Phone</label>
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
                <label className={styles.contactPersonLabel}>Email To *</label>
                <Select
                  mode="tags"
                  placeholder="Enter email addresses"
                  value={contact.email.mailto}
                  onChange={(v) => updateContactPerson(index, 'email.mailto', v)}
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
              </div>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>CC</label>
                <Select
                  mode="tags"
                  placeholder="Enter CC email addresses"
                  value={contact.email.cc}
                  onChange={(v) => updateContactPerson(index, 'email.cc', v)}
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
              </div>
              <div className={styles.contactPersonField}>
                <label className={styles.contactPersonLabel}>BCC</label>
                <Select
                  mode="tags"
                  placeholder="Enter BCC email addresses"
                  value={contact.email.bcc}
                  onChange={(v) => updateContactPerson(index, 'email.bcc', v)}
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
          className={styles.addContactButton}
        >
          + Add Another Contact Person
        </AntButton>
      )}

      <Form.Item
        name="contactPersons"
        rules={[
          {
            validator: (_, value) => {
              if (!value?.length) return Promise.reject('At least one contact person is required');
              const valid = value.some((c: any) => c.name && c.email?.mailto?.length > 0);
              if (!valid) return Promise.reject('At least one contact with name and email is required');
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
