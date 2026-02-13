import React from "react";
import { Table, Button, Space, Tag, Typography } from "antd";
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
      width: 300,
      render: (t: string) => (
        <Text strong ellipsis={{ tooltip: t }}>
          {t}
        </Text>
      ),
    },
    {
      title: "Tender No",
      dataIndex: "tenderNo",
      width: 120,
      render: (t: string) => <span className={s.refCode}>{t}</span>,
    },
    {
      title: "Department",
      dataIndex: "department",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "statusFromExcel",
      width: 100,
      render: (status: string) => {
        const color = status === "Published" ? "green" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Opening",
      dataIndex: "openingDateTime",
      width: 140,
      render: (t: string) => <span style={{ fontSize: "12px" }}>{t}</span>,
    },
    {
      title: "Due Date/Time",
      dataIndex: "dueDateTime",
      width: 140,
      render: (t: string) => <span style={{ fontSize: "12px" }}>{t}</span>,
    },
    {
      title: "Days",
      dataIndex: "dueDays",
      width: 70,
      align: "center" as const,
      render: (days: number) => (
        <Tag color={days <= 2 ? "red" : days <= 5 ? "orange" : "blue"}>{days}</Tag>
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
            <> · <strong>{selectedKeys.length}</strong> selected</>
          )}
        </span>
        <Space size="small">
          <Button size="small" danger type="text" icon={<DeleteOutlined />} onClick={onClear}>
            Discard
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            disabled={selectedKeys.length === 0}
            onClick={onAddToDraft}
          >
            Add {selectedKeys.length > 0 ? `${selectedKeys.length} ` : ""}to Draft
          </Button>
        </Space>
      </div>
      <Table
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => onSelectionChange(keys),
        }}
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 5, size: "small", showSizeChanger: false }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};
