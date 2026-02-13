import React, { useState } from "react";
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

  const handleFile = async (file: File) => {
    // Validate file type
    const valid =
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls");
    if (!valid) {
      message.error("Please upload Excel files (.xlsx or .xls) only");
      return false;
    }
    
    // Validate file size
    if (file.size / 1024 / 1024 > 10) {
      message.error("File must be under 10MB");
      return false;
    }

    setUploading(true);
    setFileName(file.name);
    
    try {
      // Parse Excel file
      const parsedData = await parseTenderExcel(file);
      
      if (parsedData.length === 0) {
        message.warning("No tender data found in the Excel file");
        setUploading(false);
        setShowDrop(false);
        return false;
      }
      
      // Pass parsed data to parent
      onDataParsed(parsedData);
      message.success(
        `Successfully parsed ${parsedData.length} tender${parsedData.length !== 1 ? "s" : ""} from ${file.name}`
      );
      setUploading(false);
      setShowDrop(false);
    } catch (error) {
      console.error("Excel parsing error:", error);
      message.error(
        error instanceof Error 
          ? error.message 
          : "Failed to parse Excel file. Please check the format and try again."
      );
      setUploading(false);
      setFileName(null);
    }
    
    return false;
  };

  if (hasPreviewData) {
    return (
      <div className={s.uploadParsed}>
        <span className={s.parsedLabel}>
          <CheckCircleOutlined /> {fileName || "File"} parsed
        </span>
        <Button
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            onClearData();
            setFileName(null);
          }}
          danger
          type="text"
        >
          Clear
        </Button>
      </div>
    );
  }

  if (!showDrop) {
    return (
      <Button
        className={s.uploadBtn}
        icon={<UploadOutlined />}
        block
        onClick={() => setShowDrop(true)}
        type="dashed"
      >
        Import tenders from Excel
      </Button>
    );
  }

  return (
    <div className={s.uploadZone}>
      <Upload.Dragger
        accept=".xlsx,.xls"
        showUploadList={false}
        beforeUpload={(file) => handleFile(file as unknown as File)}
        disabled={uploading}
      >
        <InboxOutlined className={s.draggerIcon} />
        <p className={s.draggerText}>
          {uploading ? "Parsing file…" : <>Drop Excel here or <span>browse</span></>}
        </p>
        <p className={s.draggerHint}>.xlsx, .xls — max 10MB</p>
      </Upload.Dragger>
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
  );
};