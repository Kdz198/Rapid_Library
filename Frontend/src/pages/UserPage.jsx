import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("https://336907d86ab7.ngrok-free.app/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "true",
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("Không thể lấy thông tin người dùng!");
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user && !error) {
    return <div className="text-center mt-5">Đang tải...</div>;
  }

  return (
    <>
      <UserNavbar />
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
          <h2 className="text-center text-primary mb-4">Thông tin người dùng</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {user && (
            <div className="text-center">
              <div className="mb-3">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Avatar"
                  className="rounded-circle mb-3 shadow-sm"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
              <h4 className="fw-bold">{user.name || "Không có tên"}</h4>
              <p className="text-muted mb-2">Email: {user.email}</p>
              <p className="text-muted mb-2">Vai trò: {user.role || "Người dùng"}</p>
              <p className="text-muted mb-4">Ngày tham gia: {new Date(user.createdAt).toLocaleDateString() || "N/A"}</p>
              <button className="btn btn-outline-primary" onClick={() => navigate("/edit-profile")}>
                Chỉnh sửa hồ sơ
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPage;
