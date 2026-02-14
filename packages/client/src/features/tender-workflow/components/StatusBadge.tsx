import React from "react";
import { Tag } from "antd";
import {
  EditOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { TenderStatus } from "../types/tender.types";
import { STATUS_COLORS, STATUS_LABELS } from "../types/tender.types";
import s from "../styles/tender-workflow.module.css";

const ICONS: Record<TenderStatus, React.ReactNode> = {
  DRAFT: <EditOutlined />,
  PENDING_MD_TAGGING: <ClockCircleOutlined />,
  MD_TAGGED: <CheckCircleOutlined />,
  REJECTED: <CloseCircleOutlined />,
  NIT_UPLOADED: <FileTextOutlined />,
  NIT_VERIFIED: <SafetyCertificateOutlined />,
  DOCS_UPLOADED: <FileTextOutlined />,
  READY_TO_MAIL: <SendOutlined />,
  MAIL_SENT: <MailOutlined />,
};

interface Props {
  status: TenderStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<Props> = ({ status, showIcon = true }) => (
  <Tag
    color={STATUS_COLORS[status]}
    icon={showIcon ? ICONS[status] : undefined}
    className={s.statusTag}
  >
    {STATUS_LABELS[status]}
  </Tag>
);