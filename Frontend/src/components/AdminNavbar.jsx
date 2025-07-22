import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight">📚</span>
              <span className="text-xl font-semibold">Thư viện FPT</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/manager"
              className="text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out"
            >
              Quản lý sách
            </Link>
            <Link
              to="/manager/borrowers"
              className="text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out"
            >
              Người mượn
            </Link>
            <Link
              to="/manager/users"
              className="text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out"
            >
              Quản lý người dùng
            </Link>
          </div>

          {/* Logout Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="text-white font-medium px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
            >
              Đăng xuất
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
              data-bs-toggle="collapse"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden collapse" id="mobileMenu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-700">
          <Link
            to="/manager"
            className="block text-white font-medium px-3 py-2 rounded-md hover:bg-indigo-500 transition-all duration-300 ease-in-out"
          >
            Quản lý sách
          </Link>
          <Link
            to="/manager/borrowers"
            className="block text-white font-medium px-3 py-2 rounded-md hover:bg-indigo-500 transition-all duration-300 ease-in-out"
          >
            Người mượn
          </Link>
          <Link
            to="/manager/users"
            className="block text-white font-medium px-3 py-2 rounded-md hover:bg-indigo-500 transition-all duration-300 ease-in-out"
          >
            Quản lý người dùng
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left text-white font-medium px-3 py-2 rounded-md hover:bg-red-500 transition-all duration-300 ease-in-out"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
