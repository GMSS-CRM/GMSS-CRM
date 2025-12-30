import { Input as AntInput } from "antd";
import React from "react";
import type { InputProps } from "antd";

export default function Input(
  props: InputProps & React.InputHTMLAttributes<HTMLInputElement>
) {
  return <AntInput {...props} />;
}
