import { ChevronRight, Clock, User } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const ModernNavItem = ({ to, icon: Icon, children, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-500 ease-out no-underline overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 scale-105"
            : "text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-102"
        }`
      }
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000`}
      />

      {/* Icon with animation */}
      <div className="relative z-10">
        <Icon className={`w-6 h-6 transition-all duration-300 ${isHovered ? "rotate-12 scale-110" : ""}`} />
      </div>

      {/* Text */}
      <span className="relative z-10 font-medium text-base transition-all duration-300 group-hover:translate-x-1">{children}</span>

      {/* Arrow indicator for active state */}
      <ChevronRight
        className={`w-4 h-4 ml-auto transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0`}
      />
    </NavLink>
  );
};

const UserSidebar = () => {
  return (
    <div className="relative">
      {/* Sidebar Container */}
      <div className="flex flex-col bg-white/95 backdrop-blur-xl shadow-2xl shadow-gray-900/10 rounded-3xl p-8 w-auto min-h-screen md:min-h-0 md:h-fit fixed top-0 left-0 z-50 md:static md:w-80 border border-gray-100/50 mt-6">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-xl" />
        <div className="absolute bottom-10 left-4 w-16 h-16 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-xl" />

        {/* Header Section */}
        <div className="relative mb-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h4 className=" font-bold text-gray-800 mb-1">Quản lý tài khoản</h4>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-3">
          <ModernNavItem to="/" icon={User}>
            Thông tin cá nhân
          </ModernNavItem>

          <ModernNavItem to="/history" icon={Clock}>
            Lịch sử mượn sách
          </ModernNavItem>
        </nav>
      </div>
    </div>
  );
};

export default UserSidebar;
