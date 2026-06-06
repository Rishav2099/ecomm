import { SiteNavbar } from "@/components/site-navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SiteNavbar />
      {children}
    </div>
  );
};

export default layout;
