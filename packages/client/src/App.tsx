import { ConfigProvider } from "antd";
import AppRoutes from "./app/routes/AppRoutes";
import antdTheme from "./app/config/antd-theme";
import MobileBlocker from "./components/MobileBlocker";

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <MobileBlocker>
        <AppRoutes />
      </MobileBlocker>
    </ConfigProvider>
  );
}
