"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          border: "1px solid #dce8df",
          borderRadius: "14px",
          padding: "12px 16px",
          fontSize: "14px",
          color: "#173a2b",
          background: "#ffffff",
          boxShadow: "0 12px 36px rgba(24, 60, 40, 0.12)",
        },
        success: { iconTheme: { primary: "#19734b", secondary: "#ffffff" } },
        error: { iconTheme: { primary: "#c2413a", secondary: "#ffffff" } },
      }}
    />
  );
}
