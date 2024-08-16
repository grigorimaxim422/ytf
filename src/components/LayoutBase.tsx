import React, { useState } from "react";
import { createContext } from "react";

import MenuBar from "./MenuBar";
import Navbar from "./Navbar";

export interface menu {
  collapse: boolean;
  setCollapse: (todo: boolean) => void;
}
export const CollapseContext = createContext<menu | null>(null)

const LayoutBase = ({children}: { children: React.ReactNode }) => {
  const [collapse, setCollapse] = useState<menu['collapse']>(false);

  return (
    <>
      <CollapseContext.Provider value={{collapse, setCollapse}}>
        <Navbar/>
        <MenuBar/>
        <div className={`sidebar-layer lg:hidden ${collapse ? "opened" : "closed"}`}
             onClick={() => {
               setCollapse(!collapse);
             }}>
        </div>
      </CollapseContext.Provider>
      <div className={`mt-16 relative z-10 bg-white dark:bg-black ${collapse ? "lg:ml-20" : "lg:ml-56"}`}>
        {children}
      </div>
    </>
  );
};

export default LayoutBase;
