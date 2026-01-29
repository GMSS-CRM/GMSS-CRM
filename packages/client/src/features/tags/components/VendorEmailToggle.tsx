import { useState } from 'react';
import { Switch } from 'antd';
import styles from '../styles/tags.module.css';

interface VendorEmailToggleProps {
  vendorTagId: string;
  vendorName: string;
  enableMail: boolean;
  onToggle: (vendorTagId: string, vendorName: string, enableMail: boolean) => Promise<boolean>;
}

export default function VendorEmailToggle({
  vendorTagId,
  vendorName,
  enableMail,
  onToggle,
}: VendorEmailToggleProps) {
  const [checked, setChecked] = useState(enableMail);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newValue: boolean) => {
    setLoading(true);
    const success = await onToggle(vendorTagId, vendorName, newValue);
    if (success) {
      setChecked(newValue);
    }
    setLoading(false);
  };

  return (
    <div className={styles.emailToggle}>
      <Switch
        checked={checked}
        onChange={handleChange}
        loading={loading}
        size="small"
      />
      <span className={`${styles.toggleLabel} ${checked ? styles.toggleEnabled : styles.toggleDisabled}`}>
        {checked ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
}
