type Props = {};
import { UserCircle } from "lucide-react";
import HeaderLogo from "../assets/header-logo.png";
import { useSelector } from "react-redux";

const TopBar = ({}: Props) => {
  const { currentUser } = useSelector((state: any) => state.user);

  return (
    <div className="h-[60px] w-full bg-gray-200 flex justify-between items-center px-10">
      <img src={HeaderLogo} className="h-1/2" />
      <div className="flex flex-row items-center gap-2 text- text-xl cursor-pointer">
        <p className="text-gray-800">
          Bonjour <span className="font-semibold">{currentUser?.userName}</span>
        </p>

        <UserCircle />
      </div>
    </div>
  );
};

export default TopBar;
