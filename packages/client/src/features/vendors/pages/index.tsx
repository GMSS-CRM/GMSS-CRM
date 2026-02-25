import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import VendorList from './list';
import type { ActiveView } from './list';
import type { Vendor, UserRole, VendorMdRequest } from '../types';
import {
  fetchVendors,
  fetchPendingMdRequests,
  fetchResolvedMdRequests,
} from '../services/vendors.service';

export default function VendorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [pendingRequests, setPendingRequests] = useState<VendorMdRequest[]>([]);
  const [resolvedRequests, setResolvedRequests] = useState<VendorMdRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [activeView, setActiveView] = useState<ActiveView>('all');

  const isListPage = location.pathname === '/vendors';

  useEffect(() => {
    if (!isListPage) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const [vendorData, pendingData, resolvedData] = await Promise.all([
          fetchVendors(),
          fetchPendingMdRequests(),
          fetchResolvedMdRequests(),
        ]);
        setVendors(vendorData);
        setPendingRequests(pendingData);
        setResolvedRequests(resolvedData);
      } catch (error) {
        message.error('Failed to load vendors');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isListPage]);

  const handleView = useCallback(
    (vendor: Vendor) => {
      // Employee in pending view → form opens read-only; MD in pending view → can edit + resolve
      const isPending = activeView === 'pending';
      navigate(`/vendors/${vendor.id}?role=${role}&pending=${isPending}`);
    },
    [navigate, role, activeView]
  );

  // Navigate to vendor form from a request row
  const handleViewRequest = useCallback(
    (request: VendorMdRequest, view: 'pending' | 'resolved') => {
      const isPending = view === 'pending';
      navigate(`/vendors/${request.vendorId}?role=${role}&pending=${isPending}`);
    },
    [navigate, role]
  );

  const handleCreate = useCallback(() => {
    navigate(`/vendors/create?role=${role}`);
  }, [navigate, role]);

  const refreshData = useCallback(async () => {
    const [vendorData, pendingData, resolvedData] = await Promise.all([
      fetchVendors(),
      fetchPendingMdRequests(),
      fetchResolvedMdRequests(),
    ]);
    setVendors(vendorData);
    setPendingRequests(pendingData);
    setResolvedRequests(resolvedData);
  }, []);

  const handleRoleChange = useCallback((newRole: UserRole) => {
    setRole(newRole);
    setActiveView('all');
  }, []);

  const handleViewChange = useCallback((v: ActiveView) => {
    setActiveView(v);
  }, []);

  if (isListPage) {
    return (
      <VendorList
        vendors={vendors}
        pendingRequests={pendingRequests}
        resolvedRequests={resolvedRequests}
        onView={handleView}
        onViewRequest={handleViewRequest}
        onCreate={handleCreate}
        loading={loading}
        role={role}
        onRoleChange={handleRoleChange}
        activeView={activeView}
        onViewChange={handleViewChange}
        onRefresh={refreshData}
      />
    );
  }

  return null;
}
