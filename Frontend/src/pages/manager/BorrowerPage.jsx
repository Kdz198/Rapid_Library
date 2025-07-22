import axios from "axios";
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";

const API_URL = "http://localhost:8080/api/loans";

const BorrowerPage = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách người mượn
  const fetchBorrowers = async () => {
    try {
      const res = await axios.get(API_URL);
      setBorrowers(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách người mượn", err);
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  // Xử lý gửi form (thêm hoặc sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: "", email: "", phone: "" });
      setEditingId(null);
      fetchBorrowers();
    } catch (err) {
      console.error("Lỗi khi lưu người mượn", err);
    }
  };

  const handleEdit = (borrower) => {
    setForm(borrower);
    setEditingId(borrower.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá người mượn này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBorrowers();
      } catch (err) {
        console.error("Lỗi khi xoá người mượn", err);
      }
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container py-4" style={{ backgroundColor: "#f4f9f9", minHeight: "100vh" }}>
        <h2 className="text-center mb-4" style={{ color: "#2c3e50" }}>
          👥 Quản Lý Người Mượn Sách
        </h2>

        {/* Form */}
        <div className="card mb-4" style={{ backgroundColor: "#e9f7ef" }}>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tên người mượn"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Số điện thoại"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-1 d-grid">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Danh sách */}
        <div className="card">
          <div className="card-header" style={{ backgroundColor: "#d0e3f0" }}>
            <strong>📋 Danh sách người mượn</strong>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Điện thoại</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {borrowers.length > 0 ? (
                  borrowers.map((borrower) => (
                    <tr key={borrower.id}>
                      <td>{borrower.id}</td>
                      <td>{borrower.name}</td>
                      <td>{borrower.email}</td>
                      <td>{borrower.phone}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(borrower)}>
                          Sửa
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(borrower.id)}>
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      Không có người mượn nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BorrowerPage;
