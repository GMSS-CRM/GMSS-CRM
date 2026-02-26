import React, { useState, useCallback } from "react";
import { Button, Space, Tooltip, Tag, Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import {
  SendOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  MailOutlined,
  MoreOutlined,
  ReloadOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Tender, TenderStatus, UserRole, TenderTag } from "../types/tender.types";
import { StatusBadge } from "./StatusBadge";
import AppTable from "../../../components/app-table";
import s from "../styles/tender-workflow.module.css";

interface Props {
  tenders: Tender[];
  role: UserRole;
  tabKey: string;
  onView: (tender: Tender) => void;
  onDelete: (id: string) => void;
  onSendToMd: (ids: string[]) => void;
  onResubmit: (id: string) => void;
  onUploadNit: (tender: Tender) => void;
  onUploadDocs: (tender: Tender) => void;
  onMarkReady: (id: string) => void;
  onSendMail: (id: string) => void;
  onVerifyNit: (id: string) => void;
  onApprove?: (id: string) => void;
}

const fmtDate = (d?: Date | string) => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? "—"
    : dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const EMPTY_HINTS: Record<string, string> = {
  draft: "Upload an Excel file to get started.",
  sentToMd: "Send drafts to MD for tagging.",
  nitPending: "Tenders appear here after MD tagging.",
  docsPending: "Upload documents for verified tenders.",
  readyToMail: "Mark tenders ready to notify vendors.",
  completed: "Mailed tenders appear here.",
  pendingApproval: "Tenders sent by users awaiting MD approval.",
  pendingTagging: "NIT uploaded tenders awaiting MD tagging.",
  nitVerification: "NIT documents pending verification.",
  mdCompleted: "Processed tenders.",
};

export const WorkspaceGrid: React.FC<Props> = ({
  tenders,
  role,
  tabKey,
  onView,
  onDelete,
  onSendToMd,
  onResubmit,
  onUploadNit,
  onUploadDocs,
  onMarkReady,
  onSendMail,
  onVerifyNit,
  onApprove,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const primaryAction = useCallback(
    (t: Tender): React.ReactNode => {
      if (role === "USER") {
        const actions: Partial<Record<TenderStatus, React.ReactNode>> = {
          DRAFT: (
            <Button size="small" type="link" icon={<SendOutlined />} onClick={() => onSendToMd([t.id])}>
              Send
            </Button>
          ),
          REJECTED: (
            <Button size="small" type="link" icon={<ReloadOutlined />} onClick={() => onResubmit(t.id)}>
              Resubmit
            </Button>
          ),
          // After MD approves the tender for NIT upload, it will be in
          // `READY_FOR_NIT` state — allow the user to upload NIT then.
          READY_FOR_NIT: (
            <Button size="small" type="link" icon={<UploadOutlined />} onClick={() => onUploadNit(t)}>
              NIT
            </Button>
          ),
          NIT_VERIFIED: (
            <Button size="small" type="link" icon={<FileTextOutlined />} onClick={() => onUploadDocs(t)}>
              Docs
            </Button>
          ),
          DOCS_UPLOADED: (
            <Button size="small" type="link" icon={<CheckCircleOutlined />} onClick={() => onMarkReady(t.id)}>
              Ready
            </Button>
          ),
          READY_TO_MAIL: (
            <Button size="small" type="primary" icon={<MailOutlined />} onClick={() => onSendMail(t.id)} className={s.sendAllBtn}>
              Mail
            </Button>
          ),
        };
        return actions[t.status] || null;
      }
      if (role === "MD") {
          if (t.status === "PENDING_MD_TAGGING")
            return onApprove ? (
              <Button
                size="small"
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => onApprove(t.id)}
              >
                Approve
              </Button>
            ) : null;
          if (t.status === "NIT_UPLOADED")
            return (
              <Button size="small" type="link" icon={<EyeOutlined />} onClick={() => onView(t)}>
                Tag
              </Button>
            );
          if (t.status === "NIT_VERIFIED")
            return (
              <Button size="small" type="link" icon={<CheckCircleOutlined />} onClick={() => onVerifyNit(t.id)}>
                Verify
              </Button>
            );
      }
      return null;
    },
    [role, onSendToMd, onResubmit, onUploadNit, onUploadDocs, onMarkReady, onSendMail, onView, onVerifyNit, onApprove]
  );

  const moreItems = useCallback(
    (t: Tender): MenuProps["items"] => {
      const items: MenuProps["items"] = [
        { key: "view", icon: <EyeOutlined />, label: "View", onClick: () => onView(t) },
      ];
      if (role === "USER" && t.status === "DRAFT") {
        items.push({
          key: "del",
          icon: <DeleteOutlined />,
          label: "Delete",
          danger: true,
          onClick: () => onDelete(t.id),
        });
      }
      return items;
    },
    [role, onView, onDelete]
  );

  const columns: ColumnsType<Tender> = [
    {
      title: "Tender Number",
      dataIndex: "referenceNumber",
      width: 130,
      fixed: "left",
      render: (t: string) => <span className={s.refCode}>{t}</span>,
    },
    {
      title: "TenderTitle",
      dataIndex: "name",
      width: 280,
      ellipsis: true,
      render: (text: string, record) => (
        <span className={s.nameCell}>
          <Tooltip title={text}>
            <span className={s.tenderName}>{text}</span>
          </Tooltip>
          {record.rejectionReason && (
            <Tooltip title={record.rejectionReason}>
              <ExclamationCircleOutlined className={s.rejectionDot} />
            </Tooltip>
          )}
        </span>
      ),
    },
    {
      title: "Deptt./Rly. Unit",
      dataIndex: "issuingDepartment",
      width: 200,
      ellipsis: true,
      render: (t: string) => (
        <Tooltip title={t}>
          <span style={{ fontSize: 12 }}>{t}</span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (st: TenderStatus) => <StatusBadge status={st} />,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      width: 140,
      render: (tags: TenderTag[]) =>
        !tags.length ? (
          <span className={s.noTags}>—</span>
        ) : (
          <span className={s.tagWrap}>
            {tags.slice(0, 2).map((t) => (
              <Tag key={t.id} color={t.color} style={{ fontSize: 10, lineHeight: "16px", margin: 0 }}>
                {t.name}
              </Tag>
            ))}
            {tags.length > 2 && (
              <Tooltip title={tags.slice(2).map((t) => t.name).join(", ")}>
                <Tag style={{ fontSize: 10, lineHeight: "16px", margin: 0 }}>+{tags.length - 2}</Tag>
              </Tooltip>
            )}
          </span>
        ),
    },
    {
      title: "Due Date/Time",
      dataIndex: "submissionDeadline",
      width: 120,
      render: (d?: Date) => {
        if (!d) return <span className={s.noTags}>—</span>;
        const days = Math.ceil((new Date(d).getTime() - Date.now()) / 864e5);
        const color = days < 0 ? "var(--tw-danger)" : days <= 3 ? "var(--tw-warning)" : "var(--tw-success)";
        return (
          <span style={{ color, fontWeight: days <= 3 ? 600 : 400, fontSize: 11 }}>
            {fmtDate(d)}
          </span>
        );
      },
      sorter: (a, b) => {
        if (!a.submissionDeadline) return 1;
        if (!b.submissionDeadline) return -1;
        return new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime();
      },
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      width: 90,
      render: (d: Date) => (
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{fmtDate(d)}</span>
      ),
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "",
      key: "actions",
      width: 140,
      fixed: "right",
      render: (_, r) => (
        <Space size={0}>
          {primaryAction(r)}
          <Dropdown menu={{ items: moreItems(r) }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const canSelect = role === "USER" && ["draft", "readyToMail"].includes(tabKey);

  const handleBulk = useCallback(
    (action: string) => {
      if (!selectedKeys.length) return;
      if (action === "sendToMd") {
        onSendToMd(selectedKeys as string[]);
        setSelectedKeys([]);
        message.success(`${selectedKeys.length} sent to MD`);
      }
      if (action === "sendMail") {
        (selectedKeys as string[]).forEach(onSendMail);
        setSelectedKeys([]);
        message.success("Mail sent");
      }
    },
    [selectedKeys, onSendToMd, onSendMail]
  );

  return (
    <div className={s.gridWrap}>
      {canSelect && selectedKeys.length > 0 && (
        <div className={s.bulkBar}>
          <span className={s.bulkInfo}>{selectedKeys.length} selected</span>
          <Space size={4}>
            {tabKey === "draft" && (
              <Button size="small" type="primary" icon={<SendOutlined />} onClick={() => handleBulk("sendToMd")}>
                Send to MD
              </Button>
            )}
            {tabKey === "readyToMail" && (
              <Button size="small" type="primary" icon={<MailOutlined />} onClick={() => handleBulk("sendMail")} className={s.sendAllBtn}>
                Send Mail
              </Button>
            )}
            <Button size="small" onClick={() => setSelectedKeys([])}>
              Clear
            </Button>
          </Space>
        </div>
      )}

      <div className={s.tableArea}>
        <AppTable<Tender>
          rowSelection={
            canSelect
              ? {
                  selectedRowKeys: selectedKeys,
                  onChange: setSelectedKeys,
                  getCheckboxProps: (r) => ({
                    disabled: tabKey === "draft" ? r.status !== "DRAFT" : r.status !== "READY_TO_MAIL",
                  }),
                }
              : undefined
          }
          columns={columns}
          dataSource={tenders}
          rowKey="id"
          size="small"
          scroll={{ x: 1060 }}
          pagination={
            tenders.length > 10
              ? { pageSize: 10, size: "small", showTotal: (t, r) => `${r[0]}–${r[1]} of ${t}` }
              : false
          }
          locale={{
            emptyText: (
              <div className={s.emptyBox}>
                <FileTextOutlined className={s.emptyIcon} />
                <span className={s.emptyTitle}>No tenders</span>
                <span className={s.emptyHint}>{EMPTY_HINTS[tabKey] || "Nothing here yet."}</span>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};