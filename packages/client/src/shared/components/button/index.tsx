import { Button as AntButton } from "antd";
import React from "react";

export default function Button({
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) {
  return (
    <AntButton onClick={onClick} disabled={disabled} {...props}>
      {children}
    </AntButton>
  );
}
