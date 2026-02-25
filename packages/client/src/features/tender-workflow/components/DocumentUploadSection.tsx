import React, { useState } from "react";
import { Modal, Upload, Button, Typography, Space, message, Select, List, Tag } from "antd";
import { UploadOutlined, FileTextOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { Tender, TenderDocument } from "../types/tender.types";
import { DOCUMENT_TYPES } from "../types/tender.types";
import { useGenerateUploadUrl, uploadFileToS3 } from "../services/upload.service";
import { useCreateTenderDocument } from "../services/tenders.service";
import s from "../styles/tender-workflow.module.css";

const { Text } = Typography;

interface PendingDoc {
  file: File;
  uid: string;
  type: "TECHNICAL" | "FINANCIAL" | "OTHER";
}

interface Props {
  tender: Tender | null;
  open: boolean;
  onClose: () => void;
  onUpload: (tenderId: string, docs: Omit<TenderDocument, "id">[]) => void;
}

const typeColor = (t: string) =>
  t === "TECHNICAL" ? "blue" : t === "FINANCIAL" ? "green" : "default";

const ACCEPT = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const DocumentUploadSection: React.FC<Props> = ({ tender, open, onClose, onUpload }) => {
  const [pending, setPending] = useState<PendingDoc[]>([]);
  const [docType, setDocType] = useState<"TECHNICAL" | "FINANCIAL" | "OTHER">("TECHNICAL");
  const [uploading, setUploading] = useState(false);
  const [generateUrl] = useGenerateUploadUrl();
  const [createDoc] = useCreateTenderDocument();

  const handleClose = () => {
    setPending([]);
    onClose();
  };

  const addFile = (file: File) => {
    if (!ACCEPT.includes(file.type)) {
      message.error("PDF or Word only");
      return false;
    }
    if (file.size / 1024 / 1024 > 10) {
      message.error("Max 10 MB");
      return false;
    }
    setPending((p) => [...p, { file, uid: `${Date.now()}-${file.name}`, type: docType }]);
    return false;
  };

  const handleUpload = async () => {
    if (!tender || !pending.length) return;
    setUploading(true);

    try {
      const uploaded: Omit<TenderDocument, "id">[] = [];

      for (const doc of pending) {
        // 1. Upload to S3
        const { publicUrl } = await uploadFileToS3(
          doc.file,
          `tenders/${tender.id}/docs`,
          generateUrl,
        );

        // 2. Create document record
        await createDoc({
          variables: {
            input: {
              tenderId: tender.id,
              documentName: doc.file.name,
              documentUrl: publicUrl,
            },
          },
        });

        uploaded.push({
          name: doc.file.name,
          type: doc.type,
          uploadedAt: new Date(),
          url: publicUrl,
          size: doc.file.size,
        });
      }

      // 3. Trigger status transition
      onUpload(tender.id, uploaded);
      message.success(`${uploaded.length} document${uploaded.length !== 1 ? "s" : ""} uploaded`);
      setPending([]);
      setUploading(false);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      message.error(msg);
      setUploading(false);
    }
  };

  if (!tender) return null;

  return (
    <Modal
      title="Upload Documents"
      open={open}
      onCancel={handleClose}
      width={500}
      footer={[
        <Button key="c" onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>,
        <Button
          key="u"
          type="primary"
          onClick={handleUpload}
          disabled={!pending.length}
          loading={uploading}
          icon={<UploadOutlined />}
        >
          Upload ({pending.length})
        </Button>,
      ]}
    >
      <div className={s.modalBody}>
        <div className={s.modalInfo}>
          <div className={s.modalInfoRow}>
            <span className={s.modalInfoLabel}>Tender</span>
            <span className={s.modalInfoValue}>{tender.name}</span>
          </div>
          <div className={s.modalInfoRow}>
            <span className={s.modalInfoLabel}>Ref</span>
            <span className={s.refCode}>{tender.referenceNumber}</span>
          </div>
        </div>

        <div>
          <div className={s.docTypeRow}>
            <Text style={{ fontSize: 12 }}>Type:</Text>
            <Select
              value={docType}
              onChange={setDocType}
              options={DOCUMENT_TYPES as any}
              style={{ width: 160 }}
              size="small"
            />
          </div>
          <div className={s.modalUpload} style={{ marginTop: 10 }}>
            <Upload.Dragger
              beforeUpload={(f) => addFile(f as unknown as File)}
              showUploadList={false}
              multiple
              accept=".pdf,.doc,.docx"
            >
              <PlusOutlined style={{ fontSize: 20, color: "var(--tw-accent)" }} />
              <p className={s.draggerText}>
                Drop files or <span>browse</span>
              </p>
              <p className={s.draggerHint}>PDF, DOC, DOCX — max 10 MB</p>
            </Upload.Dragger>
          </div>
        </div>

        {pending.length > 0 && (
          <div>
            <p className={s.sectionLabel}>To upload ({pending.length})</p>
            <List
              size="small"
              className={s.pendingList}
              dataSource={pending}
              renderItem={(d) => (
                <List.Item
                  actions={[
                    <Button
                      key="d"
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => setPending((p) => p.filter((x) => x.uid !== d.uid))}
                    />,
                  ]}
                >
                  <Space size={6}>
                    <FileTextOutlined />
                    <Text style={{ fontSize: 12 }}>{d.file.name}</Text>
                    <Tag color={typeColor(d.type)} style={{ fontSize: 10, margin: 0 }}>
                      {DOCUMENT_TYPES.find((t) => t.value === d.type)?.label}
                    </Tag>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}

        {tender.documents.length > 0 && (
          <div>
            <p className={s.sectionLabel}>Existing ({tender.documents.length})</p>
            <List
              size="small"
              className={s.existingList}
              dataSource={tender.documents}
              renderItem={(d) => (
                <List.Item>
                  <Space size={6}>
                    <FileTextOutlined />
                    <Text style={{ fontSize: 12 }}>{d.name}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};