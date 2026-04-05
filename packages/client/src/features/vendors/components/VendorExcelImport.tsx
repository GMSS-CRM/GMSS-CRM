import React, { useState, useCallback, useMemo } from "react";
import {
  Upload,
  Button as AntButton,
  message,
  Table,
  Tag,
  Space,
  Modal,
  Typography,
  Progress,
  Tooltip,
  Empty,
} from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Button from "../../../components/button";
import {
  parseVendorExcel,
  type VendorExcelRow,
} from "../utils/vendorExcelParser";
import { useCreateVendor } from "../services/vendors.service";
import type { CompanyType, ContactPerson } from "../types";
import styles from "./VendorExcelImport.module.css";

const { Text } = Typography;

interface Props {
  onImportComplete: () => void;
}

export default function VendorExcelImport({ onImportComplete }: Props) {
  const [step, setStep] = useState<"idle" | "drop" | "preview" | "importing">(
    "idle",
  );
  const [rows, setRows] = useState<VendorExcelRow[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseProgress, setParseProg] = useState(0);
  const [importProgress, setImportProg] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const { createVendor } = useCreateVendor();

  // ── Parse ──────────────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      message.error("Only .xlsx / .xls files are supported");
      return false;
    }
    if (file.size / 1024 / 1024 > 100) {
      message.error("File must be under 100 MB");
      return false;
    }

    setFileName(file.name);
    setParseProg(0);

    try {
      const data = await parseVendorExcel(file, (p) =>
        setParseProg(Math.round(p * 100)),
      );
      if (!data.length) {
        message.warning("No vendor rows found in the file");
        return false;
      }
      setRows(data);
      setSelectedKeys(data.map((r) => r._key));
      setStep("preview");
      message.success(`Parsed ${data.length} vendor${data.length !== 1 ? "s" : ""}`);
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "Failed to parse file",
      );
    } finally {
      setParseProg(0);
    }
    return false;
  }, []);

  // ── Import selected rows (batched for performance) ─────────────────────
  const handleImport = useCallback(async () => {
    const selected = rows.filter((r) => selectedKeys.includes(r._key));
    if (!selected.length) {
      message.warning("Please select at least one vendor to import");
      return;
    }

    setStep("importing");
    setImportProg(0);
    const errors: string[] = [];
    let created = 0;

    // Process in concurrent batches of 10 to avoid overwhelming the server
    // while staying much faster than sequential processing
    const BATCH_SIZE = 10;

    for (let batchStart = 0; batchStart < selected.length; batchStart += BATCH_SIZE) {
      const batch = selected.slice(batchStart, batchStart + BATCH_SIZE);
      
      const results = await Promise.allSettled(
        batch.map(async (row) => {
          const contactPersons: ContactPerson[] = row.contactName
            ? [
                {
                  id: `cp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                  name: row.contactName,
                  phone: row.phone,
                  email: {
                    mailto: row.email ? [row.email] : [],
                    cc: [],
                    bcc: [],
                  },
                },
              ]
            : [];

          return createVendor({
            companyName: row.companyName,
            companyType: row.companyType as CompanyType,
            isLinkedWithRailways: false,
            status: "New",
            address: row.address,
            contactPersons,
            gstNumber: row.gstNumber,
            panNumber: row.panNumber,
          });
        }),
      );

      for (let j = 0; j < results.length; j++) {
        const res = results[j];
        if (res.status === "fulfilled") {
          created++;
        } else {
          const msg = res.reason instanceof Error ? res.reason.message : "Unknown error";
          errors.push(`${batch[j].companyName}: ${msg}`);
        }
      }

      setImportProg(Math.round(Math.min((batchStart + batch.length) / selected.length, 1) * 100));
      // Yield to UI between batches
      await new Promise((r) => setTimeout(r, 0));
    }

    setImportErrors(errors);

    if (created > 0) {
      message.success(`${created} vendor${created !== 1 ? "s" : ""} created`);
      onImportComplete();
    }
    if (errors.length) {
      message.warning(`${errors.length} vendor${errors.length !== 1 ? "s" : ""} failed`);
    }

    // Reset
    setStep("idle");
    setRows([]);
    setSelectedKeys([]);
    setFileName(null);
    setImportProg(0);
  }, [rows, selectedKeys, createVendor, onImportComplete]);

  // ── Clear ─────────────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    setStep("idle");
    setRows([]);
    setSelectedKeys([]);
    setFileName(null);
    setImportErrors([]);
  }, []);

  // ── Preview table columns ─────────────────────────────────────────────────
  const columns: ColumnsType<VendorExcelRow> = useMemo(
    () => [
      {
        title: "Company Name",
        dataIndex: "companyName",
        key: "companyName",
        ellipsis: true,
        render: (v: string) => <Text strong>{v}</Text>,
      },
      {
        title: "Type",
        dataIndex: "companyType",
        key: "companyType",
        width: 110,
        render: (v: string) => (
          <Tag color={v === "Consultant" ? "purple" : "blue"}>{v}</Tag>
        ),
      },
      {
        title: "Contact",
        dataIndex: "contactName",
        key: "contactName",
        width: 150,
        ellipsis: true,
        render: (v?: string) =>
          v ? v : <Text type="secondary">—</Text>,
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        width: 130,
        render: (v?: string) =>
          v ? v : <Text type="secondary">—</Text>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 180,
        ellipsis: true,
        render: (v?: string) =>
          v ? v : <Text type="secondary">—</Text>,
      },
      {
        title: "GST",
        dataIndex: "gstNumber",
        key: "gst",
        width: 160,
        render: (v?: string) =>
          v ? (
            <Text style={{ fontFamily: "monospace", fontSize: 12 }}>{v}</Text>
          ) : (
            <Text type="secondary">—</Text>
          ),
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        width: 200,
        ellipsis: true,
        render: (v?: string) =>
          v ? v : <Text type="secondary">—</Text>,
      },
    ],
    [],
  );

  // ── Error modal ─────────────────────────────────────────────────────────
  const [showErrors, setShowErrors] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  //  Render
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Idle: show upload button ───────────────────────────────────────────
  if (step === "idle") {
    return (
      <>
        <div className={styles.uploadIntro}>
          <div className={styles.uploadIntroText}>
            <span className={styles.uploadIntroTitle}>Import vendors from Excel</span>
            <span className={styles.uploadIntroHint}>.xlsx / .xls — max 100 MB</span>
          </div>
          <AntButton
            className={styles.uploadBtn}
            icon={<UploadOutlined />}
            onClick={() => setStep("drop")}
            type="primary"
            size="small"
          >
            Upload Excel
          </AntButton>
        </div>

        {/* Show errors from last import if any */}
        {importErrors.length > 0 && (
          <div className={styles.errorBanner}>
            <ExclamationCircleOutlined style={{ color: "#d97706" }} />
            <span>
              {importErrors.length} vendor{importErrors.length !== 1 ? "s" : ""} failed to import.
            </span>
            <AntButton size="small" type="link" onClick={() => setShowErrors(true)}>
              View details
            </AntButton>
          </div>
        )}

        <Modal
          title="Import Errors"
          open={showErrors}
          onCancel={() => setShowErrors(false)}
          footer={null}
          width={500}
        >
          {importErrors.map((e, i) => (
            <div key={i} style={{ fontSize: 13, marginBottom: 4, color: "#dc2626" }}>
              • {e}
            </div>
          ))}
        </Modal>
      </>
    );
  }

  // ── Drop zone ─────────────────────────────────────────────────────────
  if (step === "drop") {
    return (
      <div className={styles.uploadZone}>
        <div className={styles.uploadZoneHead}>
          <span className={styles.uploadZoneTitle}>
            {fileName ? `Selected: ${fileName}` : "Drop Excel file here"}
          </span>
          {!parseProgress && (
            <AntButton
              icon={<CloseOutlined />}
              type="text"
              size="small"
              onClick={() => setStep("idle")}
            />
          )}
        </div>
        <div className={styles.uploadDragger}>
          <Upload.Dragger
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={(f) => handleFile(f as unknown as File)}
            disabled={!!parseProgress}
          >
            <InboxOutlined className={styles.draggerIcon} />
            <p className={styles.draggerText}>
              {parseProgress
                ? `Parsing… ${parseProgress}%`
                : (
                    <>
                      Drop here or <span>browse</span>
                    </>
                  )}
            </p>
            <p className={styles.draggerHint}>.xlsx, .xls — max 100 MB</p>
          </Upload.Dragger>
        </div>
        {parseProgress > 0 && (
          <div style={{ padding: "10px 16px" }}>
            <Progress percent={parseProgress} size="small" />
          </div>
        )}
      </div>
    );
  }

  // ── Preview table ─────────────────────────────────────────────────────
  if (step === "preview") {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.previewHeader}>
          <Space>
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            <Text strong>{fileName}</Text>
            <Text type="secondary">
              — {rows.length} vendor{rows.length !== 1 ? "s" : ""} found,{" "}
              {selectedKeys.length} selected
            </Text>
          </Space>
          <Space>
            <Button
              variant="primary"
              size="small"
              onClick={handleImport}
              disabled={!selectedKeys.length}
            >
              Import {selectedKeys.length} Vendor{selectedKeys.length !== 1 ? "s" : ""}
            </Button>
            <Tooltip title="Clear">
              <AntButton
                icon={<DeleteOutlined />}
                size="small"
                onClick={handleClear}
              />
            </Tooltip>
          </Space>
        </div>

        <Table<VendorExcelRow>
          dataSource={rows}
          columns={columns}
          rowKey="_key"
          size="small"
          scroll={{ x: "max-content" }}
          pagination={
            rows.length > 15
              ? { pageSize: 15, showSizeChanger: true, size: "small" }
              : false
          }
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }}
          locale={{
            emptyText: (
              <Empty description="No vendors to import" />
            ),
          }}
        />
      </div>
    );
  }

  // ── Importing progress ────────────────────────────────────────────────
  if (step === "importing") {
    return (
      <div className={styles.importingContainer}>
        <Text>
          Creating vendors… {importProgress}%
        </Text>
        <Progress percent={importProgress} status="active" />
      </div>
    );
  }

  return null;
}
