import React from "react";
import "./Layout.css"; // Import layout-specific CSS here

export default function Layout({ children }) {
  return (
    <div className="layout-background">
      <div className="layout-content">{children}</div>
    </div>
  );
}
