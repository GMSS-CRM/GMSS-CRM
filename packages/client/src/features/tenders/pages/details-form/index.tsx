import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  InputNumber,
  Space,
  message,
  Tag,
  Row,
  Col,
  Card,
  Divider,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  SendOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Tender, TenderFormData } from '../../types';
import Button from '../../../../components/button';
import { tendersService } from '../../services/tenders.service';
import { getStatusColor } from '../../utils';
import { CATEGORIES, TAGS } from '../../constants';
import styles from './styles.module.css';

const { TextArea } = Input;

export default function TenderDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [tender, setTender] = useState<Tender | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const isEditMode = !!id && id !== 'create';
  const isReadOnly = tender?.status === 'closed';
  const isPublished = tender?.status === 'published';

  useEffect(() => {
    if (!isEditMode) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const tenderData = await tendersService.getTenderById(id!);
        if (tenderData) {
          setTender(tenderData);
          form.setFieldsValue({
            title: tenderData.title,
            referenceNumber: tenderData.referenceNumber,
            issuingDepartment: tenderData.issuingDepartment,
            tenderType: tenderData.tenderType,
            description: tenderData.description,
            estimatedValue: tenderData.estimatedValue,
            categories: tenderData.categories,
            tags: tenderData.tags,
            allowedVendorTypes: tenderData.allowedVendorTypes,
            mandatoryDocuments: tenderData.mandatoryDocuments,
            minimumExperience: tenderData.minimumExperience,
            publishDate: tenderData.publishDate ? dayjs(tenderData.publishDate) : undefined,
            submissionStartDate: tenderData.submissionStartDate ? dayjs(tenderData.submissionStartDate) : undefined,
            submissionEndDate: tenderData.submissionEndDate ? dayjs(tenderData.submissionEndDate) : undefined,
            closingDate: tenderData.closingDate ? dayjs(tenderData.closingDate) : undefined,
          });
        } else {
          message.error('Tender not found');
          navigate('/tenders');
        }
      } catch (error) {
        message.error('Failed to load tender');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode, form, navigate]);

  const handleBack = () => {
    navigate('/tenders');
  };

  const buildTenderData = (values: any): TenderFormData => ({
    title: values.title,
    referenceNumber: values.referenceNumber,
    issuingDepartment: values.issuingDepartment,
    tenderType: values.tenderType,
    description: values.description,
    estimatedValue: values.estimatedValue,
    categories: values.categories || [],
    tags: values.tags || [],
    allowedVendorTypes: values.allowedVendorTypes || [],
    mandatoryDocuments: values.mandatoryDocuments || [],
    minimumExperience: values.minimumExperience,
    publishDate: values.publishDate ? values.publishDate.toDate() : undefined,
    submissionStartDate: values.submissionStartDate ? values.submissionStartDate.toDate() : undefined,
    submissionEndDate: values.submissionEndDate ? values.submissionEndDate.toDate() : undefined,
    closingDate: values.closingDate ? values.closingDate.toDate() : undefined,
    status: tender?.status || 'draft',
  });

  const handleSaveDraft = async () => {
    try {
      const allValues = form.getFieldsValue(true);
      setLoading(true);

      const tenderData = buildTenderData(allValues);
      tenderData.status = 'draft';

      if (isEditMode) {
        await tendersService.updateTender(id!, tenderData);
        message.success('Tender saved as draft');
      } else {
        const newTender = await tendersService.createTender(tenderData);
        message.success('Tender created as draft');
        navigate(`/tenders/${newTender.id}`);
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        message.error('Failed to save tender');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      const allValues = form.getFieldsValue(true);
      
      const requiredFields = ['title', 'referenceNumber', 'issuingDepartment', 'tenderType', 'description'];
      const missingFields = requiredFields.filter(field => !allValues[field]);
      
      if (missingFields.length > 0) {
        message.error('Please complete all required fields before publishing');
        return;
      }

      setLoading(true);

      const tenderData = buildTenderData(allValues);
      tenderData.status = 'published';

      if (isEditMode) {
        await tendersService.updateTender(id!, tenderData);
        message.success('Tender published successfully');
        navigate('/tenders');
      } else {
        const newTender = await tendersService.createTender(tenderData);
        message.success('Tender published successfully');
        navigate(`/tenders/${newTender.id}`);
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        message.error('Failed to publish tender');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (!isEditMode) return;

    try {
      setLoading(true);
      await tendersService.updateTenderStatus(id!, 'closed');
      message.success('Tender closed successfully');
      navigate('/tenders');
    } catch (error) {
      message.error('Failed to close tender');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { 
      title: 'Basic Info', 
      icon: <FileTextOutlined />,
      description: 'Tender details',
      fields: ['title', 'referenceNumber', 'issuingDepartment', 'tenderType', 'description']
    },
    { 
      title: 'Classification', 
      icon: <InfoCircleOutlined />,
      description: 'Categories & tags',
    },
    { 
      title: 'Requirements', 
      icon: <CheckCircleOutlined />,
      description: 'Eligibility criteria',
    },
    { 
      title: 'Timeline', 
      icon: <ClockCircleOutlined />,
      description: 'Important dates',
    },
  ];

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepFields = steps[currentStep].fields;
    if (!currentStepFields || currentStepFields.length === 0) return true;
    
    try {
      await form.validateFields(currentStepFields);
      return true;
    } catch (error) {
      message.warning('Please fill in all required fields before proceeding');
      return false;
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    if (isReadOnly || stepIndex === currentStep) return;
    
    if (stepIndex > currentStep) {
      const isValid = await validateCurrentStep();
      if (!isValid) return;
    }
    
    setCurrentStep(stepIndex);
  };

  return (
    <div className={styles.container}>
      {/* Compact Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          />
          <div className={styles.headerContent}>
            <div className={styles.headerTop}>
              <h1 className={styles.title}>
                {isEditMode ? tender?.title || 'Loading...' : 'Create New Tender'}
              </h1>
              {isEditMode && tender && (
                <Tag color={getStatusColor(tender.status)} className={styles.statusTag}>
                  {tender.status.toUpperCase()}
                </Tag>
              )}
            </div>
            {isEditMode && tender && (
              <span className={styles.subtitle}>ID: {tender.tenderId}</span>
            )}
          </div>
        </div>

        {/* Inline Status Alerts */}
        {isPublished && !isReadOnly && (
          <Alert
            message="Published & Live"
            type="info"
            showIcon
            className={styles.inlineAlert}
          />
        )}
        {isReadOnly && (
          <Alert
            message={`Closed${tender?.closingDate ? ` on ${dayjs(tender.closingDate).format('DD MMM YYYY')}` : ''} • Read-only mode`}
            type="warning"
            showIcon
            className={styles.inlineAlert}
          />
        )}

        <Space>
          <Button
            variant="secondary"
            icon={<SaveOutlined />}
            onClick={handleSaveDraft}
            loading={loading}
            disabled={isReadOnly || isPublished}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            icon={<SendOutlined />}
            onClick={handlePublish}
            loading={loading}
            disabled={isReadOnly}
          >
            {isPublished ? 'Update & Publish' : 'Publish'}
          </Button>
          {isEditMode && isPublished && (
            <Button variant="danger" onClick={handleClose} loading={loading}>
              Close Tender
            </Button>
          )}
        </Space>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Vertical Progress Steps Sidebar */}
        <div className={styles.stepsSidebar}>
          <div className={styles.stepsTitle}>Progress</div>
          
          {/* Custom Stepper */}
          <div className={styles.customSteps}>
            {steps.map((step, index) => {
              const status = index < currentStep ? 'finish' : index === currentStep ? 'active' : 'wait';
              return (
                <div 
                  key={index} 
                  className={`${styles.stepItem} ${styles[status]} ${!isReadOnly ? styles.clickable : ''}`}
                  onClick={() => handleStepClick(index)}
                  style={{ cursor: isReadOnly ? 'default' : 'pointer' }}
                >
                  <div className={styles.stepIcon}>
                    {status === 'finish' ? (
                      <CheckOutlined />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className={styles.stepConnector} />
                  <div className={styles.stepContentInfo}>
                    <div className={styles.stepTitle}>{step.title}</div>
                    <div className={styles.stepDescription}>{step.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className={styles.formWrapper}>
        <Form form={form} layout="vertical" className={styles.form}>
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div className={styles.stepContent}>
              <Card className={styles.compactCard} title="Basic Information">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Tender Title"
                      name="title"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="Enter tender title" disabled={isReadOnly} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Reference Number"
                      name="referenceNumber"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="e.g., REF/2026/001" disabled={isReadOnly} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Issuing Department"
                      name="issuingDepartment"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="Department name" disabled={isReadOnly} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Tender Type"
                      name="tenderType"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Select placeholder="Select type" disabled={isReadOnly}>
                        <Select.Option value="goods">Goods</Select.Option>
                        <Select.Option value="services">Services</Select.Option>
                        <Select.Option value="works">Works</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Describe the tender requirements in detail..."
                    disabled={isReadOnly}
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Estimated Value (Optional)" name="estimatedValue">
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter amount"
                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value!.replace(/₹\s?|(,*)/g, '') as any}
                        disabled={isReadOnly}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </div>
          )}

          {/* Step 2: Classification */}
          {currentStep === 1 && (
            <div className={styles.stepContent}>
              <Card className={styles.compactCard} title="Categories & Tags">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Categories"
                      name="categories"
                      tooltip="Select relevant categories for vendor matching"
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select categories"
                        options={CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
                        disabled={isReadOnly}
                        maxTagCount="responsive"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Tags"
                      name="tags"
                      tooltip="Add tags to improve searchability"
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select tags"
                        options={TAGS.map((tag) => ({ label: tag, value: tag }))}
                        disabled={isReadOnly}
                        maxTagCount="responsive"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </div>
          )}

          {/* Step 3: Requirements */}
          {currentStep === 2 && (
            <div className={styles.stepContent}>
              <Card className={styles.compactCard} title="Eligibility Criteria">
                <div className={styles.formSection}>
                  <div className={styles.sectionLabel}>Allowed Vendor Types</div>
                  <Form.Item name="allowedVendorTypes" className={styles.checkboxFormItem}>
                    <Checkbox.Group disabled={isReadOnly} className={styles.checkboxGroup}>
                      <Space direction="vertical" size={12}>
                        <Checkbox value="oem">OEM (Original Equipment Manufacturer)</Checkbox>
                        <Checkbox value="trader">Trader</Checkbox>
                        <Checkbox value="distributor">Distributor</Checkbox>
                      </Space>
                    </Checkbox.Group>
                  </Form.Item>
                </div>

                <Divider />

                <div className={styles.formSection}>
                  <div className={styles.sectionLabel}>Mandatory Documents</div>
                  <Form.Item name="mandatoryDocuments" className={styles.checkboxFormItem}>
                    <Checkbox.Group disabled={isReadOnly} className={styles.checkboxGroup}>
                      <Space direction="vertical" size={12}>
                        <Checkbox value="gst">GST Certificate</Checkbox>
                        <Checkbox value="pan">PAN Card</Checkbox>
                        <Checkbox value="msme">MSME Registration</Checkbox>
                      </Space>
                    </Checkbox.Group>
                  </Form.Item>
                </div>

                <Divider />

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Minimum Experience Required"
                      name="minimumExperience"
                      tooltip="Specify years of experience required"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Years"
                        min={0}
                        suffix="years"
                        disabled={isReadOnly}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </div>
          )}

          {/* Step 4: Timeline */}
          {currentStep === 3 && (
            <div className={styles.stepContent}>
              <Card className={styles.compactCard} title="Important Dates">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Publish Date" name="publishDate">
                      <DatePicker style={{ width: '100%' }} disabled={isReadOnly} format="DD MMM YYYY" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Submission Start Date" name="submissionStartDate">
                      <DatePicker style={{ width: '100%' }} disabled={isReadOnly} format="DD MMM YYYY" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Submission End Date" name="submissionEndDate">
                      <DatePicker style={{ width: '100%' }} disabled={isReadOnly} format="DD MMM YYYY" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Tender Closing Date" name="closingDate">
                      <DatePicker style={{ width: '100%' }} disabled={isReadOnly} format="DD MMM YYYY" />
                    </Form.Item>
                  </Col>
                </Row>

                <Alert
                  message="Timeline Guidelines"
                  description={
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                      <li>Publish Date: When tender becomes visible to vendors</li>
                      <li>Submission Period: When vendors can submit bids</li>
                      <li>Closing Date: Final date for all tender activities</li>
                    </ul>
                  }
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                />
              </Card>
            </div>
          )}
        </Form>
      </div>

      {/* Tender Summary Panel - Sticky Right Side */}
      <div className={styles.summaryPanel}>
        <div className={styles.summaryTitle}>Tender Summary</div>
        
        {/* Status */}
        <div className={styles.summarySection}>
          <span className={styles.summaryLabel}>Status</span>
          {tender ? (
            <Tag color={getStatusColor(tender.status)} style={{ marginTop: 6 }}>
              {tender.status.toUpperCase()}
            </Tag>
          ) : (
            <div className={styles.summaryValue}>Draft (New)</div>
          )}
        </div>

        {/* Estimated Value */}
        <div className={styles.summarySection}>
          <span className={styles.summaryLabel}>Estimated Value</span>
          {form.getFieldValue('estimatedValue') ? (
            <div className={styles.summaryValueLarge}>
              ₹{new Intl.NumberFormat('en-IN').format(form.getFieldValue('estimatedValue'))}
            </div>
          ) : (
            <div className={styles.summaryValueMuted}>Not specified</div>
          )}
        </div>

        {/* Important Dates */}
        <div className={styles.summarySection}>
          <span className={styles.summaryLabel}>Publish Date</span>
          <div className={styles.summaryValue}>
            {form.getFieldValue('publishDate') 
              ? form.getFieldValue('publishDate').format('DD MMM YYYY')
              : <span className={styles.summaryValueMuted}>Not set</span>
            }
          </div>
          
          <span className={styles.summaryLabel} style={{ marginTop: 12, display: 'block' }}>Closing Date</span>
          <div className={styles.summaryValue}>
            {form.getFieldValue('closingDate') 
              ? form.getFieldValue('closingDate').format('DD MMM YYYY')
              : <span className={styles.summaryValueMuted}>Not set</span>
            }
          </div>
        </div>

        {/* Categories */}
        <div className={styles.summarySection}>
          <span className={styles.summaryLabel}>Categories</span>
          {form.getFieldValue('categories')?.length > 0 ? (
            <div className={styles.summaryTags}>
              {form.getFieldValue('categories').slice(0, 3).map((cat: string) => (
                <Tag key={cat} color="blue">{cat}</Tag>
              ))}
              {form.getFieldValue('categories').length > 3 && (
                <Tag>+{form.getFieldValue('categories').length - 3} more</Tag>
              )}
            </div>
          ) : (
            <div className={styles.summaryValueMuted}>No categories</div>
          )}
        </div>

        {/* Vendor Eligibility */}
        <div className={styles.summarySection}>
          <span className={styles.summaryLabel}>Allowed Vendors</span>
          {form.getFieldValue('allowedVendorTypes')?.length > 0 ? (
            <div className={styles.summaryTags}>
              {form.getFieldValue('allowedVendorTypes').map((type: string) => (
                <Tag key={type}>{type.toUpperCase()}</Tag>
              ))}
            </div>
          ) : (
            <div className={styles.summaryValueMuted}>All vendors</div>
          )}
          
          {form.getFieldValue('minimumExperience') && (
            <>
              <span className={styles.summaryLabel} style={{ marginTop: 12, display: 'block' }}>Min. Experience</span>
              <div className={styles.summaryValue}>
                {form.getFieldValue('minimumExperience')} years
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
