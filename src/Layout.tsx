import { Outlet } from "react-router-dom";
import TopNav from "./Components/Nav/TopNav.tsx";
import BottomNav from "./Components/Nav/BottomNav.tsx";
import "./Layout.css";
import Footer from "./Components/Footer.tsx";

export default function Layout() {
  return (
    <div className="layout">
      <TopNav />
      <div className="content">
        <Outlet />
      </div>
      <BottomNav />
      <Footer />
    </div>
  );
}