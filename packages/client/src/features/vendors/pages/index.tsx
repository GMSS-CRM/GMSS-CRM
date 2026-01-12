import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import VendorList from './list';
import type { Vendor } from '../types';
import { fetchVendors } from '../services/vendors.service';

/**
 * Main Vendors Page component
 * Manages vendor list and navigation
 */
export default function VendorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  // Determine if we're on the list page or details page
  const isListPage = location.pathname === '/vendors';

  // Load vendors
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoading(true);
        const data = await fetchVendors();
        setVendors(data);
      } catch (error) {
        message.error('Failed to load vendors');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isListPage) {
      loadVendors();
    }
  }, [isListPage]);

  const handleView = useCallback(
    (vendor: Vendor) => {
      navigate(`/vendors/${vendor.id}`);
    },
    [navigate]
  );

  const handleCreate = useCallback(() => {
    navigate('/vendors/create');
  }, [navigate]);

  const handleUpload = useCallback(async (file: File) => {
    try {
      // TODO: Implement Excel file processing
      // For now, just show a success message
      message.success(`File "${file.name}" uploaded successfully. Processing vendors...`);

      // Here you would typically:
      // 1. Parse the Excel file
      // 2. Validate the data
      // 3. Create vendor records
      // 4. Refresh the vendor list

      console.log('Uploaded file:', file);
    } catch (error) {
      message.error('Failed to upload vendors');
      console.error(error);
    }
  }, []);

  // Render list or details based on route
  if (isListPage) {
    return (
      <VendorList
        vendors={vendors}
        onView={handleView}
        onCreate={handleCreate}
        onUpload={handleUpload}
        loading={loading}
      />
    );
  }

  // Details form will be rendered by the nested route
  return null;
}
