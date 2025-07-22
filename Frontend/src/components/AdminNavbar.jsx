import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm px-4">
      <div className="container-fluid">
        {/* Logo / Tên thư viện */}
        <span className="navbar-brand fw-bold text-primary fs-4">
          📚 Thư viện FPT
        </span>

        {/* Nút toggle cho mobile */}
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

        {/* Navbar chính */}
        <div className="collapse navbar-collapse" id="adminNavbar">
          {/* Link căn giữa */}
          <ul className="navbar-nav mx-auto gap-3">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/">
                Quản lý sách
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/borrowers">
                Người mượn
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/users">
                Quản lí Người dùng
              </Link>
            </li>
          </ul>

          {/* Đăng xuất nằm góc phải */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className="nav-link text-danger fw-semibold"
                to="/login"
                onClick={() => localStorage.clear()}
              >
                Đăng xuất
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
