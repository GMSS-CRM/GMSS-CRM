import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Empty,
  Spin,
  Popconfirm,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UploadOutlined,
  DeleteOutlined,
  FileOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useGetPostAwardDocuments,
  useUploadPostAwardDocument,
  useDeletePostAwardDocument,
  STAGE_DOCUMENT_TYPES,
} from '../../services/post-award-documents.service';
import type { PostAwardDocumentItem } from '../../services/post-award-documents.service';
import { useFirebaseUpload } from '../../hooks/useFirebaseUpload';

const { Text } = Typography;

interface Props {
  postAwardId: string;
  tenderId: string;
  currentStage: string;
}

const STAGE_LABELS: Record<string, string> = {
  ORDER_FOLLOWUP: 'Order Follow-Up',
  ORDER_PROCESSING: 'Order Processing',
  INSPECTION: 'Inspection',
  DISPATCH_DELIVERY: 'Dispatch & Delivery',
  WARRANTY: 'Warranty',
  BILL_PAYMENT: 'Bill & Payment',
};

const PostAwardDocumentsPanel: React.FC<Props> = ({ postAwardId, tenderId, currentStage }) => {
  const { data, loading, refetch } = useGetPostAwardDocuments(postAwardId);
  const [uploadDoc] = useUploadPostAwardDocument();
  const [deleteDoc] = useDeletePostAwardDocument();
  const { uploadFile } = useFirebaseUpload();
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDirtyUpload, setIsDirtyUpload] = useState(false);
  const [form] = Form.useForm();

  const documents = data?.getPostAwardDocuments ?? [];
  const docTypes = STAGE_DOCUMENT_TYPES[currentStage] ?? STAGE_DOCUMENT_TYPES['ORDER_FOLLOWUP'];

  const handleUpload = async (values: { documentType: string; remarks?: string; file: any }) => {
    const fileList = values.file || [];
    const file: File | undefined = fileList[0]?.originFileObj;
    if (!file) {
      message.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const { downloadUrl } = await uploadFile(file, `post-award/${tenderId}`);
      await uploadDoc({
        variables: {
          input: {
            postAwardId,
            tenderId,
            stage: currentStage,
            documentType: values.documentType,
            documentName: file.name,
            documentUrl: downloadUrl,
            remarks: values.remarks,
          },
        },
      });
      message.success('Document uploaded');
      setModalOpen(false);
      form.resetFields();
      setIsDirtyUpload(false);
      refetch();
    } catch {
      message.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc({ variables: { id } });
      message.success('Document deleted');
      refetch();
    } catch {
      message.error('Failed to delete document');
    }
  };

  const columns: ColumnsType<PostAwardDocumentItem> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, r) => (
        <Space>
          <FileOutlined />
          <Text style={{ fontSize: 13 }}>{r.documentName}</Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      width: 180,
      render: (_, r) => <Tag color="processing">{r.documentType}</Tag>,
    },
    {
      title: 'Stage',
      key: 'stage',
      width: 160,
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {STAGE_LABELS[r.stage] ?? r.stage}
        </Text>
      ),
    },
    {
      title: 'Uploaded',
      key: 'date',
      width: 140,
      render: (_, r) => (
        <Tooltip title={dayjs(r.createdDate).format('DD MMM YYYY HH:mm')}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(r.createdDate).format('DD MMM YYYY')}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_, r) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => window.open(r.documentUrl, '_blank')}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this document?"
            onConfirm={() => handleDelete(r.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
        <Spin />
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text strong style={{ fontSize: 14 }}>
          Documents ({documents.length})
        </Text>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Upload Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No documents uploaded yet" />
      ) : (
        <Table<PostAwardDocumentItem>
          dataSource={documents}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
        />
      )}

      <Modal
        title="Upload Post-Award Document"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); setIsDirtyUpload(false); }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpload}
          onValuesChange={() => setIsDirtyUpload(true)}
        >
          <Form.Item
            label="Document Type"
            name="documentType"
            rules={[{ required: true, message: 'Select document type' }]}
          >
            <Select options={docTypes} placeholder="Select type" />
          </Form.Item>
          <Form.Item
            label="File"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
            rules={[{
              validator: (_: any, value: any) =>
                value && value.length > 0
                  ? Promise.resolve()
                  : Promise.reject('Please select a file'),
            }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Remarks" name="remarks">
            <Input.TextArea rows={2} placeholder="Optional remarks…" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading} block disabled={!isDirtyUpload}>
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PostAwardDocumentsPanel;
