import { useContext } from "react";

import {CollapseContext, menu} from "../LayoutBase";
import {useTranslation} from "react-i18next";

const MenuItem = ({ icon, title, selected }:{ icon:any, title:string, selected?:boolean }) => {
  const {collapse} = useContext(CollapseContext) as menu;
const { t } = useTranslation();
  return (
    <div
      className={`flex  items-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer 
      ${selected && "bg-neutral-100 dark:bg-neutral-700"}
      ${collapse ? `lg:h-20 h-10 lg:flex-col lg:justify-center lg:w-16 px-2` : `px-2 h-10 w-52`}`}
    >
      <div className="px-1">{icon}</div>
      <span
        className={`${selected ? "font-medium" : "font-light"}
        ${collapse ? `text-[10px]` : `ml-4 text-sm`}`}
      >
        {t(title)}
      </span>
    </div>
  );
};

export default MenuItem;
