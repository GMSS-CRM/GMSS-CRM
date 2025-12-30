import { ConfigProvider } from "antd";
import AppRoutes from "./app/routes/AppRoutes";
import antdTheme from "./app/config/antd-theme";

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AppRoutes />
    </ConfigProvider>
  );
}
