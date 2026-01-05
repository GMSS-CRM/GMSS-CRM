import type { TenderStatus, VendorType, MandatoryDocument } from '../types';

/**
 * Format a date to a readable string
 */
export const formatDate = (date?: Date, format: 'short' | 'long' = 'short'): string => {
  if (!date) return '—';
  
  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { month: 'long', day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };
  
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

/**
 * Get color for tender status
 */
export const getStatusColor = (status: TenderStatus): string => {
  const colors: Record<TenderStatus, string> = {
    published: 'success',
    draft: 'default',
    closed: 'error',
  };
  return colors[status] || 'default';
};

/**
 * Get label for tender status
 */
export const getStatusLabel = (status: TenderStatus): string => {
  const labels: Record<TenderStatus, string> = {
    published: 'Published',
    draft: 'Draft',
    closed: 'Closed',
  };
  return labels[status] || status;
};

/**
 * Get label for vendor type
 */
export const getVendorTypeLabel = (type: VendorType): string => {
  const labels: Record<VendorType, string> = {
    oem: 'OEM',
    trader: 'Trader',
    distributor: 'Distributor',
  };
  return labels[type] || type;
};

/**
 * Get label for mandatory document
 */
export const getDocumentLabel = (doc: MandatoryDocument): string => {
  const labels: Record<MandatoryDocument, string> = {
    gst: 'GST Certificate',
    pan: 'PAN Card',
    msme: 'MSME Registration',
  };
  return labels[doc] || doc;
};

/**
 * Format currency value
 */
export const formatCurrency = (value?: number): string => {
  if (!value) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
};
