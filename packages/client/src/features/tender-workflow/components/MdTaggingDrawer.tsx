import React, { useState, useEffect } from "react";
import { Drawer, Button, Space, Select, Tag, Input, Alert } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TagsOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { StatusBadge } from "./StatusBadge";
import type { Tender } from "../types/tender.types";
import { AVAILABLE_TAGS } from "../types/tender.types";
import s from "../styles/tender-workflow.module.css";

interface Props {
  tender: Tender | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (tenderId: string, tagIds: string[]) => void;
  onReject: (tenderId: string, reason: string) => void;
}

const fmtDate = (d?: Date) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : "—";

export const MdTaggingDrawer: React.FC<Props> = ({
  tender,
  open,
  onClose,
  onConfirm,
  onReject,
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tender) {
      setTags(tender.tags.map((t) => t.id));
      setReason("");
      setRejecting(false);
    }
  }, [tender]);

  if (!tender) return null;

  const handleConfirm = async () => {
    if (!tags.length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    onConfirm(tender.id, tags);
    setLoading(false);
  };

  const handleReject = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    onReject(tender.id, reason.trim());
    setLoading(false);
  };

  const tagOptions = AVAILABLE_TAGS.map((t) => ({
    label: <Tag color={t.color}>{t.name}</Tag>,
    value: t.id,
  }));

  return (
    <Drawer
      title="Review Tender"
      placement="right"
      width={520}
      open={open}
      onClose={onClose}
      footer={
        <div className={s.drawerFooter}>
          {rejecting ? (
            <div className={s.rejectArea}>
              <Input.TextArea
                placeholder="Rejection reason…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                maxLength={500}
                showCount
              />
              <div className={s.rejectActions}>
                <Button onClick={() => setRejecting(false)}>Cancel</Button>
                <Button
                  danger
                  type="primary"
                  icon={<CloseCircleOutlined />}
                  onClick={handleReject}
                  loading={loading}
                  disabled={!reason.trim()}
                >
                  Reject
                </Button>
              </div>
            </div>
          ) : (
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button danger icon={<CloseCircleOutlined />} onClick={() => setRejecting(true)}>
                Reject
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleConfirm}
                loading={loading}
                disabled={!tags.length}
              >
                Confirm & Tag
              </Button>
            </Space>
          )}
        </div>
      }
    >
      <div className={s.drawerBody}>
        <div className={s.section}>
          <div className={s.infoGrid}>
            <div className={s.infoItem}>
              <span className={s.infoLabel}>Reference</span>
              <span className={s.infoValue}>
                <span className={s.refCode}>{tender.referenceNumber}</span>
              </span>
            </div>
            {/* <div className={s.infoItem}>
              <span className={s.infoLabel}>Value</span>
              <span className={s.infoValue}>{fmtCurrency(tender.estimatedValue)}</span>
            </div> */}
            <div className={s.infoItem}>
              <span className={s.infoLabel}>Department</span>
              <span className={s.infoValue}>
                <BankOutlined style={{ marginRight: 4 }} />
                {tender.issuingDepartment}
              </span>
            </div>
            <div className={s.infoItem}>
              <span className={s.infoLabel}>Status</span>
              <StatusBadge status={tender.status} />
            </div>
            {/* <div className={s.infoItem}>
              <span className={s.infoLabel}>Published</span>
              <span className={s.infoValue}>{fmtDate(tender.publishDate)}</span>
            </div> */}
            <div className={s.infoItem}>
              <span className={s.infoLabel}>Deadline</span>
              <span className={s.infoValue}>{fmtDate(tender.submissionDeadline)}</span>
            </div>
          </div>
        </div>

        <div className={s.section}>
          <h4 className={s.sectionTitle}>{tender.name}</h4>
          <p className={s.descriptionText}>{tender.description || "No description provided."}</p>
        </div>

        <div className={s.section}>
          <h4 className={s.sectionTitle}>
            <TagsOutlined /> Assign Tags
          </h4>
          <p className={s.tagHint}>Select tags to categorize and match vendors.</p>
          <Select
            mode="multiple"
            placeholder="Select tags…"
            value={tags}
            onChange={setTags}
            options={tagOptions}
            style={{ width: "100%" }}
            optionFilterProp="label"
            showSearch
            allowClear
          />
          {tags.length > 0 && (
            <div className={s.tagChips}>
              {tags.map((id) => {
                const tag = AVAILABLE_TAGS.find((t) => t.id === id);
                return tag ? (
                  <Tag
                    key={id}
                    color={tag.color}
                    closable
                    onClose={() => setTags((p) => p.filter((x) => x !== id))}
                  >
                    {tag.name}
                  </Tag>
                ) : null;
              })}
            </div>
          )}
          {!tags.length && (
            <Alert
              message="Select at least one tag to confirm."
              type="warning"
              showIcon
              style={{ marginTop: 10 }}
            />
          )}
        </div>
      </div>
    </Drawer>
  );
};