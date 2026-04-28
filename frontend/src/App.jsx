import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Dashboard    from "./pages/Dashboard";
import Alunos       from "./pages/Alunos";
import Planos       from "./pages/Planos";
import Equipe       from "./pages/Equipe";
import Financeiro   from "./pages/Financeiro";
import Acesso       from "./pages/Acesso";
import Equipamentos from "./pages/Equipamentos";
import Relatorios   from "./pages/Relatorios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/"         element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App */}
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/alunos"       element={<Alunos />} />
        <Route path="/planos"       element={<Planos />} />
        <Route path="/equipe"       element={<Equipe />} />
        <Route path="/financeiro"   element={<Financeiro />} />
        <Route path="/acesso"       element={<Acesso />} />
        <Route path="/equipamentos" element={<Equipamentos />} />
        <Route path="/relatorios"   element={<Relatorios />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;