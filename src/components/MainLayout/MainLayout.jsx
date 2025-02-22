import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import TopBar from "@/components/TopBar/TopBar";
import "./MainLayout.css";

const MainLayout = () => {
  const location = useLocation();

  const showNav = location.pathname !== "/";

  return (
    <div>
      <TopBar />
      <div className="main-content">
        <Outlet />
      </div>
      {showNav && <NavigationBar />} {/* Show NavigationBar only if not on SignInScreen */}
    </div>
  );
};

export default MainLayout;
