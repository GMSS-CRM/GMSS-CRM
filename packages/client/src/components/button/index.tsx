import { Button as AntButton, type ButtonProps as AntButtonProps } from "antd";
import './styles.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface CustomButtonProps extends Omit<AntButtonProps, 'type' | 'size' | 'variant'> {
  /**
   * Visual variant of the button
   * - primary: Main action buttons (accent color)
   * - secondary: Secondary actions (outlined)
   * - ghost: Transparent with border
   * - danger: Destructive actions (red)
   * - text: Text-only button
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   * - small: 32px height
   * - medium: 36px height (default)
   * - large: 40px height
   */
  size?: ButtonSize;
}

/**
 * Custom Button Component
 * 
 * Provides consistent button styling across the application with:
 * - Variant-based styling (primary, secondary, ghost, danger, text)
 * - Size system (small, medium, large)
 * - Proper dark mode support (no white box shadows)
 * - Smooth transitions and hover effects
 * - Full TypeScript support
 * 
 * @example
 * <Button variant="primary" size="large">Submit</Button>
 * <Button variant="secondary">Cancel</Button>
 * <Button variant="ghost" icon={<EditOutlined />}>Edit</Button>
 */
export default function Button({
  variant = 'secondary',
  size = 'medium',
  className = '',
  ...props
}: CustomButtonProps) {
  // Map custom variant to Ant Design type
  const getAntType = (): AntButtonProps['type'] => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'danger':
        return 'primary';
      case 'text':
        return 'text';
      case 'ghost':
        return 'default';
      case 'secondary':
      default:
        return 'default';
    }
  };

  // Map custom size to Ant Design size
  const getAntSize = (): AntButtonProps['size'] => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      case 'medium':
      default:
        return 'middle';
    }
  };

  const variantClass = `btn-variant-${variant}`;
  const sizeClass = `btn-size-${size}`;
  const combinedClassName = `custom-button ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <AntButton 
      type={getAntType()} 
      size={getAntSize()}
      className={combinedClassName}
      {...props} 
    />
  );
}
