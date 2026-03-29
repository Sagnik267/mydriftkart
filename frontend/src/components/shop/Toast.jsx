import React, { useState, useEffect } from "react";
import "./Components.css";

// This is a simple controlled toast, but if we need a global one we can use Context or a simple portal.
export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`shop-toast ${type}`}>
      {message}
    </div>
  );
}
