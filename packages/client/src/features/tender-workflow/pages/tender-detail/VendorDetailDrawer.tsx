import React, { useState } from 'react';
import {
  Drawer,
  Tag,
  Select,
  Switch,
  Input,
  InputNumber,
  Button,
  Divider,
  Space,
  Typography,
  Tooltip,
  Row,
  Col,
  Progress,
  message,
} from 'antd';
import { SaveOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { VendorTender, TenderPostAward } from '@gmss/types';
import { useUpdateVendorTenderFollowUp, useMarkVendorAsWinner } from '../../services/tenders.service';
import { calcProgress, INTEREST_STATUS_META } from './vendorFollowUpUtils';
import type { FollowUpDraft } from './vendorFollowUpUtils';
import FileUploadField from '../../components/FileUploadField';

const { Text } = Typography;
const { TextArea } = Input;

function buildDraft(vt: VendorTender): FollowUpDraft {
  return {
    interestStatus: vt.interestStatus ?? 'PENDING',
    notInterestedReason: vt.notInterestedReason ?? '',
    proposalShared: vt.proposalShared ?? false,
    tieUpAgreementObtained: vt.tieUpAgreementObtained ?? false,
    quoteReceived: vt.quoteReceived ?? false,
    quoteUrl: vt.quoteUrl ?? '',
    quotedAmount: vt.quotedAmount ?? null,
    quoteApproved: vt.quoteApproved ?? false,
    companyDocsUploaded: vt.companyDocsUploaded ?? false,
    tenderDocsUploaded: vt.tenderDocsUploaded ?? false,
    emdRequired: vt.emdRequired ?? false,
    emdSource: vt.emdSource ?? null,
    emdAmount: vt.emdAmount ?? null,
    emdPaid: vt.emdPaid ?? false,
    tabulationType: vt.tabulationType ?? null,
    tabulationUploaded: vt.tabulationUploaded ?? false,
    tabulationApproved: vt.tabulationApproved ?? false,
    participationDecisionReason: vt.participationDecisionReason ?? '',
    followUpRemarks: vt.followUpRemarks ?? '',
  };
}

// ─── Options ──────────────────────────────────────────────────────────────────

const INTEREST_OPTIONS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Interested', value: 'INTERESTED' },
  { label: 'Not Interested', value: 'NOT_INTERESTED' },
];

const EMD_SOURCE_OPTIONS = [
  { label: 'NEFT', value: 'NEFT' },
  { label: 'Bank Guarantee (BG)', value: 'BG' },
  { label: 'FDR', value: 'FDR' },
  { label: 'Demand Draft (DD)', value: 'DD' },
];

const TABULATION_TYPE_OPTIONS = [
  { label: 'Financial', value: 'FINANCIAL' },
  { label: 'Technical', value: 'TECHNICAL' },
  { label: 'Both', value: 'BOTH' },
];

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface Props {
  record: VendorTender | null;
  onClose: () => void;
  onSaved: () => void;
  postAwardData?: TenderPostAward | null;
}

const VendorDetailDrawer: React.FC<Props> = ({ record, onClose, onSaved, postAwardData }) => {
  const [draft, setDraft] = useState<FollowUpDraft>(() =>
    record ? buildDraft(record) : buildDraft({} as VendorTender),
  );
  const [isWinner, setIsWinner] = useState(false);
  const [initialWinnerState, setInitialWinnerState] = useState(false);
  const [updateFollowUp, { loading: saving }] = useUpdateVendorTenderFollowUp();
  const [markAsWinner] = useMarkVendorAsWinner();

  // Reset draft when record changes
  React.useEffect(() => {
    if (record) {
      setDraft(buildDraft(record));
      // Initialize isWinner based on whether this vendor is the winner in post-award record
      const isWinnerInPostAward = postAwardData?.winningVendorId === record.id;
      setIsWinner(isWinnerInPostAward);
      setInitialWinnerState(isWinnerInPostAward);
    }
  }, [record, postAwardData?.winningVendorId]);

  if (!record) return null;

  const vendorType = record.vendor?.type ?? record.vendor?.status ?? 'FINAL';
  const { done, total } = calcProgress(draft, vendorType);
  const notInterested = draft.interestStatus === 'NOT_INTERESTED';

  const set = <K extends keyof FollowUpDraft>(key: K, value: FollowUpDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = async () => {
    try {
      // First: Update vendor follow-up
      await updateFollowUp({
        variables: {
          input: {
            id: record.id,
            interestStatus: draft.interestStatus as VendorTender['interestStatus'],
            notInterestedReason: draft.notInterestedReason || undefined,
            proposalShared: draft.proposalShared,
            tieUpAgreementObtained: draft.tieUpAgreementObtained,
            quoteReceived: draft.quoteReceived,
            quoteUrl: draft.quoteUrl || undefined,
            quotedAmount: draft.quotedAmount ?? undefined,
            quoteApproved: draft.quoteApproved,
            companyDocsUploaded: draft.companyDocsUploaded,
            tenderDocsUploaded: draft.tenderDocsUploaded,
            emdRequired: draft.emdRequired,
            emdSource: draft.emdSource as VendorTender['emdSource'] ?? undefined,
            emdAmount: draft.emdAmount ?? undefined,
            emdPaid: draft.emdPaid,
            tabulationType: draft.tabulationType as VendorTender['tabulationType'] ?? undefined,
            tabulationUploaded: draft.tabulationUploaded,
            tabulationApproved: draft.tabulationApproved,
            participationDecisionReason: draft.participationDecisionReason || undefined,
            followUpRemarks: draft.followUpRemarks || undefined,
          },
        },
      });
      message.success('Vendor details saved');

      // Second: If winner status changed, call the winner mutation
      if (isWinner !== initialWinnerState && record.tenderId) {
        try {
          if (isWinner) {
            // Marking as winner
            await markAsWinner({
              variables: { tenderId: record.tenderId, vendorId: record.id },
            });
            message.success('Marked as winner! Post-award tracking enabled');
          }
          // Note: unmarking as winner is not currently supported in backend
        } catch (winnerError) {
          console.error('Failed to update winner status:', winnerError);
          message.error('Vendor saved but failed to update winner status');
        }
      }

      onSaved();
    } catch (error) {
      console.error('Failed to save vendor:', error);
      message.error('Failed to save vendor details');
    }
  };

  const vendorName = record.vendor?.name ?? `Vendor ${record.vendorId}`;
  const primaryContact = record.vendor?.contactPersons?.[0];

  const statusMeta = INTEREST_STATUS_META[draft.interestStatus] ?? INTEREST_STATUS_META['PENDING'];

  return (
    <Drawer
      title={
        <Space>
          <Text strong style={{ fontSize: 15 }}>{vendorName}</Text>
          <Tag color={statusMeta.color}>{statusMeta.label}</Tag>
          <Progress
            type="circle"
            size={32}
            percent={total > 0 ? Math.round((done / total) * 100) : 0}
            format={() => `${done}/${total}`}
            strokeWidth={10}
          />
        </Space>
      }
      open={!!record}
      onClose={onClose}
      width={560}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
              Save
            </Button>
          </Space>
        </div>
      }
    >
      {/* Contact info */}
      {primaryContact && (
        <div style={{ marginBottom: 16, padding: '8px 12px', background: '#fafafa', borderRadius: 6 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {primaryContact.name && <><strong>{primaryContact.name}</strong> · </>}
            {primaryContact.email} · {primaryContact.phoneNumber}
          </Text>
        </div>
      )}

      {/* ── Interest Status ──────────────────────────────────────────────── */}
      <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 12 }}>
        <Col span={10}><Text strong>Interest Status</Text></Col>
        <Col span={14}>
          <Select
            options={INTEREST_OPTIONS}
            value={draft.interestStatus}
            onChange={(v) => set('interestStatus', v)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {notInterested && (
        <Row gutter={[16, 8]} align="top" style={{ marginBottom: 12 }}>
          <Col span={10}><Text strong>Reason for Decline</Text></Col>
          <Col span={14}>
            <TextArea
              rows={2}
              placeholder="Reason for not interested…"
              value={draft.notInterestedReason}
              onChange={(e) => set('notInterestedReason', e.target.value)}
            />
            {(vendorType === 'FINAL' || vendorType === 'INTERESTED') && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Retained with remarks (Final/Interested vendors are not discarded)
              </Text>
            )}
            {vendorType === 'NEW' && (
              <Text type="warning" style={{ fontSize: 12 }}>
                New companies may be discarded after discussion with Nikhil/Nishant Sir
              </Text>
            )}
          </Col>
        </Row>
      )}

      {!notInterested && (
        <>
          <Divider style={{ margin: '12px 0', fontSize: 13 }}>Follow-Up Steps</Divider>

          {vendorType === 'NEW' && (
            <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
              <Col span={14}>
                <Space>
                  <Text>Share GMSS Proposal</Text>
                  <Tooltip title="For New companies — share GMSS proposal before proceeding">
                    <InfoCircleOutlined style={{ color: '#aaa' }} />
                  </Tooltip>
                </Space>
              </Col>
              <Col span={10}>
                <Switch
                  checked={draft.proposalShared}
                  onChange={(v) => set('proposalShared', v)}
                  checkedChildren="Shared"
                  unCheckedChildren="Pending"
                />
              </Col>
            </Row>
          )}

          {(vendorType === 'NEW' || vendorType === 'INTERESTED') && (
            <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
              <Col span={14}>
                <Space>
                  <Text>Tie-Up Agreement</Text>
                  <Tooltip title="Obtain tie-up agreement before uploading quotes">
                    <InfoCircleOutlined style={{ color: '#aaa' }} />
                  </Tooltip>
                </Space>
              </Col>
              <Col span={10}>
                <Switch
                  checked={draft.tieUpAgreementObtained}
                  onChange={(v) => set('tieUpAgreementObtained', v)}
                  checkedChildren="Obtained"
                  unCheckedChildren="Pending"
                />
              </Col>
            </Row>
          )}

          <Divider style={{ margin: '12px 0', fontSize: 13 }}>Quote</Divider>

          <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
            <Col span={14}><Text>Quote Received</Text></Col>
            <Col span={10}>
              <Switch
                checked={draft.quoteReceived}
                onChange={(v) => set('quoteReceived', v)}
                checkedChildren="Yes"
                unCheckedChildren="No"
              />
            </Col>
          </Row>

          {draft.quoteReceived && (
            <>
              <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
                <Col span={14}><Text>Quote File</Text></Col>
                <Col span={10}>
                  <FileUploadField
                    folder="vendor-quotes"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    buttonText="Upload Quote"
                    value={draft.quoteUrl}
                    onChange={(url) => set('quoteUrl', url)}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
                <Col span={14}><Text>Quoted Amount (₹)</Text></Col>
                <Col span={10}>
                  <InputNumber
                    placeholder="0.00"
                    value={draft.quotedAmount}
                    onChange={(v) => set('quotedAmount', v)}
                    style={{ width: '100%' }}
                    formatter={(v) => (v ? `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                    min={0}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
                <Col span={14}>
                  <Text>Quote Approved</Text>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>(Nikhil / Nishant Sir)</Text>
                </Col>
                <Col span={10}>
                  <Switch
                    checked={draft.quoteApproved}
                    onChange={(v) => set('quoteApproved', v)}
                    checkedChildren="Approved"
                    unCheckedChildren="Pending"
                  />
                </Col>
              </Row>
            </>
          )}

          <Divider style={{ margin: '12px 0', fontSize: 13 }}>Documents</Divider>

          <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
            <Col span={14}><Text>Company Docs Uploaded</Text></Col>
            <Col span={10}>
              <Switch
                checked={draft.companyDocsUploaded}
                onChange={(v) => set('companyDocsUploaded', v)}
                checkedChildren="Yes" unCheckedChildren="No"
              />
            </Col>
          </Row>
          <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
            <Col span={14}><Text>Tender Docs Uploaded</Text></Col>
            <Col span={10}>
              <Switch
                checked={draft.tenderDocsUploaded}
                onChange={(v) => set('tenderDocsUploaded', v)}
                checkedChildren="Yes" unCheckedChildren="No"
              />
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0', fontSize: 13 }}>EMD</Divider>

          <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
            <Col span={14}><Text>EMD Required</Text></Col>
            <Col span={10}>
              <Switch
                checked={draft.emdRequired}
                onChange={(v) => set('emdRequired', v)}
                checkedChildren="Yes" unCheckedChildren="No"
              />
            </Col>
          </Row>

          {draft.emdRequired && (
            <>
              <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
                <Col span={14}><Text>EMD Source</Text></Col>
                <Col span={10}>
                  <Select
                    options={EMD_SOURCE_OPTIONS}
                    value={draft.emdSource}
                    onChange={(v) => set('emdSource', v)}
                    style={{ width: '100%' }}
                    placeholder="Select source"
                  />
                </Col>
              </Row>
              <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
                <Col span={14}><Text>EMD Amount (₹)</Text></Col>
                <Col span={10}>
                  <InputNumber
                    placeholder="0.00"
                    value={draft.emdAmount}
                    onChange={(v) => set('emdAmount', v)}
                    style={{ width: '100%' }}
                    formatter={(v) => (v ? `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                    min={0}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
                <Col span={14}><Text>EMD Paid</Text></Col>
                <Col span={10}>
                  <Switch
                    checked={draft.emdPaid}
                    onChange={(v) => set('emdPaid', v)}
                    checkedChildren="Paid" unCheckedChildren="Pending"
                  />
                </Col>
              </Row>
            </>
          )}

          <Divider style={{ margin: '12px 0', fontSize: 13 }}>Tabulations</Divider>

          <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
            <Col span={14}><Text>Tabulation Type</Text></Col>
            <Col span={10}>
              <Select
                options={TABULATION_TYPE_OPTIONS}
                value={draft.tabulationType}
                onChange={(v) => set('tabulationType', v)}
                style={{ width: '100%' }}
                placeholder="Select type"
              />
            </Col>
          </Row>
          <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
            <Col span={14}><Text>Tabulation Uploaded</Text></Col>
            <Col span={10}>
              <Switch
                checked={draft.tabulationUploaded}
                onChange={(v) => set('tabulationUploaded', v)}
                checkedChildren="Yes" unCheckedChildren="No"
              />
            </Col>
          </Row>
          <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
            <Col span={14}>
              <Text>Tabulation Approved</Text>
              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>(Nikhil / Nishant Sir)</Text>
            </Col>
            <Col span={10}>
              <Switch
                checked={draft.tabulationApproved}
                onChange={(v) => set('tabulationApproved', v)}
                checkedChildren="Approved" unCheckedChildren="Pending"
              />
            </Col>
          </Row>
        </>
      )}

      <Divider style={{ margin: '12px 0', fontSize: 13 }}>Winner</Divider>

      <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 12 }}>
        <Col span={14}>
          <Text strong>Mark as Winner</Text>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            This vendor will have post-award progress tracking
          </Text>
        </Col>
        <Col span={10}>
          <Switch
            checked={isWinner}
            onChange={setIsWinner}
            checkedChildren="Winner" unCheckedChildren="Regular"
          />
        </Col>
      </Row>

      <Divider style={{ margin: '12px 0', fontSize: 13 }}>Notes</Divider>

      <Row gutter={[16, 8]} align="top" style={{ marginBottom: 8 }}>
        <Col span={14}><Text>Follow-Up Remarks</Text></Col>
        <Col span={24}>
          <TextArea
            rows={2}
            placeholder="Any remarks…"
            value={draft.followUpRemarks}
            onChange={(e) => set('followUpRemarks', e.target.value)}
          />
        </Col>
      </Row>
      <Row gutter={[16, 8]} align="top" style={{ marginBottom: 8 }}>
        <Col span={14}><Text>Participation Decision Note</Text></Col>
        <Col span={24}>
          <TextArea
            rows={2}
            placeholder="Reason for final participation decision…"
            value={draft.participationDecisionReason}
            onChange={(e) => set('participationDecisionReason', e.target.value)}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default VendorDetailDrawer;
