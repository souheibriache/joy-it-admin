"use client";

import {
  BookOpenText,
  Building2,
  CircleUser,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareMore,
  Settings,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import SideBarItem from "./SideBarItem";
import { useLocation } from "react-router-dom";

const sidebarItems = [
  {
    id: "dashboard",
    text: "Dashboard",
    icon: <LayoutDashboard className="min-h-[20px] min-w-[20px]" />,
  },
  {
    id: "clients",
    text: "Clients",
    icon: <Building2 className="min-h-[20px] min-w-[20px]" />,
  },
  {
    id: "activities",
    text: "Activités",
    icon: <Gamepad2 className="min-h-[20px] min-w-[20px]" />,
  },
  {
    id: "blog",
    text: "Blog",
    icon: <BookOpenText className="min-h-[20px] min-w-[20px]" />,
  },
  {
    id: "Support",
    text: "Support",
    icon: <MessageSquareMore className="min-h-[20px] min-w-[20px]" />,
  },
  {
    id: "settings",
    text: "Parametres",
    icon: <Settings className="min-h-[20px] min-w-[20px]" />,
  },
  {
    id: "account",
    text: "Account",
    icon: <CircleUser className="min-h-[20px] min-w-[20px]" />,
  },
  {
    id: "logout",
    text: "Déconnexion",
    icon: <LogOut className="min-h-[20px] min-w-[20px]" />,
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Set current tab based on location
  useEffect(() => {
    const currentPath = location.pathname.split("/")[1] || "dashboard";
    setCurrentTab(currentPath);
  }, [location]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`h-full bg-gradient-to-b from-purple to-purple duration-300 ease-linear flex flex-col text-background overflow-hidden relative z-20 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {isOpen && <h1 className="text-white font-bold text-xl">Joy-IT</h1>}
        <button
          className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <SideBarItem
            key={index}
            id={item.id}
            text={item.text}
            icon={item.icon}
            isOpen={isOpen}
            isActive={currentTab === item.id}
            isLogout={item.id === "logout"}
          />
        ))}
      </div>

      <div className="p-4 border-t border-white/10 mt-auto">
        {isOpen ? (
          <div className="text-xs text-white/60 text-center">
            Joy-IT Admin v1.0.0
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="text-white/60 text-xs">v1</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
