import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCog,
  DollarSign,
  Lock,
  Wrench,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";
import "./Sidebar.css";

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    path: "/Dashboard",    icon: <LayoutDashboard size={18} /> },
  { id: "alunos",       label: "Alunos",       path: "/Alunos",       icon: <Users size={18} /> },
  { id: "planos",       label: "Planos",       path: "/Planos",       icon: <CreditCard size={18} /> },
  { id: "equipe",       label: "Equipe",       path: "/Equipe",       icon: <UserCog size={18} /> },
  { id: "financeiro",   label: "Financeiro",   path: "/Financeiro",   icon: <DollarSign size={18} /> },
  { id: "acesso",       label: "Acesso",       path: "/Acesso",       icon: <Lock size={18} /> },
  { id: "equipamentos", label: "Equipamentos", path: "/Equipamentos", icon: <Wrench size={18} /> },
  { id: "relatorios",   label: "Relatórios",   path: "/Relatorios",   icon: <FileText size={18} /> },
];

export default function Sidebar({
  user = { name: "Ana Costa", role: "Gerente", initials: "AC" },
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // limpe o auth aqui (ex: localStorage.removeItem("token"))
    navigate("/login");
  };

  return (
    <aside className="gymio-sidebar">

      <div className="gymio-sidebar__brand">
        <div className="gymio-sidebar__brand-icon">G</div>
        <div>
          <div className="gymio-sidebar__brand-name">GymIO</div>
          <div className="gymio-sidebar__brand-sub">Sistema de Gestão</div>
        </div>
      </div>

      <div className="gymio-sidebar__user">
        <div className="gymio-sidebar__avatar">{user.initials}</div>
        <div>
          <div className="gymio-sidebar__user-name">{user.name}</div>
          <div className="gymio-sidebar__user-role">{user.role}</div>
        </div>
      </div>

      <div className="gymio-sidebar__section-label">Menu Principal</div>

      <nav className="gymio-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`gymio-sidebar__nav-item${isActive(item.path) ? " active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {item.label}
            {isActive(item.path) && (
              <span className="gymio-sidebar__nav-chevron">
                <ChevronRight size={14} />
              </span>
            )}
          </div>
        ))}
      </nav>

      <div className="gymio-sidebar__footer">
        <button className="gymio-sidebar__logout" onClick={handleLogout}>
          <LogOut size={16} />
          Sair do Sistema
        </button>
      </div>

    </aside>
  );
}