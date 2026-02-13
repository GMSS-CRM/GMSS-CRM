import React, { useState } from "react";
import { Table, Button, Space, Tooltip, Tag, Dropdown, message } from "antd";
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
}

const fmtDate = (d?: Date) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    : "-";

const EMPTY_HINTS: Record<string, string> = {
  draft: "Upload an Excel file or create tenders to get started.",
  sentToMd: "Send draft tenders to MD for tagging.",
  nitPending: "Tenders appear here after MD tagging.",
  docsPending: "Upload documents for verified tenders.",
  readyToMail: "Mark tenders ready to notify vendors.",
  completed: "Mailed tenders appear here.",
  pendingTagging: "Tenders sent by users will appear here.",
  nitVerification: "NIT documents pending your verification.",
  mdCompleted: "All processed tenders.",
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
}) => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const primaryAction = (t: Tender): React.ReactNode => {
    if (role === "USER") {
      if (t.status === "DRAFT")
        return <Button size="small" type="link" icon={<SendOutlined />} onClick={() => onSendToMd([t.id])}>Send to MD</Button>;
      if (t.status === "REJECTED")
        return <Button size="small" type="link" icon={<ReloadOutlined />} onClick={() => onResubmit(t.id)}>Resubmit</Button>;
      if (t.status === "MD_TAGGED")
        return <Button size="small" type="link" icon={<UploadOutlined />} onClick={() => onUploadNit(t)}>Upload NIT</Button>;
      if (t.status === "NIT_VERIFIED")
        return <Button size="small" type="link" icon={<FileTextOutlined />} onClick={() => onUploadDocs(t)}>Upload Docs</Button>;
      if (t.status === "DOCS_UPLOADED")
        return <Button size="small" type="link" icon={<CheckCircleOutlined />} onClick={() => onMarkReady(t.id)}>Mark Ready</Button>;
      if (t.status === "READY_TO_MAIL")
        return <Button size="small" type="primary" icon={<MailOutlined />} onClick={() => onSendMail(t.id)} className={s.sendAllBtn}>Send Mail</Button>;
    }
    if (role === "MD") {
      if (t.status === "PENDING_MD_TAGGING")
        return <Button size="small" type="link" icon={<EyeOutlined />} onClick={() => onView(t)}>Review</Button>;
      if (t.status === "NIT_UPLOADED")
        return <Button size="small" type="link" icon={<CheckCircleOutlined />} onClick={() => onVerifyNit(t.id)}>Verify NIT</Button>;
    }
    return null;
  };

  const moreItems = (t: Tender): MenuProps["items"] => {
    const items: MenuProps["items"] = [
      { key: "view", icon: <EyeOutlined />, label: "View Details", onClick: () => onView(t) },
    ];
    if (role === "USER" && t.status === "DRAFT") {
      items.push({ key: "del", icon: <DeleteOutlined />, label: "Delete", danger: true, onClick: () => onDelete(t.id) });
    }
    return items;
  };

  const columns: ColumnsType<Tender> = [
    {
      title: "Tender No",
      dataIndex: "referenceNumber",
      width: 140,
      fixed: "left",
      render: (t: string) => <span className={s.refCode}>{t}</span>,
    },
    {
      title: "Tender Title",
      dataIndex: "name",
      width: 300,
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
      title: "Department",
      dataIndex: "issuingDepartment",
      width: 220,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 160,
      render: (st: TenderStatus) => <StatusBadge status={st} />,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      width: 200,
      render: (tags: TenderTag[]) =>
        tags.length === 0 ? (
          <span className={s.noTags}>—</span>
        ) : (
          <span className={s.tagWrap}>
            {tags.slice(0, 2).map((t) => (
              <Tag key={t.id} color={t.color}>{t.name}</Tag>
            ))}
            {tags.length > 2 && (
              <Tooltip title={tags.slice(2).map((t) => t.name).join(", ")}>
                <Tag>+{tags.length - 2}</Tag>
              </Tooltip>
            )}
          </span>
        ),
    },
    {
      title: "Due Date/Time",
      dataIndex: "submissionDeadline",
      width: 100,
      render: (d?: Date) => {
        if (!d) return <span style={{ color: "#999" }}>—</span>;
        const now = new Date();
        const diff = d.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        const isUrgent = days <= 3 && days >= 0;
        const isPast = days < 0;
        return (
          <span style={{ 
            color: isPast ? "#ff4d4f" : isUrgent ? "#fa8c16" : "#52c41a",
            fontWeight: isUrgent || isPast ? 600 : 400
          }}>
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
      width: 100,
      render: (d: Date) => <span style={{ fontSize: "12px", color: "#666" }}>{fmtDate(d)}</span>,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "",
      key: "actions",
      width: 170,
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

  const handleBulk = (action: string) => {
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
  };

  return (
    <div className={s.gridWrap}>
      {canSelect && selectedKeys.length > 0 && (
        <div className={s.bulkBar}>
          <span className={s.bulkInfo}>
            {selectedKeys.length} selected
          </span>
          <Space size="small">
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
            <Button size="small" onClick={() => setSelectedKeys([])}>Clear</Button>
          </Space>
        </div>
      )}

      <div className={s.tableArea}>
        <Table
          rowSelection={
            canSelect
              ? {
                  selectedRowKeys: selectedKeys,
                  onChange: (keys) => setSelectedKeys(keys),
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
          scroll={{ x: 1100 }}
          pagination={
            tenders.length > 10
              ? { pageSize: 10, size: "small", showTotal: (t, r) => `${r[0]}–${r[1]} of ${t}` }
              : false
          }
          locale={{
            emptyText: (
              <div className={s.emptyBox}>
                <FileTextOutlined className={s.emptyIcon} />
                <span className={s.emptyTitle}>No tenders here</span>
                <span className={s.emptyHint}>{EMPTY_HINTS[tabKey] || "No tenders in this stage."}</span>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};