import { BookOpen, Library, LogOut, Menu, Settings, User, Users } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Modern Button Component with enhanced glassmorphism
const NavButton = ({ to, children, onClick, variant = "primary", isActive = false }) => {
  const baseStyles =
    "relative px-5 py-2 rounded-full font-medium transition-all duration-300 ease-out transform hover:scale-105 backdrop-blur-md border border-white/30 no-underline flex items-center gap-2 text-sm";

  const variants = {
    primary: "text-white hover:text-white hover:bg-white/20 hover:shadow-md hover:shadow-white/30",
    logout: "text-white hover:text-white hover:bg-red-600/30 hover:shadow-md hover:shadow-red-600/40 border-red-400/40",
    user: "text-white hover:text-white hover:bg-teal-500/30 hover:shadow-md hover:shadow-teal-500/30",
  };

  const activeStyles = isActive ? "bg-white/30 text-white shadow-md shadow-white/40" : "";

  return to ? (
    <NavLink
      to={to}
      className={({ isActive }) => `${baseStyles} ${variants[variant]} ${isActive ? activeStyles : ""}`}
      style={{ textDecoration: "none" }}
    >
      {children}
    </NavLink>
  ) : (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
};

// Animated Hamburger Menu with Lucide Menu icon
const HamburgerMenu = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="relative w-6 h-6 flex items-center justify-center transition-all duration-300 hover:scale-110"
    aria-label="Toggle menu"
  >
    <Menu className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
  </button>
);

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={toggleMobileMenu} />}

      <nav className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 shadow-lg shadow-indigo-600/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute top-1/2 -left-4 w-8 h-8 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <NavLink to="/" className="flex items-center space-x-2 group no-underline" style={{ textDecoration: "none" }}>
              <div className="relative">
                <Library className="w-6 h-6 text-white group-hover:animate-pulse" />
                <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-tight text-white group-hover:text-white/90 transition-colors duration-300">
                  Thư viện FPT
                </span>
                <span className="text-xs text-white/80 font-light tracking-wider uppercase">Admin Portal</span>
              </div>
            </NavLink>

            <div className="hidden md:flex items-center space-x-2">
              <NavButton to="/manager">
                <BookOpen className="w-4 h-4" /> Quản lý sách
              </NavButton>
              <NavButton to="/manager/borrowers">
                <Users className="w-4 h-4" /> Người mượn
              </NavButton>
              <NavButton to="/manager/users">
                <Settings className="w-4 h-4" /> Quản lý người dùng
              </NavButton>
              <div className="w-px h-6 bg-white/30 mx-3" />
              <NavButton onClick={handleLogout} variant="logout">
                <LogOut className="w-4 h-4" /> Đăng xuất
              </NavButton>
            </div>

            <div className="md:hidden">
              <HamburgerMenu isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
            </div>
          </div>
        </div>

        <div
          className={`md:hidden fixed top-14 right-0 h-screen w-72 bg-gradient-to-b from-indigo-700/95 to-purple-700/95 backdrop-blur-xl border-l border-white/30 z-50 transform transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col space-y-3 p-6 pt-10">
            <NavButton to="/manager">
              <BookOpen className="w-4 h-4" /> Quản lý sách
            </NavButton>
            <NavButton to="/manager/borrowers">
              <Users className="w-4 h-4" /> Người mượn
            </NavButton>
            <NavButton to="/manager/users">
              <Settings className="w-4 h-4" /> Quản lý người dùng
            </NavButton>
            <div className="h-px bg-white/30 my-3" />
            <NavButton onClick={handleLogout} variant="logout">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </NavButton>
          </div>
        </div>
      </nav>
    </>
  );
};

const UserNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={toggleMobileMenu} />}

      <nav className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 shadow-lg shadow-emerald-600/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-3 right-8 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping" />
          <div className="absolute bottom-4 left-16 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between h-14">
            <NavLink to="/" className="flex items-center space-x-2 group no-underline" style={{ textDecoration: "none" }}>
              <div className="relative">
                <Library className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-tight text-white group-hover:scale-105 transition-transform duration-300">
                  Thư viện FPT
                </span>
                <span className="text-xs text-white/80 font-light tracking-wider uppercase">Student Portal</span>
              </div>
            </NavLink>

            <div className="hidden md:flex items-center space-x-2">
              <NavButton to="/" variant="user">
                <User className="w-4 h-4" /> Thông tin cá nhân
              </NavButton>
              <NavButton to="/orders" variant="user">
                <BookOpen className="w-4 h-4" /> Danh sách sách
              </NavButton>
              <div className="w-px h-6 bg-white/30 mx-3" />
              <NavButton onClick={handleLogout} variant="logout">
                <LogOut className="w-4 h-4" /> Đăng xuất
              </NavButton>
            </div>

            <div className="md:hidden">
              <HamburgerMenu isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
            </div>
          </div>
        </div>

        <div
          className={`md:hidden fixed top-14 right-0 h-screen w-72 bg-gradient-to-b from-emerald-600/95 to-teal-600/95 backdrop-blur-xl border-l border-white/30 z-50 transform transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col space-y-3 p-6 pt-10">
            <NavButton to="/" variant="user">
              <User className="w-4 h-4" /> Thông tin cá nhân
            </NavButton>
            <NavButton to="/orders" variant="user">
              <BookOpen className="w-4 h-4" /> Danh sách sách
            </NavButton>
            <div className="h-px bg-white/30 my-3" />
            <NavButton onClick={handleLogout} variant="logout">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </NavButton>
          </div>
        </div>
      </nav>
    </>
  );
};

export { AdminNavbar, UserNavbar };
