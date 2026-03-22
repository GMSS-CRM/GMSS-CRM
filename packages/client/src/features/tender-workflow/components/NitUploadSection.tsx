import React, { useState } from "react";
import { Modal, Upload, Button, Typography, message, Progress } from "antd";
import { UploadOutlined, FileTextOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { Tender, TenderDocument } from "../types/tender.types";
import { useFirebaseUpload } from "../hooks/useFirebaseUpload";
import { useCreateTenderDocument } from "../services/tenders.service";
import s from "../styles/tender-workflow.module.css";

const { Text } = Typography;

interface Props {
  tender: Tender | null;
  open: boolean;
  onClose: () => void;
  onUpload: (tenderId: string, doc: Omit<TenderDocument, "id">) => void;
}

export const NitUploadSection: React.FC<Props> = ({ tender, open, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { uploadFile, isLoading: firebaseUploading } = useFirebaseUpload();
  const [createDoc] = useCreateTenderDocument();

  const reset = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
  };

  // Track Firebase loading state
  React.useEffect(() => {
    setUploading(firebaseUploading);
  }, [firebaseUploading]);

  const handleUpload = async () => {
    if (!tender) return;
    setUploading(true);
    setProgress(10);

    let publicUrl: string | undefined;

    if (file) {
      try {
        // 1. Upload to Firebase Cloud Storage
        setProgress(30);
        const result = await uploadFile(file, `tenders/${tender.id}/nit`);
        publicUrl = result.downloadUrl;
        setProgress(60);

        // 2. Create document record
        await createDoc({
          variables: {
            input: {
              tenderId: tender.id,
              documentName: file.name,
              documentUrl: publicUrl,
            },
          },
        });
        setProgress(80);
      } catch {
        message.warning("File could not be stored (Firebase unavailable) — advancing status anyway.");
      }
    }

    setProgress(100);
    // 3. Trigger status transition regardless of upload outcome
    onUpload(tender.id, { name: file?.name ?? "nit", type: "NIT", uploadedAt: new Date(), url: publicUrl, size: file?.size });
    message.success(file ? "NIT submitted" : "Status advanced");
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!tender) return null;

  return (
    <Modal
      title="Upload NIT"
      open={open}
      onCancel={handleClose}
      width={440}
      footer={[
        <Button key="c" onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>,
        <Button
          key="u"
          type="primary"
          onClick={handleUpload}
          disabled={uploading}
          loading={uploading}
          icon={<UploadOutlined />}
        >
          {uploading ? "Uploading…" : file ? "Upload" : "Advance Status"}
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

        {!file && !uploading && (
          <div className={s.modalUpload}>
            <Upload.Dragger
              accept=".pdf"
              maxCount={1}
              showUploadList={false}
              beforeUpload={(f) => {
                const nativeFile = f as unknown as File;
                if (nativeFile.type !== "application/pdf") {
                  message.error("PDF only");
                  return false;
                }
                if (nativeFile.size / 1024 / 1024 > 10) {
                  message.error("Max 10 MB");
                  return false;
                }
                setFile(nativeFile);
                return false;
              }}
            >
              <FileTextOutlined style={{ fontSize: 24, color: "var(--accent)" }} />
              <p className={s.draggerText}>
                Drop PDF or <span>browse</span>
              </p>
              <p className={s.draggerHint}>PDF only, max 10 MB</p>
            </Upload.Dragger>
          </div>
        )}

        {file && !uploading && (
          <div className={s.fileReady}>
            <span className={s.fileReadyInfo}>
              <CheckCircleOutlined />
              {file.name}
              <span className={s.fileSize}>
                ({(file.size / 1024 / 1024).toFixed(1)} MB)
              </span>
            </span>
            <Button size="small" type="text" danger onClick={() => setFile(null)}>
              Remove
            </Button>
          </div>
        )}

        {uploading && (
          <div style={{ textAlign: "center", padding: 8 }}>
            <Progress percent={progress} status="active" size="small" />
            <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>
              Uploading…
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};