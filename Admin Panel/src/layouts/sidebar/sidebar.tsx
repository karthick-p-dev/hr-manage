import React from "react";
import SidebarNav from "./SidebarNav";
// sidebar nav config
import navigation from "./_nav";

const Sidebar = () => (
          <SidebarNav NavItemList={navigation} />
  );

export default Sidebar;
