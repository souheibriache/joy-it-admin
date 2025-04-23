"use client";

import { resetAuth } from "@/redux/auth/auth-slice";
import { resetUser } from "@/redux/auth/user-slice";
import type { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
  text: string;
  icon: ReactNode;
  isOpen: boolean;
  isActive: boolean;
  isLogout?: boolean;
};

const SideBarItem = ({
  id,
  text,
  icon,
  isOpen,
  isActive,
  isLogout = false,
}: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSideBarItemClick = () => {
    if (id === "logout") {
      dispatch(resetAuth());
      dispatch(resetUser());
      window.location.pathname = "/login";
      return;
    }

    if (id === "dashboard") {
      navigate("/");
      return;
    }

    navigate(id);
  };

  return (
    <div
      id={id}
      onClick={handleSideBarItemClick}
      className={`
        flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-md cursor-pointer transition-all
        ${
          isActive
            ? "bg-white/20 text-white"
            : "text-white/80 hover:bg-white/10"
        }
        ${isLogout ? "mt-auto text-red-200 hover:text-red-100" : ""}
      `}
    >
      <div className="flex-shrink-0">{icon}</div>
      {isOpen && <span className="font-medium truncate">{text}</span>}
    </div>
  );
};

export default SideBarItem;
