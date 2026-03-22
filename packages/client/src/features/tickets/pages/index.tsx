import React, { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Spin,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { Ticket, TicketPriority, TicketStatus } from '@gmss/types';
import { useTickets } from '../services/tickets.service';
import styles from './styles.module.css';

const { Title } = Typography;

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'green',
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'blue',
  IN_PROGRESS: 'processing',
  CLOSED: 'default',
};

const TicketsPage: React.FC = () => {
  const { tickets, loading, creating, updating, createTicket, updateTicket, deleteTicket } = useTickets();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [form] = Form.useForm();

  const openCreate = () => {
    setEditingTicket(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    form.setFieldsValue({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      assignedTo: ticket.assignedTo,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingTicket) {
        await updateTicket(editingTicket.id, values);
        message.success('Ticket updated');
      } else {
        await createTicket(values);
        message.success('Ticket created');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      /* validation errors */
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTicket(id);
      message.success('Ticket deleted');
    } catch {
      message.error('Failed to delete ticket');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (p: TicketPriority) => (
        <Tag color={PRIORITY_COLORS[p] ?? 'default'}>{p}</Tag>
      ),
      filters: [
        { text: 'High', value: 'HIGH' },
        { text: 'Medium', value: 'MEDIUM' },
        { text: 'Low', value: 'LOW' },
      ],
      onFilter: (value: unknown, record: Ticket) => record.priority === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s: TicketStatus) => (
        <Tag color={STATUS_COLORS[s] ?? 'default'}>{s?.replace(/_/g, ' ')}</Tag>
      ),
      filters: [
        { text: 'Open', value: 'OPEN' },
        { text: 'In Progress', value: 'IN_PROGRESS' },
        { text: 'Closed', value: 'CLOSED' },
      ],
      onFilter: (value: unknown, record: Ticket) => record.status === value,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Created',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 120,
      render: (d: string) =>
        d ? new Date(d).toLocaleDateString('en-IN') : '\u2014',
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Ticket) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Delete this ticket?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className={styles.center}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={4} style={{ margin: 0 }}>Tickets & To-Do</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Ticket
        </Button>
      </div>

      <Table
        dataSource={tickets}
        columns={columns}
        rowKey="id"
        size="middle"
        pagination={{ pageSize: 15 }}
      />

      <Modal
        title={editingTicket ? 'Edit Ticket' : 'New Ticket'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={creating || updating}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 'HIGH', label: 'High' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'LOW', label: 'Low' },
              ]}
            />
          </Form.Item>
          {editingTicket && (
            <Form.Item label="Status" name="status">
              <Select
                options={[
                  { value: 'OPEN', label: 'Open' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'CLOSED', label: 'Closed' },
                ]}
              />
            </Form.Item>
          )}
          <Form.Item label="Assigned To" name="assignedTo">
            <Input placeholder="Email of assignee" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TicketsPage;
