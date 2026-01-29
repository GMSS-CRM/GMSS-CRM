// packages/client/src/features/tags/components/TagStatsCards.tsx
import { TagsOutlined, TeamOutlined, MailOutlined } from '@ant-design/icons';
import styles from '../styles/tags.module.css';

interface TagStatsCardsProps {
  totalTags: number;
  totalAssignments: number;
  totalEmailEnabled: number;
  loading?: boolean;
}

export default function TagStatsCards({
  totalTags,
  totalAssignments,
  totalEmailEnabled,
  loading,
}: TagStatsCardsProps) {
  const stats = [
    {
      icon: <TagsOutlined />,
      value: totalTags,
      label: 'Total Tags',
      colorClass: styles.statIconBlue,
    },
    {
      icon: <TeamOutlined />,
      value: totalAssignments,
      label: 'Assigned Vendors',
      colorClass: styles.statIconGreen,
    },
    {
      icon: <MailOutlined />,
      value: totalEmailEnabled,
      label: 'Email Enabled',
      colorClass: styles.statIconPurple,
    },
  ];

  return (
    <div className={styles.statsSection}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={`${styles.statIconWrapper} ${stat.colorClass}`}>
              {stat.icon}
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {loading ? '-' : stat.value.toLocaleString()}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
