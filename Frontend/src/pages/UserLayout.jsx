import { Outlet } from "react-router-dom";
import { UserNavbar } from "../components/Navbar";
import UserSidebar from "../components/UserSidebar";

const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      {/* Fixed Sidebar */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-row">
        <UserSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default UserLayout;
