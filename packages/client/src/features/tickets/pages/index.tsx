import React, { useState, useMemo } from 'react';
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
  DatePicker,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
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
  const [isDirty, setIsDirty] = useState(false);
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState('');
  const [searchDate, setSearchDate] = useState<Dayjs | null>(null);

  const filteredTickets = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return (tickets ?? []).filter((t) => {
      const matchesText =
        !q ||
        t.title?.toLowerCase().includes(q) ||
        t.assignedTo?.toLowerCase().includes(q);

      const matchesDate =
        !searchDate ||
        (t.createdDate &&
          dayjs(t.createdDate).format('YYYY-MM-DD') === searchDate.format('YYYY-MM-DD'));

      return matchesText && matchesDate;
    });
  }, [tickets, searchText, searchDate]);

  const openCreate = () => {
    setEditingTicket(null);
    form.resetFields();
    setIsDirty(false);
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
    setIsDirty(false);
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
    } catch (err: any) {
      if (err?.errorFields) return; // Inline validation messages shown by Form
      message.error('Failed to save ticket');
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
        d ? new Date(d).toLocaleDateString('en-IN') : '—',
      sorter: (a: Ticket, b: Ticket) => {
        const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
        const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
        return dateB - dateA;
      },
      defaultSortOrder: 'descend' as const,
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

      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={10}>
          <Input
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            placeholder="Search by title or assigned to"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Filter by created date"
            value={searchDate}
            onChange={(d) => setSearchDate(d)}
            allowClear
          />
        </Col>
      </Row>

      <Table
        dataSource={filteredTickets}
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
        okButtonProps={{ disabled: !isDirty }}
      >
        <Form form={form} layout="vertical" onValuesChange={() => setIsDirty(true)}>
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
            initialValue="MEDIUM"
            rules={[{ required: true, message: 'Please select a priority' }]}
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
