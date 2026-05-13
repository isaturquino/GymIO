import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
  Mail,
  Phone,
  Briefcase,
  Pencil,
  X,
} from "lucide-react";

import "./Sidebar.css";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/Dashboard",
    icon: <LayoutDashboard size={18} />,
  },

  {
    id: "alunos",
    label: "Alunos",
    path: "/Alunos",
    icon: <Users size={18} />,
  },

  {
    id: "planos",
    label: "Planos",
    path: "/Planos",
    icon: <CreditCard size={18} />,
  },

  {
    id: "equipe",
    label: "Equipe",
    path: "/Equipe",
    icon: <UserCog size={18} />,
  },

  {
    id: "financeiro",
    label: "Financeiro",
    path: "/Financeiro",
    icon: <DollarSign size={18} />,
  },

  {
    id: "acesso",
    label: "Acesso",
    path: "/Acesso",
    icon: <Lock size={18} />,
  },

  {
    id: "equipamentos",
    label: "Equipamentos",
    path: "/Equipamentos",
    icon: <Wrench size={18} />,
  },

  {
    id: "relatorios",
    label: "Relatórios",
    path: "/Relatorios",
    icon: <FileText size={18} />,
  },
];

export default function Sidebar() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [modalPerfilAberto, setModalPerfilAberto] =
    useState(false);

  const isActive = (path) =>
    location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <aside className="gymio-sidebar">

        <div className="gymio-sidebar__brand">

          <div className="gymio-sidebar__brand-icon">
            G
          </div>

          <div>
            <div className="gymio-sidebar__brand-name">
              GymIO
            </div>

            <div className="gymio-sidebar__brand-sub">
              Sistema de Gestão
            </div>
          </div>

        </div>

        {/* USUÁRIO */}
        <div
          className="gymio-sidebar__user"
          onClick={() =>
            setModalPerfilAberto(true)
          }
        >

          <div className="gymio-sidebar__avatar">
            {user?.nome
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <div>
            <div className="gymio-sidebar__user-name">
              {user?.nome || "Usuário"}
            </div>

            <div className="gymio-sidebar__user-role">
              {user?.status ||
                "Sem status"}
            </div>
          </div>

        </div>

        <div className="gymio-sidebar__section-label">
          Menu Principal
        </div>

        <nav className="gymio-sidebar__nav">

          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`gymio-sidebar__nav-item${
                isActive(item.path)
                  ? " active"
                  : ""
              }`}
              onClick={() =>
                navigate(item.path)
              }
            >

              {item.icon}

              {item.label}

              {isActive(item.path) && (
                <span className="gymio-sidebar__nav-chevron">
                  <ChevronRight
                    size={14}
                  />
                </span>
              )}

            </div>
          ))}

        </nav>

        <div className="gymio-sidebar__footer">

          <button
            className="gymio-sidebar__logout"
            onClick={handleLogout}
          >

            <LogOut size={16} />

            Sair do Sistema

          </button>

        </div>

      </aside>

      {/* MODAL PERFIL */}
      {modalPerfilAberto && (
        <div className="perfil-overlay">

          <div className="perfil-modal">

            <button
              className="perfil-fechar"
              onClick={() =>
                setModalPerfilAberto(false)
              }
            >
              <X size={22} />
            </button>

            <div className="perfil-topo">

              <div className="perfil-avatar">
                {user?.nome
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <h2>
                {user?.nome || "Usuário"}
              </h2>

              <span>
                {user?.status ||
                  "Sem status"}
              </span>

            </div>

            <div className="perfil-linha"></div>

            <div className="perfil-item">

              <div className="perfil-icone azul">
                <Mail size={18} />
              </div>

              <div>
                <p>Email</p>

                <strong>
                  {user?.email ||
                    "sememail@gmail.com"}
                </strong>
              </div>

            </div>

            <div className="perfil-item">

              <div className="perfil-icone verde">
                <Phone size={18} />
              </div>

              <div>
                <p>Telefone</p>

                <strong>
                  {user?.telefone ||
                    "(44) 99999-9999"}
                </strong>
              </div>

            </div>

            <div className="perfil-item">

              <div className="perfil-icone roxo">
                <Briefcase size={18} />
              </div>

              <div>
                <p>Cargo</p>

                <strong>
                  {user?.cargo ||
                    "Administrador"}
                </strong>
              </div>

            </div>

            <button className="btn-editar">

              <Pencil size={18} />

              Editar Perfil

            </button>

            <button
              className="btn-sair"
              onClick={handleLogout}
            >

              <LogOut size={18} />

              Sair

            </button>

          </div>

        </div>
      )}
    </>
  );
}