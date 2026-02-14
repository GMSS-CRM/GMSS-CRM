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
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        message.error("Excel files (.xlsx, .xls) only");
        return false;
      }
      if (file.size / 1024 / 1024 > 10) {
        message.error("File must be under 10 MB");
        return false;
      }

      setUploading(true);
      setFileName(file.name);

      try {
        const data = await parseTenderExcel(file);
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
          <span className={s.uploadIntroHint}>.xlsx / .xls — max 10 MB</span>
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
            {uploading ? "Parsing…" : <>Drop here or <span>browse</span></>}
          </p>
          <p className={s.draggerHint}>.xlsx, .xls — max 10 MB</p>
        </Upload.Dragger>
      </div>
    </div>
  );
};