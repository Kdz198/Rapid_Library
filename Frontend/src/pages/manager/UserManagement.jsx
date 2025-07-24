import axios from "axios";
import { useEffect, useState } from "react";
import { AdminNavbar } from "../../components/Navbar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    status: "",
    role: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
          .get("http://localhost:8080/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (Array.isArray(res.data)) {
              setUsers(res.data);
            } else {
              setUsers([]);
            }
          })
          .catch((err) => console.error("Lỗi tải người dùng:", err));
    } else {
      console.error("Không tìm thấy token.");
    }
  }, []);

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      status: user.status,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleDelete = (email) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token.");
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng với email: ${email} không?`)) {
      axios
          .delete(`http://localhost:8080/api/users/${email}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.status === 200) {
              alert("Người dùng đã được xóa thành công!");
              setUsers(users.filter((user) => user.email !== email));
            } else {
              alert("Có lỗi xảy ra khi xóa người dùng.");
            }
          })
          .catch((err) => {
            console.error("Lỗi khi xóa người dùng:", err);
            alert("Có lỗi xảy ra khi xóa người dùng: " + (err.response?.data || err.message));
          });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({ email: "", name: "", status: "", role: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token.");
      return;
    }

    axios
        .put(`http://localhost:8080/api/users/${formData.email}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status === 200) {
            alert("Cập nhật người dùng thành công!");
            setUsers(users.map((user) => (user.email === formData.email ? res.data : user)));
            handleModalClose();
          } else {
            alert("Có lỗi xảy ra khi cập nhật người dùng.");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi cập nhật người dùng:", err);
          alert("Có lỗi xảy ra khi cập nhật người dùng: " + (err.response?.data || err.message));
        });
  };

  const renderUserRows = () => {
    if (users.length === 0) {
      return (
          <tr>
            <td colSpan="6" className="text-center text-muted">
              Không có người dùng nào.
            </td>
          </tr>
      );
    }

    return users.map((user, index) => (
        <tr key={index}>
          <td>{user.email}</td>
          <td>{user.name}</td>
          <td>{"*".repeat(8)}</td>
          <td>{user.status}</td>
          <td>{user.role}</td>
          <td className="text-center">
            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleUpdate(user)}>
              Cập nhật
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.email)}>
              Xóa
            </button>
          </td>
        </tr>
    ));
  };

  return (
      <>
        <AdminNavbar />
        <div className="container mt-4">
          <h2 className="mb-4 text-primary fw-bold">Quản lý người dùng</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover shadow-sm">
              <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Họ tên</th>
                <th>Mật khẩu</th>
                <th>Trạng thái</th>
                <th>Vai trò</th>
                <th className="text-center">Hành động</th>
              </tr>
              </thead>
              <tbody>{renderUserRows()}</tbody>
            </table>
          </div>
        </div>

        {/* Modal for Update */}
        {showModal && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Cập nhật người dùng</h5>
                    <button type="button" className="btn-close" onClick={handleModalClose}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Họ tên</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Trạng thái</label>
                        <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                        >
                          <option value="ACTIVE">Hoạt động</option>
                          <option value="INACTIVE">Không hoạt động</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Vai trò</label>
                        <select
                            className="form-select"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        >
                          <option value="USER">Người dùng</option>
                          <option value="ADMIN">Quản trị viên</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Lưu thay đổi
                      </button>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default UserManagement;