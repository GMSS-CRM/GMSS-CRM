import { Avatar as AntAvatar } from 'antd';
import type { AvatarProps as AntAvatarProps } from 'antd';
import styles from './styles.module.css';

interface AvatarProps extends Omit<AntAvatarProps, 'children'> {
  firstName: string;
  lastName?: string;
}

/**
 * Get user initials from first and last name
 */
const getInitials = (firstName: string, lastName?: string): string => {
  if (!lastName) return firstName.charAt(0).toUpperCase();
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Common Avatar component
 * Displays user initials based on first name and last name
 */
export default function Avatar({ firstName, lastName, className, size = 40, ...props }: AvatarProps) {
  // Calculate font size based on avatar size
  const fontSize = typeof size === 'number' ? Math.floor(size * 0.4) : 16;
  
  return (
    <AntAvatar 
      className={`${styles.avatar} ${className || ''}`}
      size={size}
      style={{ fontSize }}
      {...props}
    >
      {getInitials(firstName, lastName)}
    </AntAvatar>
  );
}
