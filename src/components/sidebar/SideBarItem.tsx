import { resetAuth } from "@/redux/auth/auth-slice";
import { resetUser } from "@/redux/auth/user-slice";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  id: string;
  text: string;
  icon: ReactNode;
};

const SideBarItem = ({ id, text, icon }: Props) => {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const currentTab = location.pathname.split("/")[1] || "dashboard";
    setCurrentTab(currentTab);
  }, [location]);

  const handleSideBarItemClick = () => {
    if (id === "logout") {
      dispatch(resetAuth());
      dispatch(resetUser());
      window.location.pathname = "/login";
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
      className={`flex select-none flex-row items-center gap-[15px] w-full overflow-hidden pl-[15px] py-3 rounded duration-200 hover:bg-opacity-10 cursor-pointer ${
        id === "logout" ? "mt-auto" : ""
      } ${
        currentTab === id
          ? "bg-secondarypurple text-white hover:bg-opacity-90"
          : "hover:bg-purple bg-opacity-10"
      }`}
    >
      {icon}
      <p className="font-semibold">{text}</p>
    </div>
  );
};

export default SideBarItem;
