import { useState, useEffect, useCallback, useMemo } from 'react';
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
  BellOutlined,
  ArrowLeftOutlined,
  SendOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
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
import FormActionsBar from '../../../../components/form-actions';
import SubMenu from '../../../../components/sub-menu';
import RemarkModal from '../../components/RemarkModal';
import FollowUpsSection from '../../components/FollowUpsSection';
import SharedTendersSection from '../../components/SharedTendersSection';
import AgreementSection from '../../components/AgreementSection';
import {
  useGetVendorById,
  useSearchVendorDocuments,
  useGetActivePendingRequest,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
  useCreateMdRequest,
  useResolveMdRequest,
  useUploadVendorDocument,
  useDeleteVendorDocument,
} from '../../services/vendors.service';
import { useSearchTags } from '../../../tags/services/tags.service';
import { useCreateTag } from '../../../tags/services/tags.service';
import { useFirebaseUpload } from '../../../tender-workflow/hooks/useFirebaseUpload';
import styles from './styles.module.css';

const { TextArea } = Input;

type VendorSubMenuItem = 'basic' | 'documents' | 'followups' | 'shared-tenders' | 'agreement';

const BASE_MENU_ITEMS = [
  { key: 'basic', icon: <InfoCircleOutlined />, label: 'Basic Info' },
  { key: 'documents', icon: <FileTextOutlined />, label: 'Documents' },
  { key: 'followups', icon: <BellOutlined />, label: 'Follow Ups' },
  { key: 'shared-tenders', icon: <ShopOutlined />, label: 'Shared Tenders' },
  { key: 'agreement', icon: <SafetyCertificateOutlined />, label: 'Agreement & Payment Terms' },
] as const;

function buildMenuItems(vendorStatus: string | undefined) {
  const status = vendorStatus ?? 'New';
  const isInterested = status === 'Interested' || status === 'Final';

  return BASE_MENU_ITEMS.map((item) => {
    if (item.key === 'documents') {
      return {
        ...item,
        disabled: !isInterested,
        disabledReason: !isInterested ? 'Available for Interested & Final companies' : undefined,
      };
    }
    if (item.key === 'agreement') {
      return {
        ...item,
        disabled: !isInterested,
        disabledReason: !isInterested ? 'Available for Interested & Final companies' : undefined,
      };
    }
    return item;
  });
}

export default function VendorDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  const role = (searchParams.get('role') as UserRole) ?? 'EMPLOYEE';
  const isPendingView = searchParams.get('pending') === 'true';

  const [saving, setSaving] = useState(false);
  const [sendToMdLoading, setSendToMdLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState<VendorSubMenuItem>('basic');

  // Remark modals
  const [sendToMdRemarkOpen, setSendToMdRemarkOpen] = useState(false);
  const [resolveRemarkOpen, setResolveRemarkOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const isEditMode = !!id;
  const isFormReadOnly = false;

  // ── Apollo hooks ──────────────────────────────────────────────────────────
  const { vendor, rawStatus, loading: vendorLoading } = useGetVendorById(id);
  const { documents, refetch: refetchDocs } = useSearchVendorDocuments(id);
  const { request: pendingRequest, refetch: refetchPending } = useGetActivePendingRequest(id);
  const { data: tagsData } = useSearchTags();
  const tagOptions = tagsData?.searchTags ?? [];
  const { createVendor } = useCreateVendor();
  const { updateVendor } = useUpdateVendor();
  const { deleteVendor } = useDeleteVendor();
  const { createMdRequest } = useCreateMdRequest();
  const { resolveMdRequest } = useResolveMdRequest();
  const [createTag] = useCreateTag();

  const loading = vendorLoading;

  // Populate form when vendor loads
  useEffect(() => {
    if (vendor) {
      // Normalize vendor payload to match form expectations. The API may return
      // fields with different names (e.g. `name`, `type`, `isRailwayLinked`,
      // `msmeUdyamNumber`) and contact persons may be a flat shape.
      const normalizedContactPersons = (vendor.contactPersons ?? []).map((cp: any) => {
        // cp.email may be a string in API; UI expects { mailto: [], cc: [], bcc: [] }
        const emailField = cp?.email;
        const emailObj = typeof emailField === 'string'
          ? { mailto: emailField ? [emailField] : [], cc: [], bcc: [] }
          : (emailField ?? { mailto: [], cc: [], bcc: [] });

        return {
          id: cp.id ?? `cp_${Date.now()}`,
          name: cp.name ?? cp.contactName ?? '',
          designation: cp.designation ?? '',
          phone: cp.phone ?? cp.phoneNumber ?? '',
          email: emailObj,
        };
      });

      const v = vendor as any;
      const tagIds = v.tagIds ?? (v.tags?.map((t: any) => t.tagId ?? t.id) ?? []);

      form.setFieldsValue({
        companyName: vendor.companyName ?? v.name,
        isLinkedWithRailways: vendor.isLinkedWithRailways ?? v.isRailwayLinked ?? false,
        companyType: vendor.companyType ?? v.type,
        status: vendor.status,
        address: vendor.address,
        contactPersons: normalizedContactPersons,
        gstNumber: vendor.gstNumber,
        panNumber: vendor.panNumber ?? v.pan,
        msmeNumber: vendor.msmeNumber ?? v.msmeUdyamNumber,
        cinNumber: vendor.cinNumber ?? v.cin,
        tags: tagIds,
      });
    }
  }, [vendor, form]);

  // Notify if vendor not found in edit mode (after load completes)
  useEffect(() => {
    if (isEditMode && !vendorLoading && !vendor) {
      message.error('Vendor not found');
      navigate('/vendors');
    }
  }, [isEditMode, vendorLoading, vendor, navigate]);

  const handleBack = useCallback(() => {
    navigate(`/vendors?role=${role}`);
  }, [navigate, role]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSaveClick = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      // Separate newly-typed tags (prefixed __new__:) from existing IDs
      const tagValues: string[] = values.tags ?? [];
      const newTagNames = tagValues
        .filter((v) => v.startsWith('__new__:'))
        .map((v) => v.replace('__new__:', '').trim());
      const existingTagIds = tagValues.filter((v) => !v.startsWith('__new__:'));

      // Create new tags and collect their IDs
      const createdTagIds: string[] = [];
      for (const name of newTagNames) {
        const result = await createTag({ variables: { input: { name } } });
        const newId = result.data?.createTag?.id;
        if (newId) createdTagIds.push(newId);
      }

      const payload = {
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
        tagIds: [...existingTagIds, ...createdTagIds],
      };

      if (isEditMode && vendor) {
        await updateVendor(vendor.id, payload, rawStatus ?? 'NEW');
        message.success('Vendor saved successfully');
      } else {
        await createVendor(payload);
        message.success('Vendor created successfully');
      }
      navigate(`/vendors?role=${role}`);
    } catch {
      message.warning('Please fill in all required fields');
    } finally {
      setSaving(false);
    }
  }, [form, isEditMode, vendor, rawStatus, updateVendor, createVendor, createTag, navigate, role]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    if (!vendor) return;
    try {
      setDeleting(true);
      await deleteVendor(vendor.id);
      message.success('Vendor deleted successfully');
      setDeleteConfirmOpen(false);
      navigate(`/vendors?role=${role}`);
    } catch (error) {
      message.error('Failed to delete vendor');
      console.error(error);
    } finally {
      setDeleting(false);
    }
  }, [vendor, deleteVendor, navigate, role]);

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
        setSendToMdLoading(true);
        await createMdRequest(vendor.id, remark);
        await refetchPending();
        setSendToMdRemarkOpen(false);
        message.success('Sent to MD for review.');
      } catch (error: any) {
        message.error(error?.message ?? 'Failed to send to MD');
        console.error(error);
      } finally {
        setSendToMdLoading(false);
      }
    },
    [vendor, createMdRequest, refetchPending]
  );

  // ── MD Resolve ────────────────────────────────────────────────────────────
  const handleResolve = useCallback(() => {
    setResolveRemarkOpen(true);
  }, []);

  const handleResolveConfirm = useCallback(
    async (remark: string) => {
      if (!pendingRequest) return;
      try {
        setSendToMdLoading(true);
        await resolveMdRequest(pendingRequest.id, remark, true);
        message.success('Request resolved. Vendor updated.');
        setResolveRemarkOpen(false);
        navigate(`/vendors?role=${role}`);
      } catch (error: any) {
        message.error(error?.message ?? 'Failed to resolve request');
        console.error(error);
      } finally {
        setSendToMdLoading(false);
      }
    },
    [pendingRequest, resolveMdRequest, navigate, role]
  );

  const { deleteVendorDocument } = useDeleteVendorDocument();

  const handleDeleteDocument = useCallback(
    async (docId: string) => {
      try {
        await deleteVendorDocument(docId);
        message.success('Document deleted');
        refetchDocs();
      } catch (error: any) {
        message.error(error?.message ?? 'Failed to delete document');
      }
    },
    [deleteVendorDocument, refetchDocs]
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
      width: '20%',
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
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: '18%',
      render: (date?: string, record?: VendorDocument) => {
        if (!date) return <span style={{ color: '#bfbfbf' }}>—</span>;
        const isExpired = record?.expired;
        return (
          <span style={{ color: isExpired ? '#ff4d4f' : '#595959', fontWeight: isExpired ? 600 : 400 }}>
            {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {isExpired && <Tag color="error" style={{ marginLeft: 6, fontSize: 11 }}>Expired</Tag>}
          </span>
        );
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '25%',
      render: (remarks?: string) => (
        <span style={{ color: remarks ? '#595959' : '#bfbfbf', fontSize: 13 }}>{remarks || '—'}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      align: 'center' as const,
      render: (_: unknown, record: VendorDocument) => (
        <AntButton
          type="text"
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => handleDeleteDocument(record.id)}
        />
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

        {/* Workflow actions remain in header - only show on basic info section */}
        {selectedSubMenu === 'basic' && (
          <Space align="center">
            {isEditMode && role === 'EMPLOYEE' && !pendingRequest && (
              <Button
                variant="primary"
                icon={<SendOutlined />}
                onClick={handleSendToMd}
                loading={sendToMdLoading}
              >
                Send to MD
              </Button>
            )}
            {isEditMode && role === 'MD' && isPendingView && pendingRequest && (
              <Button
                variant="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleResolve}
                loading={sendToMdLoading}
              >
                Resolve Request
              </Button>
            )}
          </Space>
        )}
      </div>

      <div className={styles.content}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          <SubMenu
            title="Vendor Details"
            selectedMenu={selectedSubMenu}
            onMenuChange={(key) => {
              const menuItems = buildMenuItems(vendor?.status);
              const item = menuItems.find((m) => m.key === key);
              if (item && 'disabled' in item && item.disabled) return;
              setSelectedSubMenu(key as VendorSubMenuItem);
            }}
            items={buildMenuItems(vendor?.status)}
          />
        </div>

        {/* Main Content + Footer */}
        <div className={styles.mainColumn}>
          <div className={styles.mainContent}>
            {selectedSubMenu === 'basic' && (
              <BasicInfoSection
                form={form}
                tags={tagOptions}
                vendor={vendor}
                pendingRequest={pendingRequest}
                isReadOnly={isFormReadOnly}
                role={role}
                isPendingView={isPendingView}
              />
            )}
            {selectedSubMenu === 'documents' && (
              <DocumentsSection
                vendorId={id}
                documents={documents}
                documentColumns={documentColumns}
                onUploadSuccess={refetchDocs}
                isReadOnly={isFormReadOnly}
                vendorStatus={vendor?.status ?? form.getFieldValue('status') ?? 'New'}
              />
            )}
            {selectedSubMenu === 'followups' && (
              <FollowUpsSection vendorId={id} />
            )}
            {selectedSubMenu === 'shared-tenders' && (
              <SharedTendersSection vendorId={id} />
            )}
            {selectedSubMenu === 'agreement' && (
              <AgreementSection vendorId={id} vendorStatus={vendor?.status} companyType={vendor?.companyType} />
            )}
          </div>

          {/* Footer Actions — only show in basic info section */}
          {selectedSubMenu === 'basic' && (
            <FormActionsBar
              onCancel={handleBack}
              cancelLabel="Back"
              cancelIcon={<ArrowLeftOutlined />}
              onDelete={isEditMode ? () => setDeleteConfirmOpen(true) : undefined}
              deleteLoading={deleting}
              onOk={handleSaveClick}
              okLabel={isEditMode ? 'Save Changes' : 'Save Vendor'}
              okLoading={saving}
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
        confirmLoading={sendToMdLoading}
      />
      <RemarkModal
        open={resolveRemarkOpen}
        title="Resolve Pending Request"
        description="Add your remark as MD before resolving this request."
        onConfirm={handleResolveConfirm}
        onCancel={() => setResolveRemarkOpen(false)}
        confirmLoading={sendToMdLoading}
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

function BasicInfoSection({ form, tags, pendingRequest, isReadOnly, role, isPendingView }: BasicInfoSectionProps) {
  const [tagSearch, setTagSearch] = useState('');

  // Build options: real tags + synthetic "create" option when search has no exact match
  const tagSelectOptions = useMemo(() => {
    const opts = tags.map((t) => ({ value: t.id, label: t.name }));
    if (
      tagSearch.trim() &&
      !tags.find((t) => t.name.toLowerCase() === tagSearch.toLowerCase().trim())
    ) {
      opts.unshift({ value: `__new__:${tagSearch.trim()}`, label: `+ Create "${tagSearch.trim()}"` });
    }
    return opts;
  }, [tags, tagSearch]);

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

            <Col span={12}>
              <Form.Item
                label="Agreement With"
                name="agreementWith"
              >
                <Select placeholder="Select agreement party">
                  <Select.Option value="GMSS">GMSS</Select.Option>
                  <Select.Option value="Nisnik International">Nisnik International</Select.Option>
                  <Select.Option value="Nishhant Om Gupta">Nishhant Om Gupta</Select.Option>
                  <Select.Option value="Pooja Gupta">Pooja Gupta</Select.Option>
                  <Select.Option value="Vandana Gupta">Vandana Gupta</Select.Option>
                  <Select.Option value="Gupta Engineering">Gupta Engineering</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Row 3: Tags */}
            <Col span={24}>
              <Form.Item
                label="Tags / Categories"
                name="tags"
                rules={[{ required: true, message: 'Please select at least one tag' }]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  placeholder="Select existing tags or type a name to create new"
                  options={tagSelectOptions}
                  filterOption={(input, option) => {
                    if (String(option?.value ?? '').startsWith('__new__:')) return true;
                    return String(option?.label ?? '').toLowerCase().includes(input.toLowerCase());
                  }}
                  onSearch={setTagSearch}
                  onChange={() => setTagSearch('')}
                  disabled={isReadOnly}
                  tagRender={(props) => {
                    const { value, closable, onClose } = props;
                    const isNew = String(value).startsWith('__new__:');
                    const displayName = isNew
                      ? String(value).replace('__new__:', '')
                      : (tags.find((t) => t.id === value)?.name ?? String(value));
                    return (
                      <Tag
                        color={isNew ? 'orange' : 'blue'}
                        closable={closable}
                        onClose={onClose}
                        style={{ marginRight: 4 }}
                      >
                        {isNew ? `✦ ${displayName}` : displayName}
                      </Tag>
                    );
                  }}
                />
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
  vendorId: string | undefined;
  documents: VendorDocument[];
  documentColumns: ColumnsType<VendorDocument>;
  onUploadSuccess: () => void;
  isReadOnly?: boolean;
  vendorStatus?: string;
}

function DocumentsSection({ vendorId, documents, documentColumns, onUploadSuccess, isReadOnly, vendorStatus }: DocumentsSectionProps) {
  const { uploadVendorDocument } = useUploadVendorDocument();
  const { uploadFile } = useFirebaseUpload();
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

  const handleUpload = async () => {
    if (!file) {
      message.error('Please select a file.');
      return;
    }
    if (!docType.trim()) {
      message.error('Please enter a document type.');
      return;
    }
    if (!vendorId) {
      message.error('Vendor must be saved before uploading documents.');
      return;
    }
    setUploading(true);
    try {
      let publicUrl: string | undefined;
      try {
        const { downloadUrl } = await uploadFile(file, `vendors/${vendorId}/documents`);
        publicUrl = downloadUrl;
      } catch (uploadErr) {
        // Firebase not configured — warn but still create entry for demo/testing
        console.error('Firebase upload failed:', uploadErr);
        message.warning('File could not be stored (Firebase unavailable) — document entry created anyway.');
      }

      // Create document record even if Firebase upload fails
      await uploadVendorDocument(
        vendorId,
        docType,
        publicUrl || file.name, // Use filename as fallback if no URL
        expired && expiryDate ? expiryDate : undefined
      );
      onUploadSuccess();
      handleCloseModal();
      message.success('Document uploaded successfully.');
    } catch (err) {
      console.error(err);
      message.error('Failed to create document entry. Please try again.');
    } finally {
      setUploading(false);
    }
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
