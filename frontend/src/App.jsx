import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Alunos from "./pages/Alunos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/alunos" element={<Alunos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;