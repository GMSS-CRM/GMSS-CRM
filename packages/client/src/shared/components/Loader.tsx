import { Spin } from "antd";
import type { SpinProps } from "antd";

interface LoaderProps {
  size?: SpinProps["size"];
  tip?: string;
  fullScreen?: boolean;
}

export default function Loader({
  size = "large",
  tip,
  fullScreen = true,
}: LoaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: fullScreen ? "100vh" : "100%",
        background: "#f3f4f6",
      }}
    >
      <Spin size={size} tip={tip} />
    </div>
  );
}
