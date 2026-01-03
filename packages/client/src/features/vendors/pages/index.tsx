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

  // Render list or details based on route
  if (isListPage) {
    return (
      <VendorList
        vendors={vendors}
        onView={handleView}
        onCreate={handleCreate}
        loading={loading}
      />
    );
  }

  // Details form will be rendered by the nested route
  return null;
}
