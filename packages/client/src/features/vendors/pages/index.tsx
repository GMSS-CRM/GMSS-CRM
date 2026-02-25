import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import VendorList from './list';
import type { ActiveView } from './list';
import type { Vendor, UserRole, VendorMdRequest } from '../types';
import {
  useSearchVendors,
  useGetPendingMdRequests,
  useGetResolvedMdRequests,
} from '../services/vendors.service';

export default function VendorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [activeView, setActiveView] = useState<ActiveView>('all');

  const isListPage = location.pathname === '/vendors';

  const { vendors, loading: vendorsLoading, refetch: refetchVendors } = useSearchVendors();
  const { requests: pendingRequests, loading: pendingLoading, refetch: refetchPending } = useGetPendingMdRequests();
  const { requests: resolvedRequests, loading: resolvedLoading, refetch: refetchResolved } = useGetResolvedMdRequests();

  const loading = vendorsLoading || pendingLoading || resolvedLoading;

  const handleView = useCallback(
    (vendor: Vendor) => {
      const isPending = activeView === 'pending';
      navigate(`/vendors/${vendor.id}?role=${role}&pending=${isPending}`);
    },
    [navigate, role, activeView]
  );

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
    try {
      await Promise.all([refetchVendors(), refetchPending(), refetchResolved()]);
    } catch (err) {
      message.error('Failed to refresh data');
    }
  }, [refetchVendors, refetchPending, refetchResolved]);

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
