import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg px-4 py-3">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-2xl tracking-tight">📚 Thư viện FPT</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav mx-auto gap-4">
            <li className="nav-item">
              <Link className="nav-link text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200" to="/">
                Quản lý sách
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200" to="/borrowers">
                Người mượn
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200" to="/users">
                Quản lý người dùng
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="nav-link text-white fw-semibold btn btn-link hover:text-red-300 transition-colors duration-200"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
