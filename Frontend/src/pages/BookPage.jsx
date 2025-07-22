<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const API_URL = 'http://localhost:8080/api/books';

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    author: '',
    yearOfPublisher: '',
    quantity: '',
    available: '',
    status: true
  });
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách sách
  const fetchBooks = async () => {
    try {
      const res = await axios.get(API_URL);
      setBooks(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách sách', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Submit thêm hoặc cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        yearOfPublisher: parseInt(form.yearOfPublisher),
        quantity: parseInt(form.quantity),
        available: parseInt(form.available),
        status: Boolean(form.status)
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      setForm({
        title: '',
        author: '',
        yearOfPublisher: '',
        quantity: '',
        available: '',
        status: true
      });
      setEditingId(null);
      fetchBooks();
    } catch (err) {
      console.error('Lỗi khi lưu sách', err);
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      yearOfPublisher: book.yearOfPublisher,
      quantity: book.quantity,
      available: book.available,
      status: book.status
    });
    setEditingId(book.bookId);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBooks();
      } catch (err) {
        console.error('Lỗi khi xóa sách', err);
      }
    }
  };

  return (
    <>
    <AdminNavbar />
    <div className="container py-4" style={{ backgroundColor: '#f4f9f9', minHeight: '100vh' }}>
      <h2 className="text-center mb-4" style={{ color: '#2c3e50' }}>📚 Quản Lý Sách Thư Viện</h2>

      {/* Form */}
      <div className="card mb-4" style={{ backgroundColor: '#e9f7ef' }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tiêu đề sách"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tác giả"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Năm XB"
                  value={form.yearOfPublisher}
                  onChange={(e) => setForm({ ...form, yearOfPublisher: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Số lượng"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Sẵn có"
                  value={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value === 'true' })}
                >
                  <option value="true">Hiển thị</option>
                  <option value="false">Ẩn</option>
                </select>
              </div>
              <div className="col-md-1 d-grid">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Danh sách sách */}
      <div className="card">
        <div className="card-header" style={{ backgroundColor: '#d0e3f0' }}>
          <strong>📖 Danh sách sách</strong>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Năm XB</th>
                <th>Số lượng</th>
                <th>Sẵn có</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.bookId}>
                    <td>{book.bookId}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.yearOfPublisher}</td>
                    <td>{book.quantity}</td>
                    <td>{book.available}</td>
                    <td>
                      <span className={`badge ${book.status ? 'bg-success' : 'bg-secondary'}`}>
                        {book.status ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(book)}>
                        Sửa
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.bookId)}>
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">Không có sách nào</td>
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

export default BookPage;
=======
>>>>>>> 55c356e263bd4314c7c4746e432b35728f4d5f47
