import React from 'react';
import { Alert, Tag, Typography, Divider } from 'antd';
import type { VendorTender } from '@gmss/types';
import type { TenderPostAward } from '@gmss/types';

const { Text, Paragraph } = Typography;

interface PostAwardDebugProps {
  tenderId: string;
  selectedVendor: VendorTender | null;
  postAwardData: TenderPostAward | null | undefined;
  postAwardLoading: boolean;
}

/**
 * Debug component to understand post-award flow
 * Shows what's being queried and why records might not appear
 */
const PostAwardDebug: React.FC<PostAwardDebugProps> = ({
  tenderId,
  selectedVendor,
  postAwardData,
  postAwardLoading,
}) => {
  const graphqlQuery = `
query GetTenderPostAward {
  getTenderPostAward(
    tenderId: "${tenderId}"
    vendorId: "${selectedVendor?.id ?? 'NOT_SELECTED'}"
  ) {
    id
    tenderId
    currentStage
    winningVendorId
    createdDate
  }
}
  `.trim();

  return (
    <details style={{ margin: '16px 0', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
        🔍 Post-Award Debug Info
      </summary>

      <div style={{ marginTop: '12px', background: '#fff', padding: '12px', borderRadius: '4px' }}>
        <Paragraph>
          <strong>Tender ID:</strong> <Typography.Text code>{tenderId}</Typography.Text>
        </Paragraph>

        <Divider style={{ margin: '8px 0' }} />

        <Paragraph>
          <strong>Selected Vendor:</strong>
          {selectedVendor ? (
            <div style={{ marginTop: '4px' }}>
              <Tag color="blue">{selectedVendor.vendor?.name || `Vendor ${selectedVendor.vendorId}`}</Tag>
              <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                ID: {selectedVendor.id}
              </Text>
            </div>
          ) : (
            <Tag>None selected (click a vendor in the table)</Tag>
          )}
        </Paragraph>

        <Divider style={{ margin: '8px 0' }} />

        <Paragraph>
          <strong>Post-Award Record Query:</strong>
          <div style={{ marginTop: '4px', background: '#f9f9f9', padding: '8px', borderRadius: '3px', fontSize: '11px', fontFamily: 'monospace', overflow: 'auto', maxHeight: '120px' }}>
            {graphqlQuery}
          </div>
        </Paragraph>

        <Divider style={{ margin: '8px 0' }} />

        <Paragraph>
          <strong>Query Status:</strong>
          {postAwardLoading ? (
            <Tag color="processing">Loading...</Tag>
          ) : postAwardData ? (
            <div style={{ marginTop: '4px' }}>
              <Tag color="success">Record Found ✓</Tag>
              <Text type="secondary" style={{ display: 'block', marginTop: '4px', fontSize: '12px' }}>
                Stage: {postAwardData.currentStage}
                <br />
                Winning Vendor: {postAwardData.winningVendorId || 'NOT SET'}
              </Text>
            </div>
          ) : (
            <div style={{ marginTop: '4px' }}>
              <Tag color="error">No Record ✗</Tag>
              <Text type="secondary" style={{ display: 'block', marginTop: '4px', fontSize: '12px' }}>
                Post-award tracking not available for this tender/vendor combination.
                <br />
                <strong>Why?</strong>
                <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                  <li>Post-award record may not be created yet</li>
                  <li>winningVendorId may not match selected vendor</li>
                  <li>Vendor might not have participated in this tender</li>
                </ul>
              </Text>
            </div>
          )}
        </Paragraph>

        <Divider style={{ margin: '8px 0' }} />

        <Alert
          type="info"
          showIcon
          message="Testing Steps"
          description={
            <ol style={{ margin: '8px 0', paddingLeft: '16px' }}>
              <li>
                Open <strong>DevTools → Network</strong> and filter by GraphQL
              </li>
              <li>
                Click a vendor in the <strong>Vendor Responses</strong> table above
              </li>
              <li>
                Find the <Typography.Text code>GetTenderPostAward</Typography.Text> request and check the response
              </li>
              <li>
                If response is <Typography.Text code>null</Typography.Text>, the post-award record doesn't exist or vendorId doesn't match
              </li>
              <li>
                Check backend database: does <Typography.Text code>tender_post_award</Typography.Text> table have a record for this tender with <Typography.Text code>winningVendorId</Typography.Text> set?
              </li>
            </ol>
          }
          style={{ fontSize: '12px' }}
        />
      </div>
    </details>
  );
};

export default PostAwardDebug;
