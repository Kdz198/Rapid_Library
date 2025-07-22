import { Link, useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <span className="text-2xl font-bold tracking-tight">📚 Thư viện FPT</span>

        {/* Menu chính */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:bg-green-600 px-4 py-2 rounded-lg transition-all duration-200 font-semibold">
            Thông tin cá nhân
          </Link>
          <Link to="/history" className="text-white hover:bg-green-600 px-4 py-2 rounded-lg transition-all duration-200 font-semibold">
            Lịch sử mượn sách
          </Link>
          <Link to="/orders" className="text-white hover:bg-green-600 px-4 py-2 rounded-lg transition-all duration-200 font-semibold">
            Danh sách sách
          </Link>
        </div>

        {/* Đăng xuất */}
        <button onClick={handleLogout} className="text-white hover:text-red-300 font-semibold transition-all duration-200">
          Đăng xuất
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          type="button"
          onClick={() => document.getElementById("mobile-menu").classList.toggle("hidden")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="md:hidden hidden mt-4 space-y-2">
        <Link to="/" className="block text-white hover:bg-green-600 px-4 py-2 rounded-lg transition-all duration-200 font-semibold">
          Thông tin cá nhân
        </Link>
        <Link to="/history" className="text-white hover:bg-green-600 px-4 py-2 rounded-lg transition-all duration-200 font-semibold">
          Lịch sử mượn sách
        </Link>
        <Link to="/orders" className="block text-white hover:bg-green-600 px-4 py-2 rounded-lg transition-all duration-200 font-semibold">
          Danh sách sách
        </Link>
        <button onClick={handleLogout} className="block text-white hover:text-red-300 font-semibold w-full text-left px-4 py-2">
          Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default UserNavbar;
