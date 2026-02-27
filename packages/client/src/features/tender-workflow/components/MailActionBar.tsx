import React, { useState, useCallback } from "react";
import { Button, Modal, Alert, List, Checkbox, Tag, Typography } from "antd";
import { SendOutlined, MailOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { Tender } from "../types/tender.types";
import s from "../styles/tender-workflow.module.css";

const { Text } = Typography;

interface Props {
  tenders: Tender[];
  onSendMail: (id: string) => void;
  onSendMailBulk: (ids: string[]) => void;
}

export const MailActionBar: React.FC<Props> = ({ tenders, onSendMail, onSendMailBulk }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const ready = tenders.filter((t) => t.status === "READY_TO_MAIL");
  const totalVendors = ready.reduce((sum, t) => sum + t.tags.length * 15, 0);

  const openConfirm = () => {
    setSelectedIds(ready.map((t) => t.id));
    setShowConfirm(true);
  };

  const handleSend = useCallback(() => {
    if (selectedIds.length === 1) onSendMail(selectedIds[0]);
    else onSendMailBulk(selectedIds);
    setShowConfirm(false);
    setSelectedIds([]);
  }, [selectedIds, onSendMail, onSendMailBulk]);

  const toggle = (id: string, checked: boolean) =>
    setSelectedIds((p) => (checked ? [...p, id] : p.filter((x) => x !== id)));

  if (!ready.length) return null;

  return (
    <>
      <div className={s.mailBar}>
        <div className={s.mailStats}>
          <div className={s.mailStat}>
            <span className={s.mailStatValue}>{ready.length}</span>
            <span className={s.mailStatLabel}>Ready</span>
          </div>
          <div className={s.mailStat}>
            <span className={s.mailStatValue}>
              {ready.reduce((a, t) => a + t.documents.length + 1, 0)}
            </span>
            <span className={s.mailStatLabel}>Documents</span>
          </div>
          <div className={s.mailStat}>
            <span className={s.mailStatValue}>~{totalVendors}</span>
            <span className={s.mailStatLabel}>Vendors</span>
          </div>
        </div>
        <Button type="primary" icon={<SendOutlined />} onClick={openConfirm} className={s.sendAllBtn}>
          Send Mail
        </Button>
      </div>

      <Modal
        title={<><MailOutlined /> Confirm Dispatch</>}
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        width={520}
        footer={[
          <Button key="c" onClick={() => setShowConfirm(false)}>Cancel</Button>,
          <Button
            key="s"
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!selectedIds.length}
            className={s.sendAllBtn}
          >
            Send ({selectedIds.length})
          </Button>,
        ]}
      >
        <div className={s.mailConfirm}>
          <Alert message="Matching vendors will receive email with documents." type="info" showIcon />
          <List
            className={s.mailList}
            size="small"
            dataSource={ready}
            renderItem={(t) => (
              <List.Item>
                <Checkbox
                  checked={selectedIds.includes(t.id)}
                  onChange={(e) => toggle(t.id, e.target.checked)}
                >
                  <div className={s.mailItemInfo}>
                    <Text strong style={{ fontSize: 12 }}>{t.name}</Text>
                    <span className={s.refCode}>{t.referenceNumber}</span>
                    {t.tags.length > 0 && (
                      <div className={s.mailItemTags}>
                        {t.tags.map((tag) => (
                          <Tag key={tag.id} color={tag.color} style={{ fontSize: 10, margin: 0 }}>
                            {tag.name}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </Checkbox>
              </List.Item>
            )}
          />
          {selectedIds.length > 0 && (
            <div className={s.mailSummary}>
              <CheckCircleOutlined style={{ marginRight: 6 }} />
              {selectedIds.length} tender{selectedIds.length !== 1 ? "s" : ""} · ~
              {selectedIds.reduce((sum, id) => {
                const t = ready.find((x) => x.id === id);
                return sum + (t?.tags.length || 0) * 15;
              }, 0)}{" "}
              vendors
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};