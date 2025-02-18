import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "@/components/Navigation/NavigationBar/NavigationBar";

const MainLayout = () => {
  const location = useLocation();

  const showNav = location.pathname !== "/";

  return (
    <div>
      <Outlet />
      {/* Show NavigationBar only if not on SignInScreen */}
      {showNav && <NavigationBar />}
    </div>
  );
};

export default MainLayout;
