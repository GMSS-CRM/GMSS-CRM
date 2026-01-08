import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tag, Descriptions, Card, Space, message, Divider } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  CalendarOutlined,
  TagsOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { Tender } from '../../types';
import Button from '../../../../components/button';
import { tendersService } from '../../services/tenders.service';
import { formatDate, formatCurrency, getStatusColor, getVendorTypeLabel, getDocumentLabel } from '../../utils';
import styles from './styles.module.css';

export default function TenderViewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTender = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await tendersService.getTenderById(id);
        if (data) {
          setTender(data);
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

    loadTender();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/tenders');
  };

  const handleEdit = () => {
    navigate(`/tenders/${id}`);
  };

  if (loading || !tender) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Button
            variant="ghost"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          >
            Back to Tenders
          </Button>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>{tender.title}</h1>
            <Tag color={getStatusColor(tender.status)} className={styles.statusTag}>
              {tender.status.toUpperCase()}
            </Tag>
          </div>
          <p className={styles.subtitle}>Tender ID: {tender.tenderId}</p>
        </div>
        {tender.status !== 'closed' && (
          <Button
            variant="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Edit Tender
          </Button>
        )}
      </div>

      <div className={styles.content}>
        {/* Status Banner */}
        {tender.status === 'published' && (
          <Card className={styles.statusBanner}>
            <div className={styles.bannerContent}>
              <InfoCircleOutlined className={styles.bannerIcon} />
              <div>
                <strong>Tender is Live</strong>
                <p>This tender is currently published and visible to eligible vendors.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Basic Information */}
        <Card title="Basic Information" className={styles.card}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Tender ID">{tender.tenderId}</Descriptions.Item>
            <Descriptions.Item label="Reference Number">{tender.referenceNumber}</Descriptions.Item>
            <Descriptions.Item label="Issuing Department">{tender.issuingDepartment}</Descriptions.Item>
            <Descriptions.Item label="Tender Type">
              {tender.tenderType.charAt(0).toUpperCase() + tender.tenderType.slice(1)}
            </Descriptions.Item>
            <Descriptions.Item label="Estimated Value" span={2}>
              {formatCurrency(tender.estimatedValue)}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {tender.description}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Categories & Tags */}
        <Card title={<><TagsOutlined /> Categories & Tags</>} className={styles.card}>
          <div className={styles.tagSection}>
            <div className={styles.tagGroup}>
              <strong>Categories:</strong>
              <Space wrap>
                {tender.categories.length > 0 ? (
                  tender.categories.map((cat) => (
                    <Tag key={cat} color="blue">{cat}</Tag>
                  ))
                ) : (
                  <span className={styles.emptyText}>No categories</span>
                )}
              </Space>
            </div>
            <Divider />
            <div className={styles.tagGroup}>
              <strong>Tags:</strong>
              <Space wrap>
                {tender.tags.length > 0 ? (
                  tender.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))
                ) : (
                  <span className={styles.emptyText}>No tags</span>
                )}
              </Space>
            </div>
          </div>
        </Card>

        {/* Eligibility Criteria */}
        <Card title={<><SafetyOutlined /> Eligibility Criteria</>} className={styles.card}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Allowed Vendor Types">
              {tender.allowedVendorTypes.length > 0 ? (
                <Space wrap>
                  {tender.allowedVendorTypes.map((type) => (
                    <Tag key={type} color="green">{getVendorTypeLabel(type)}</Tag>
                  ))}
                </Space>
              ) : (
                <span className={styles.emptyText}>No restrictions</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Mandatory Documents">
              {tender.mandatoryDocuments.length > 0 ? (
                <Space wrap>
                  {tender.mandatoryDocuments.map((doc) => (
                    <Tag key={doc} color="orange">{getDocumentLabel(doc)}</Tag>
                  ))}
                </Space>
              ) : (
                <span className={styles.emptyText}>No mandatory documents</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Minimum Experience">
              {tender.minimumExperience ? `${tender.minimumExperience} years` : '—'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Timeline */}
        <Card title={<><CalendarOutlined /> Timeline</>} className={styles.card}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Publish Date">{formatDate(tender.publishDate, 'long')}</Descriptions.Item>
            <Descriptions.Item label="Submission Start">{formatDate(tender.submissionStartDate, 'long')}</Descriptions.Item>
            <Descriptions.Item label="Submission End">{formatDate(tender.submissionEndDate, 'long')}</Descriptions.Item>
            <Descriptions.Item label="Closing Date">{formatDate(tender.closingDate, 'long')}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Placeholder Sections */}
        <Card title="Eligible Vendors" className={styles.placeholderCard}>
          <div className={styles.placeholder}>
            <InfoCircleOutlined className={styles.placeholderIcon} />
            <p className={styles.placeholderText}>
              Vendor eligibility matching will be available in the next phase.
            </p>
          </div>
        </Card>

        <Card title="Bids & Evaluation" className={styles.placeholderCard}>
          <div className={styles.placeholder}>
            <InfoCircleOutlined className={styles.placeholderIcon} />
            <p className={styles.placeholderText}>
              {tender.status === 'published'
                ? 'Bid submission and evaluation features will be available after tender publish.'
                : 'Bid evaluation will be available once the tender is published.'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
