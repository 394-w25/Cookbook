import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import TopBar from "@/components/TopBar/TopBar";
import ChatbotInputForm from "@/components/ChatbotInputForm/ChatbotInputForm";
import "./MainLayout.css";

const MainLayout = () => {
  const location = useLocation();

  const hideNavScreens = ["/EditRecipe", "/EditRecipeChatbot"];

  const showNav = !hideNavScreens.includes(location.pathname);

  return (
    <div>
      <TopBar />
      <div className="main-content">
        <Outlet />
      </div>
      {showNav ? <NavigationBar /> : <ChatbotInputForm />} {/* Conditionally show ChatbotInputForm */}
    </div>
  );
};

export default MainLayout;
