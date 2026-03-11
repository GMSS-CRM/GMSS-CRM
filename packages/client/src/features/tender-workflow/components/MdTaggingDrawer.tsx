import React, { useState, useEffect } from "react";
import { Drawer, Button, Space, Select, Tag, Input, Alert, Divider, message } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TagsOutlined,
  BankOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { StatusBadge } from "./StatusBadge";
import type { Tender } from "../types/tender.types";
import { useSearchTags, useCreateTag } from "../../tags/services/tags.service";
import s from "../styles/tender-workflow.module.css";

interface Props {
  tender: Tender | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (tenderId: string, tagIds: string[]) => Promise<void>;
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
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);

  useEffect(() => {
    if (tender) {
      // One tender = one tag: use first existing tag
      setSelectedTag(tender.tags.length > 0 ? tender.tags[0].id : undefined);
      setReason("");
      setRejecting(false);
      setNewTagName("");
    }
  }, [tender]);

  const { data: tagsData, refetch: refetchTags } = useSearchTags();
  const [createTagMut] = useCreateTag();
  const serverTags = tagsData?.searchTags ?? [];

  if (!tender) return null;

  const handleConfirm = async () => {
    if (!selectedTag) return;
    setLoading(true);
    try {
      await onConfirm(tender.id, [selectedTag]);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    onReject(tender.id, reason.trim());
    setLoading(false);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setCreatingTag(true);
    try {
      const result = await createTagMut({ variables: { input: { name: newTagName.trim() } } });
      const newId = result.data?.createTag?.id;
      if (newId) {
        setSelectedTag(newId);
        setNewTagName("");
        void refetchTags();
        message.success(`Tag "${newTagName.trim()}" created`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create tag";
      message.error(msg);
    } finally {
      setCreatingTag(false);
    }
  };

  const tagOptions = serverTags.map((t) => ({
    label: t.name,
    value: t.id,
  }));

  const isNitReview = tender.status === "NIT_UPLOADED";

  return (
    <Drawer
      title={isNitReview ? "Verify NIT & Tag" : "Review Tender"}
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
                {isNitReview ? "Send Back" : "Reject"}
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleConfirm}
                loading={loading}
                disabled={!selectedTag}
              >
                {isNitReview ? "Verify & Tag" : "Confirm & Tag"}
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
            <TagsOutlined /> Assign Tag
          </h4>
          <p className={s.tagHint}>Select one tag to categorize this tender and match vendors.</p>
          <Select
            placeholder="Select a tag…"
            value={selectedTag}
            onChange={(val) => setSelectedTag(val)}
            options={tagOptions}
            style={{ width: "100%" }}
            optionFilterProp="label"
            showSearch
            allowClear
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder="New tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleCreateTag(); } }}
                    size="small"
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={handleCreateTag}
                    loading={creatingTag}
                    disabled={!newTagName.trim()}
                    size="small"
                  >
                    Create
                  </Button>
                </Space>
              </>
            )}
          />
          {selectedTag && (
            <div className={s.tagChips} style={{ marginTop: 8 }}>
              {(() => {
                const tag = serverTags.find((t) => t.id === selectedTag);
                return tag ? (
                  <Tag
                    color="blue"
                    closable
                    onClose={() => setSelectedTag(undefined)}
                  >
                    {tag.name}
                  </Tag>
                ) : null;
              })()}
            </div>
          )}
          {!selectedTag && (
            <Alert
              message="Select a tag to confirm."
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