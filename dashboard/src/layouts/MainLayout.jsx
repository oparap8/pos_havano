import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"

const MainLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* <Header className="shrink-0" />   */}

      <div className="flex-1 overflow-y-auto bg-secondary-background py-4 scrollbar-hide">
        <Outlet />
      </div>

      <Footer className="shrink-0" />
    </div>
  );
}

export default MainLayout