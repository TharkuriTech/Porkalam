import { NavLink } from "react-router-dom";
import { navItems } from "./navConfig.ts";

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.path} to={item.path} className="bottom-item">
            <Icon size={22} />
          </NavLink>
        );
      })}
    </div>
  );
}