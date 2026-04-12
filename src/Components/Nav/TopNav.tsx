import { NavLink } from "react-router-dom";
import { navItems } from "./navConfig.ts";


export default function TopNav() {
  return (
    <div className="topnav">
      <NavLink to="/" className="logo">PORKALAM.COM</NavLink>

      <div className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} className="nav-item">
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}