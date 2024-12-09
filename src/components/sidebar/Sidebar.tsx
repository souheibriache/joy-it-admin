import {
  Building2,
  CalendarCheck,
  CircleUser,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import SideBarItem from "./SideBarItem";

const sidebarItems = [
  {
    id: "dashboard",
    text: "Dashboard",
    icon: <LayoutDashboard className="min-h-[30px] min-w-[30px] " />,
  },

  {
    id: "clients",
    text: "Clients",
    icon: <Building2 className="min-h-[30px] min-w-[30px] " />,
  },
  {
    id: "activities",
    text: "Activités",
    icon: <Gamepad2 className="min-h-[30px] min-w-[30px] " />,
  },

  {
    id: "plans",
    text: "Abonnements",
    icon: <CalendarCheck className="min-h-[30px] min-w-[30px] " />,
  },

  {
    id: "account",
    text: "Account",
    icon: <CircleUser className="min-h-[30px] min-w-[30px] " />,
  },
  {
    id: "logout",
    text: "Dconnexion",
    icon: <LogOut className="min-h-[30px] min-w-[30px] " />,
  },
];

type Props = {};

const Sidebar = ({}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`h-full bg-purple duration-300 ease-linear flex flex-col text-background overflow-hidden`}
      style={{ width: isOpen ? "300px" : "60px" }}
    >
      <button
        className="m-[20px]"
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      <div className="my-6"></div>

      {sidebarItems.map(({ id, text, icon }, index) => (
        <SideBarItem key={index} id={id} text={text} icon={icon} />
      ))}
    </div>
  );
};

export default Sidebar;
