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

const getDueTagClass = (days: number): string => {
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
  const columns: ColumnsType<TenderWorkflowItem> = [
    {
      title: "Tender Title",
      dataIndex: "tenderTitle",
      ellipsis: true,
      width: 320,
      render: (title: string) => (
        <Text strong ellipsis={{ tooltip: title }}>
          {title}
        </Text>
      ),
    },
    {
      title: "Tender No",
      dataIndex: "tenderNo",
      width: 140,
      render: (code: string) => <span className={s.refCode}>{code}</span>,
    },
    {
      title: "Department",
      dataIndex: "department",
      ellipsis: true,
      width: 220,
      render: (department: string) => (
        <Tooltip title={department}>
          <Text ellipsis>{department}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "statusFromExcel",
      width: 120,
      render: (status: string) => (
        <Tag className={`${s.previewStatusTag} ${status === "Published" ? s.previewStatusPublished : s.previewStatusDefault}`}>
          {status || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Opening",
      dataIndex: "openingDateTime",
      width: 150,
      render: (value: string) => <span className={s.previewDateText}>{value || "-"}</span>,
    },
    {
      title: "Due Date/Time",
      dataIndex: "dueDateTime",
      width: 160,
      render: (value: string) => <span className={s.previewDateText}>{value || "-"}</span>,
    },
    {
      title: "Days",
      dataIndex: "dueDays",
      width: 90,
      align: "center" as const,
      render: (days: number) => (
        <Tag className={getDueTagClass(Number.isFinite(days) ? days : 999)}>
          {Number.isFinite(days) ? days : "-"}
        </Tag>
      ),
    },
  ];

  if (!data.length) return null;

  return (
    <div className={s.previewWrap}>
      <div className={s.previewBar}>
        <span className={s.previewInfo}>
          <strong>{data.length}</strong> tender{data.length !== 1 ? "s" : ""} parsed
          {selectedKeys.length > 0 && (
            <>
              {" "}| <strong>{selectedKeys.length}</strong> selected
            </>
          )}
        </span>
        <Space size="small">
          <Button
            size="small"
            icon={<DeleteOutlined />}
            onClick={onClear}
            className={s.previewDiscardBtn}
          >
            Discard
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            disabled={selectedKeys.length === 0}
            onClick={onAddToDraft}
            className={s.previewAddBtn}
          >
            Add {selectedKeys.length > 0 ? `${selectedKeys.length} ` : ""}to Draft
          </Button>
        </Space>
      </div>
      <Table
        className={s.previewTable}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => onSelectionChange(keys),
        }}
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 4,
          size: "small",
          showSizeChanger: false,
          position: ["bottomRight"],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }}
        scroll={{ x: 1080 }}
      />
    </div>
  );
};
