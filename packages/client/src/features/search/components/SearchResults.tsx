import React from 'react';
import { Card, Empty, Space, Typography, Tag, Spin, Row, Col } from 'antd';
import { FileTextOutlined, TeamOutlined, TagsOutlined, CheckSquareOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useSearchTenders, useSearchVendors, useSearchTickets } from '../services/search.service';

const { Text } = Typography;

interface SearchResultsProps {
  searchTerm: string;
  onTenderSelect?: (tenderId: string) => void;
  onVendorSelect?: (vendorId: string) => void;
  onTicketSelect?: (ticketId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm, onTenderSelect, onVendorSelect, onTicketSelect }) => {
  const { tenders, loading: tendersLoading } = useSearchTenders(searchTerm);
  const { vendors, loading: vendorsLoading } = useSearchVendors(searchTerm);
  const { tickets, loading: ticketsLoading } = useSearchTickets(searchTerm);

  const isLoading = tendersLoading || vendorsLoading || ticketsLoading;

  // Debug logging
  console.debug('[SearchResults] Render:', { searchTerm: searchTerm?.substring(0, 20), tendersCount: tenders.length, vendorsCount: vendors.length });

  if (!searchTerm || searchTerm.length < 2) {
    return (
      <Card style={{ padding: 32, textAlign: 'center' }}>
        <Text type="secondary">Enter at least 2 characters to search</Text>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
        <Spin />
      </Card>
    );
  }

  if (tenders.length === 0 && vendors.length === 0 && tickets.length === 0) {
    return (
      <Card>
        <Empty description={`No results found for "${searchTerm}"`} />
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── Tenders Section ─────────────────────────────────────────────────── */}
      {tenders.length > 0 && (
        <Card
          title={
            <Space>
              <FileTextOutlined />
              <Text strong>Tenders ({tenders.length})</Text>
            </Space>
          }
          style={{ borderRadius: 8 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tenders.map((tender) => (
              <div
                key={tender.id}
                style={{
                  padding: '12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                onClick={() => {
                  console.debug('[SearchResults] Tender clicked:', tender.id, tender.name);
                  onTenderSelect?.(tender.id);
                }}
              >
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <div>
                    <Text strong style={{ fontSize: 13, color: '#1890ff' }}>
                      {tender.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>
                      Ref: {tender.referenceNumber}
                    </Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {tender.issuingDepartment}
                  </Text>
                  <Row gutter={[8, 0]}>
                    <Col>
                      <Tag>{tender.status}</Tag>
                    </Col>
                    {tender.submissionDeadline && (
                      <Col>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Due: {new Date(tender.submissionDeadline).toLocaleDateString()}
                        </Text>
                      </Col>
                    )}
                    {(tender as any).documents?.length > 0 && (
                      <Col>
                        <Tag icon={<PaperClipOutlined />} style={{ fontSize: 10 }}>
                          {(tender as any).documents.length} doc{(tender as any).documents.length > 1 ? 's' : ''}
                        </Tag>
                      </Col>
                    )}
                  </Row>
                </Space>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Vendors Section ─────────────────────────────────────────────────── */}
      {vendors.length > 0 && (
        <Card
          title={
            <Space>
              <TeamOutlined />
              <Text strong>Vendors ({vendors.length})</Text>
            </Space>
          }
          style={{ borderRadius: 8 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                style={{
                  padding: '12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                onClick={() => {
                  console.debug('[SearchResults] Vendor clicked:', vendor.id, vendor.name);
                  onVendorSelect?.(vendor.id);
                }}
              >
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <div>
                    <Text strong style={{ fontSize: 13, color: '#1890ff' }}>
                      {vendor.name}
                    </Text>
                    <Tag style={{ marginLeft: 8 }} color={vendor.type === 'FINAL' ? 'green' : 'blue'}>
                      {vendor.type}
                    </Tag>
                  </div>
                  {vendor.contactPersons?.[0] && (
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {vendor.contactPersons[0].name} • {vendor.contactPersons[0].email}
                    </Text>
                  )}
                  {vendor.tags && vendor.tags.length > 0 && (
                    <Row gutter={[4, 0]}>
                      {vendor.tags.map((t) => (
                        <Col key={t.id}>
                          <Tag icon={<TagsOutlined />} style={{ fontSize: 10 }}>
                            {t.tag.name}
                          </Tag>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Space>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Tickets Section ─────────────────────────────────────────────────── */}
      {tickets.length > 0 && (
        <Card
          title={
            <Space>
              <CheckSquareOutlined />
              <Text strong>Tickets ({tickets.length})</Text>
            </Space>
          }
          style={{ borderRadius: 8 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                style={{
                  padding: '12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                onClick={() => onTicketSelect?.(ticket.id)}
              >
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text strong style={{ fontSize: 13 }}>{ticket.title}</Text>
                  {ticket.description && (
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {ticket.description.substring(0, 100)}{ticket.description.length > 100 ? '...' : ''}
                    </Text>
                  )}
                  <Row gutter={[8, 0]}>
                    <Col>
                      <Tag color={ticket.priority === 'HIGH' ? 'red' : ticket.priority === 'MEDIUM' ? 'orange' : 'green'}>
                        {ticket.priority}
                      </Tag>
                    </Col>
                    <Col>
                      <Tag>{ticket.status?.replace(/_/g, ' ')}</Tag>
                    </Col>
                  </Row>
                </Space>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchResults;
