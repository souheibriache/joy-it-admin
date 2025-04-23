import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/TopBar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
