import { Button as AntButton, type ButtonProps as AntButtonProps } from "antd";

interface CustomButtonProps extends Omit<AntButtonProps, 'type'> {
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
}

/**
 * Custom Button Component
 * Wraps Ant Design Button with consistent styling and props
 */
export default function Button({
  type = 'default',
  ...props
}: CustomButtonProps) {
  return <AntButton type={type} {...props} />;
}
