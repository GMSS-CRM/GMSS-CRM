import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SearchResults from './SearchResults';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onTenderSelect?: (tenderId: string) => void;
  onVendorSelect?: (vendorId: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose, onTenderSelect, onVendorSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleTenderSelect = (tenderId: string) => {
    console.debug('[SearchModal] handleTenderSelect:', tenderId);
    onTenderSelect?.(tenderId);
    handleClose();
  };

  const handleVendorSelect = (vendorId: string) => {
    console.debug('[SearchModal] handleVendorSelect:', vendorId);
    onVendorSelect?.(vendorId);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <Modal
      title="Global Search"
      open={open}
      onCancel={handleClose}
      width={700}
      footer={null}
      styles={{
        body: { padding: '20px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' },
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <Input
          size="large"
          placeholder="Search tenders by number or title... or search vendors by name..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
          allowClear
        />
      </div>

      <SearchResults
        searchTerm={searchTerm}
        onTenderSelect={handleTenderSelect}
        onVendorSelect={handleVendorSelect}
      />
    </Modal>
  );
};

export default SearchModal;
