import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import TenderListComponent from './list';
import type { Tender } from '../types';
import { tendersService } from '../services/tenders.service';

export default function TendersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(false);

  const isListPage = location.pathname === '/tenders';

  useEffect(() => {
    if (!isListPage) return;

    const loadTenders = async () => {
      try {
        setLoading(true);
        const data = await tendersService.getAllTenders();
        setTenders(data);
      } catch (error) {
        message.error('Failed to load tenders');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTenders();
  }, [isListPage]);

  const handleView = (tender: Tender) => {
    navigate(`/tenders/${tender.id}`);
  };

  const handleCreate = () => {
    navigate('/tenders/create');
  };

  if (!isListPage) return null;

  return (
    <TenderListComponent
      tenders={tenders}
      onView={handleView}
      onCreate={handleCreate}
      loading={loading}
    />
  );
}
