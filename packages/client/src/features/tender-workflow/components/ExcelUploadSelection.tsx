import React, { useState, useCallback } from "react";
import { Upload, Button, message } from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { TenderWorkflowItem } from "../types/tender.types";
import { parseTenderExcel } from "../utils/excelParser";
import s from "../styles/tender-workflow.module.css";

interface Props {
  onDataParsed: (data: TenderWorkflowItem[]) => void;
  hasPreviewData: boolean;
  onClearData: () => void;
}

export const ExcelUploadSection: React.FC<Props> = ({
  onDataParsed,
  hasPreviewData,
  onClearData,
}) => {
  const [showDrop, setShowDrop] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        message.error("Excel files (.xlsx, .xls) only");
        return false;
      }
      if (file.size / 1024 / 1024 > 100) {
        message.error("File must be under 100 MB");
        return false;
      }

      setUploading(true);
      setFileName(file.name);
      setParseProgress(0);

      try {
        const data = await parseTenderExcel(file, (progress) => {
          setParseProgress(Math.round(progress * 100));
        });
        if (!data.length) {
          message.warning("No tender data found");
          setFileName(null);
          return false;
        }
        onDataParsed(data);
        message.success(`Parsed ${data.length} tender${data.length !== 1 ? "s" : ""}`);
        setShowDrop(false);
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Failed to parse file");
        setFileName(null);
      } finally {
        setUploading(false);
        setParseProgress(0);
      }
      return false;
    },
    [onDataParsed]
  );

  const handleClear = useCallback(() => {
    onClearData();
    setFileName(null);
    setShowDrop(false);
  }, [onClearData]);

  if (hasPreviewData) {
    return (
      <div className={s.uploadParsed}>
        <span className={s.parsedLabel}>
          <CheckCircleOutlined /> {fileName || "File"} parsed
        </span>
        <Button
          size="small"
          icon={<DeleteOutlined />}
          onClick={handleClear}
          className={s.clearParsedBtn}
        >
          Clear
        </Button>
      </div>
    );
  }

  if (!showDrop) {
    return (
      <div className={s.uploadIntro}>
        <div className={s.uploadIntroText}>
          <span className={s.uploadIntroTitle}>Import tender list</span>
          <span className={s.uploadIntroHint}>.xlsx / .xls — max 100 MB</span>
        </div>
        <Button
          className={s.uploadBtn}
          icon={<UploadOutlined />}
          onClick={() => setShowDrop(true)}
          type="primary"
        >
          Upload Excel
        </Button>
      </div>
    );
  }

  return (
    <div className={s.uploadZone}>
      <div className={s.uploadZoneHead}>
        <span className={s.uploadZoneTitle}>
          {fileName ? `Selected: ${fileName}` : "Drop Excel file here"}
        </span>
        {!uploading && (
          <Button
            className={s.uploadClose}
            icon={<CloseOutlined />}
            type="text"
            size="small"
            onClick={() => setShowDrop(false)}
          />
        )}
      </div>
      <div className={s.uploadDragger}>
        <Upload.Dragger
          accept=".xlsx,.xls"
          showUploadList={false}
          beforeUpload={(f) => handleFile(f as unknown as File)}
          disabled={uploading}
        >
          <InboxOutlined className={s.draggerIcon} />
          <p className={s.draggerText}>
            {uploading ? `Parsing… ${parseProgress}%` : <>Drop here or <span>browse</span></>}
          </p>
          <p className={s.draggerHint}>.xlsx, .xls — max 100 MB</p>
        </Upload.Dragger>
      </div>
      {uploading && parseProgress > 0 && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color, #f0f0f0)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary, #666)' }}>Parsing Excel file…</span>
            <span style={{ fontSize: 12, color: 'var(--accent, #1677ff)', fontWeight: 600 }}>{parseProgress}%</span>
          </div>
          <div style={{
            width: '100%',
            height: 6,
            background: 'var(--border-color, #f0f0f0)',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${parseProgress}%`,
              background: 'var(--accent, #1677ff)',
              transition: 'width 0.2s',
            }} />
          </div>
        </div>
      )}
    </div>
  );
};