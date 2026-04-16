import React from "react";
import { Navigate } from "react-router-dom";

const AgentRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const agentStr = localStorage.getItem("agent");
  
  if (!token || !agentStr) {
    return <Navigate to="/agent/login" replace />;
  }

  return children;
};

export default AgentRoute;
