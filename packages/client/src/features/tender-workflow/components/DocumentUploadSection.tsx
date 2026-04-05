import React, { useState, useRef } from "react";
import { Modal, Upload, Button, Typography, Space, message, List, Tag, Checkbox } from "antd";
import { UploadOutlined, FileTextOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { Tender, TenderDocument } from "../types/tender.types";
import { DOCUMENT_TYPES } from "../types/tender.types";
import { useGenerateUploadUrl, uploadFileToS3 } from "../services/upload.service";
import { useCreateTenderDocument, useUpdateTender } from "../services/tenders.service";
import s from "../styles/tender-workflow.module.css";

const { Text } = Typography;

interface PendingDoc {
  file: File;
  uid: string;
  type: "TECHNICAL" | "FINANCIAL" | "OTHER";
}

interface UploadProgress {
  fileIndex: number;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [drawingRequired, setDrawingRequired] = useState(false);
  const [strRequired, setStrRequired] = useState(false);
  const [specificationsRequired, setSpecificationsRequired] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [generateUrl] = useGenerateUploadUrl();
  const [createDoc] = useCreateTenderDocument();
  const [updateTenderMut] = useUpdateTender();

  // Sync checkbox state when tender changes
  React.useEffect(() => {
    if (tender) {
      setDrawingRequired(tender.drawingRequired ?? false);
      setStrRequired(tender.strRequired ?? false);
      setSpecificationsRequired(tender.specificationsRequired ?? false);
    }
  }, [tender]);

  const handleClose = () => {
    if (uploading) {
      handleCancelUpload();
      setTimeout(() => onClose(), 300);
    } else {
      setPending([]);
      setUploadProgress([]);
      onClose();
    }
  };

  const addFile = (file: File) => {
    if (!ACCEPT.includes(file.type)) {
      message.error("PDF or Word only");
      return false;
    }
    if (file.size / 1024 / 1024 > 100) {
      message.error("Max 100 MB per file");
      return false;
    }
    setPending((p) => [...p, { file, uid: `${Date.now()}-${file.name}`, type: "TECHNICAL" }]);
    return false;
  };

  const handleUpload = async () => {
    if (!tender || !pending.length) return;
    setUploading(true);
    abortControllerRef.current = new AbortController();
    
    // Initialize progress tracking
    setUploadProgress(pending.map((doc, idx) => ({
      fileIndex: idx,
      fileName: doc.file.name,
      progress: 0,
      status: 'pending' as const,
    })));

    try {
      const uploaded: Omit<TenderDocument, "id">[] = [];

      for (let idx = 0; idx < pending.length; idx++) {
        const doc = pending[idx];
        let publicUrl: string | undefined;
        
        try {
          // Update progress to uploading
          setUploadProgress(prev => [
            ...prev.slice(0, idx),
            { ...prev[idx], status: 'uploading' as const, progress: 10 },
            ...prev.slice(idx + 1)
          ]);

          // 1. Upload to S3 with timeout
          const result = await uploadFileToS3(
            doc.file,
            `tenders/${tender.id}/docs`,
            generateUrl,
            abortControllerRef.current,
            (progress) => {
              setUploadProgress(prev => [
                ...prev.slice(0, idx),
                { ...prev[idx], progress: Math.min(90, 10 + (progress * 0.8)) },
                ...prev.slice(idx + 1)
              ]);
            }
          );
          publicUrl = result.publicUrl;

          // Update progress to creating record
          setUploadProgress(prev => [
            ...prev.slice(0, idx),
            { ...prev[idx], progress: 95 },
            ...prev.slice(idx + 1)
          ]);

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

          // Mark as done
          setUploadProgress(prev => [
            ...prev.slice(0, idx),
            { ...prev[idx], status: 'done' as const, progress: 100 },
            ...prev.slice(idx + 1)
          ]);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Upload failed';
          setUploadProgress(prev => [
            ...prev.slice(0, idx),
            { ...prev[idx], status: 'error' as const, error: errorMsg },
            ...prev.slice(idx + 1)
          ]);
          
          if (err instanceof Error && err.message.includes('aborted')) {
            throw err;
          }
          message.warning(`"${doc.file.name}" could not be stored (${errorMsg}) — advancing anyway.`);
        }

        uploaded.push({
          documentName: doc.file.name,
          documentUrl: publicUrl ?? '',
          createdBy: '',
          createdDate: new Date().toISOString(),
        });
      }

      // 3. Save requirement flags to tender
      try {
        await updateTenderMut({
          variables: {
            id: tender.id,
            input: {
              drawingRequired,
              strRequired,
              specificationsRequired,
            },
          },
        });
      } catch {
        message.warning("Could not save requirement flags");
      }

      // 4. Trigger status transition
      onUpload(tender.id, uploaded);
      message.success(`${uploaded.length} document${uploaded.length !== 1 ? "s" : ""} uploaded`);
      setPending([]);
      setUploadProgress([]);
      setUploading(false);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      if (!msg.includes('aborted')) {
        message.error(msg);
      }
      setUploading(false);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setUploading(false);
      setUploadProgress([]);
      message.info('Upload cancelled');
    }
  };

  if (!tender) return null;

  const isExpired = tender.submissionDeadline && new Date(tender.submissionDeadline).getTime() < Date.now();

  return (
    <Modal
      title="Upload Documents"
      open={open}
      onCancel={handleClose}
      width={500}
      footer={[
        <Button key="c" onClick={handleClose} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Close'}
        </Button>,
        <Button
          key="u"
          type="primary"
          onClick={uploading ? handleCancelUpload : handleUpload}
          disabled={(!uploading && (pending.length === 0 || !!isExpired))}
          loading={uploading}
          danger={uploading}
          icon={uploading ? undefined : <UploadOutlined />}
        >
          {uploading ? "Cancel Upload" : (isExpired ? "Tender Expired" : pending.length > 0 ? `Upload (${pending.length})` : "Advance Status")}
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

        {/* Requirement Checkboxes */}
        <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--bg-muted, #fafafa)', borderRadius: 8, border: '1px solid var(--border-color, #f0f0f0)' }}>
          <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Requirements</Text>
          <Space direction="vertical" size={6}>
            <Checkbox checked={drawingRequired} onChange={(e) => setDrawingRequired(e.target.checked)}>
              Drawing Required
            </Checkbox>
            <Checkbox checked={strRequired} onChange={(e) => setStrRequired(e.target.checked)}>
              STR Required
            </Checkbox>
            <Checkbox checked={specificationsRequired} onChange={(e) => setSpecificationsRequired(e.target.checked)}>
              Specifications Required
            </Checkbox>
          </Space>
        </div>

        <div>
          {/* <div className={s.docTypeRow}>
            <Text style={{ fontSize: 12 }}>Type:</Text>
            <Select
              value={docType}
              onChange={setDocType}
              options={DOCUMENT_TYPES as any}
              style={{ width: 160 }}
              size="small"
            />
          </div> */}
          <div className={s.modalUpload} style={{ marginTop: 10 }}>
            <Upload.Dragger
              beforeUpload={(f) => addFile(f as unknown as File)}
              showUploadList={false}
              multiple
              accept=".pdf,.doc,.docx"
            >
              <PlusOutlined style={{ fontSize: 20, color: "var(--accent)" }} />
              <p className={s.draggerText}>
                Drop files or <span>browse</span>
              </p>
              <p className={s.draggerHint}>PDF, DOC, DOCX — max 100 MB per file</p>
            </Upload.Dragger>
          </div>
        </div>

        {uploadProgress.length > 0 && (
          <div style={{ marginBottom: 16, marginTop: 16 }}>
            <p className={s.sectionLabel} style={{ marginBottom: 12 }}>Upload Progress ({uploadProgress.filter(p => p.status === 'done').length}/{uploadProgress.length})</p>
            <Space direction="vertical" style={{ width: '100%' }}>
              {uploadProgress.map((prog) => (
                <div key={prog.fileIndex} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ fontSize: 12 }}>{prog.fileName}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {prog.status === 'done' ? 'Done' : prog.status === 'error' ? 'Error' : `${Math.round(prog.progress)}%`}
                      </Text>
                    </div>
                    <div style={{
                      width: '100%',
                      height: 6,
                      background: '#f0f0f0',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${prog.progress}%`,
                        background: prog.status === 'error' ? '#ff4d4f' : prog.status === 'done' ? '#52c41a' : '#1677ff',
                        transition: 'width 0.3s',
                      }} />
                    </div>
                    {prog.error && <Text type="danger" style={{ fontSize: 11, display: 'block', marginTop: 2 }}>{prog.error}</Text>}
                  </div>
                </div>
              ))}
            </Space>
          </div>
        )}

        {pending.length > 0 && uploadProgress.length === 0 && (
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
                    <Text style={{ fontSize: 12 }}>{d.documentName}</Text>
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