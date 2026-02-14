import React from "react";
import { Table, Button, Space, Tag, Typography, Tooltip } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Key } from "react";
import type { TenderWorkflowItem } from "../types/tender.types";
import s from "../styles/tender-workflow.module.css";

const { Text } = Typography;

interface Props {
  data: TenderWorkflowItem[];
  selectedKeys: Key[];
  onSelectionChange: (keys: Key[]) => void;
  onAddToDraft: () => void;
  onClear: () => void;
}

const getDueClass = (days: number) => {
  if (days <= 2) return `${s.previewDueTag} ${s.previewDueCritical}`;
  if (days <= 5) return `${s.previewDueTag} ${s.previewDueWarning}`;
  return `${s.previewDueTag} ${s.previewDueNormal}`;
};

export const TenderPreviewTable: React.FC<Props> = ({
  data,
  selectedKeys,
  onSelectionChange,
  onAddToDraft,
  onClear,
}) => {
  if (!data.length) return null;

  const columns: ColumnsType<TenderWorkflowItem> = [
    {
      title: "Title",
      dataIndex: "tenderTitle",
      ellipsis: true,
      width: 300,
      render: (t: string) => (
        <Text strong ellipsis={{ tooltip: t }} style={{ fontSize: 12 }}>
          {t}
        </Text>
      ),
    },
    {
      title: "No.",
      dataIndex: "tenderNo",
      width: 130,
      render: (c: string) => <span className={s.refCode}>{c}</span>,
    },
    {
      title: "Department",
      dataIndex: "department",
      ellipsis: true,
      width: 200,
      render: (d: string) => (
        <Tooltip title={d}>
          <Text ellipsis style={{ fontSize: 12 }}>{d}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "statusFromExcel",
      width: 100,
      render: (st: string) => (
        <Tag
          className={`${s.previewStatusTag} ${st === "Published" ? s.previewStatusPublished : s.previewStatusDefault}`}
        >
          {st || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Opening",
      dataIndex: "openingDateTime",
      width: 130,
      render: (v: string) => <span className={s.previewDateText}>{v || "—"}</span>,
    },
    {
      title: "Due",
      dataIndex: "dueDateTime",
      width: 130,
      render: (v: string) => <span className={s.previewDateText}>{v || "—"}</span>,
    },
    {
      title: "Days",
      dataIndex: "dueDays",
      width: 70,
      align: "center",
      render: (d: number) => (
        <Tag className={getDueClass(Number.isFinite(d) ? d : 999)}>
          {Number.isFinite(d) ? d : "—"}
        </Tag>
      ),
    },
  ];

  return (
    <div className={s.previewWrap}>
      <div className={s.previewBar}>
        <span className={s.previewInfo}>
          <strong>{data.length}</strong> parsed
          {selectedKeys.length > 0 && (
            <> · <strong>{selectedKeys.length}</strong> selected</>
          )}
        </span>
        <Space size={4}>
          <Button size="small" icon={<DeleteOutlined />} onClick={onClear} className={s.previewDiscardBtn}>
            Discard
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            disabled={!selectedKeys.length}
            onClick={onAddToDraft}
            className={s.previewAddBtn}
          >
            Add {selectedKeys.length || ""} to Draft
          </Button>
        </Space>
      </div>
      <Table
        className={s.previewTable}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: onSelectionChange,
        }}
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 4,
          size: "small",
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}–${range[1]} of ${total}`,
        }}
        scroll={{ x: 960 }}
      />
    </div>
  );
};