import React from "react";
import { Navigate } from "react-router-dom";

const ShopkeeperRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const shopkeeperStr = localStorage.getItem("shopkeeper");
  
  if (!token || !shopkeeperStr) {
    return <Navigate to="/shop/login" replace />;
  }

  return children;
};

export default ShopkeeperRoute;
