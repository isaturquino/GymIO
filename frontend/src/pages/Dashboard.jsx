import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";

export default function Dashboard() {
  return (
    <div className="app-container">
      <Sidebar />

    </div>
  );
}