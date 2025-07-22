import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const API_URL_BOOKS = 'http://localhost:8080/api/books';
const API_URL_CATEGORIES = 'http://localhost:8080/api/categories'; 

const BookPage = () => {
  const [categories, setCategories] = useState([]); 
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    author: '',
    yearOfPublisher: '',
    quantity: '',
    Savailable: '', // Sửa lỗi typo: có thể là 'available' thay vì 'Savailable'
    status: true,
    categoryId: ''
  });
  const [editingId, setEditingId] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  // Lấy danh sách sách
  const fetchBooks = async () => {
    try {
      const res = await axios.get(API_URL_BOOKS);
      setBooks(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách sách', err);
    }
  };

  // Lấy danh sách Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL_CATEGORIES);
      setCategories(res.data);
      // Đặt categoryId mặc định nếu có categories và form.categoryId chưa được set
      // Hoặc đặt mặc định là '' để yêu cầu người dùng chọn
      if (res.data.length > 0 && form.categoryId === '') { // Chỉ đặt nếu chưa có giá trị
        setForm(prevForm => ({ ...prevForm, categoryId: res.data[0].categoryId.toString() })); // Đảm bảo là string
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách danh mục:', err);
      // Nếu không lấy được categories, có thể set categories rỗng và alert người dùng
      setCategories([]); 
      alert("Không thể tải danh mục sách. Vui lòng kiểm tra server.");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []); // [] đảm bảo chỉ chạy một lần khi component mount

  // Submit thêm hoặc cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const selectedCategory = categories.find(cat => cat.categoryId.toString() === form.categoryId);

        if (!selectedCategory) {
            alert("Vui lòng chọn một danh mục hợp lệ.");
            return;
        }

        const payload = {
            ...form,
            yearOfPublisher: parseInt(form.yearOfPublisher),
            quantity: parseInt(form.quantity),
            available: parseInt(form.available),
            status: Boolean(form.status),
            category: selectedCategory // Gắn toàn bộ object category vào payload
        };
        
        delete payload.categoryId; // Vẫn xóa categoryId vì backend mong đợi object 'category'

        if (editingId) {
            // Khi cập nhật, thêm bookId vào payload
            payload.bookId = editingId; // Thêm bookId vào payload
            await axios.put(`${API_URL_BOOKS}`, payload); // Sửa URL: không truyền ID vào URL nữa
        } else {
            // Khi tạo mới, bookId trong payload phải là 0 hoặc không có (tùy backend của bạn)
            // Nếu backend của bạn mặc định gán ID khi bookId = 0, thì không cần thêm vào payload khi POST
            // Hoặc có thể thêm explicit: payload.bookId = 0; 
            await axios.post(API_URL_BOOKS, payload);
        }

        // Reset form sau khi submit thành công
        setForm({
            title: '',
            author: '',
            yearOfPublisher: '',
            quantity: '',
            available: '',
            status: true,
            categoryId: categories.length > 0 ? categories[0].categoryId.toString() : '' 
        });
        setEditingId(null);
        fetchBooks(); 
    } catch (err) {
        console.error('Lỗi khi lưu sách', err.response?.data || err.message);
        alert('Lỗi khi lưu sách: ' + (err.response?.data?.message || err.response?.data?.error || err.message));
    }
};

const handleEdit = (book) => {
    setForm({
        title: book.title,
        author: book.author,
        yearOfPublisher: book.yearOfPublisher,
        quantity: book.quantity,
        available: book.available,
        status: book.status,
        categoryId: book.category ? book.category.categoryId.toString() : '' 
    });
    setEditingId(book.bookId); //editingId sẽ chứa book.bookId để sử dụng khi gửi PUT request
};

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      try {
        await axios.delete(`${API_URL_BOOKS}/${id}`);
        fetchBooks();
      } catch (err) {
        console.error('Lỗi khi xóa sách', err);
      }
    }
  };

  // Hàm xử lý tạo Category mới
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!token) {
        alert("Bạn cần đăng nhập để tạo danh mục.");
        return;
    }

    try {
      // API của bạn yêu cầu categoryId là 0 khi tạo mới (như trong ảnh mẫu)
      const payload = {
        categoryId: 0, 
        name: categoryForm.name,
        description: categoryForm.description
      };
      
      const res = await axios.post(API_URL_CATEGORIES, payload, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      alert('Tạo danh mục thành công!');
      console.log('Category mới được tạo:', res.data);
      // Reset form sau khi tạo thành công
      setCategoryForm({
        name: '',
        description: ''
      });
      fetchCategories(); // Tải lại danh sách categories sau khi tạo mới để cập nhật dropdown
    } catch (err) {
      console.error('Lỗi khi tạo danh mục:', err.response?.data || err.message);
      alert('Lỗi khi tạo danh mục: ' + (err.response?.data?.message || 'Vui lòng kiểm tra lại thông tin.'));
    }
  };

  return (
    <>
    <AdminNavbar />
    <div className="container py-4" style={{ backgroundColor: '#f4f9f9', minHeight: '100vh' }}>
      <h2 className="text-center mb-4" style={{ color: '#2c3e50' }}>📚 Quản Lý Sách Thư Viện</h2>

      {/* Form thêm/cập nhật sách */}
      <div className="card mb-4" style={{ backgroundColor: '#e9f7ef' }}>
        <div className="card-body">
          <h4 className="mb-3">Thêm/Cập nhật Sách</h4>
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
              {/* Dropdown chọn Category */}
              <div className="col-md-3">
                <label htmlFor="categorySelect" className="form-label visually-hidden">Loại sách</label>
                <select
                  id="categorySelect"
                  className="form-select"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  required
                >
                  <option value="">Chọn loại sách</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* End Dropdown chọn Category */}
              <div className="col-md-1 d-grid">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

        {/* Form tạo Category mới */}
        <div className="card mb-4" style={{ backgroundColor: '#e9f7ef' }}>
          <div className="card-body">
            <h4 className="mb-3">Tạo Danh mục Sách Mới</h4>
            <form onSubmit={handleCreateCategory}>
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label htmlFor="categoryName" className="form-label">Tên Danh mục</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryName"
                    placeholder="Nhập tên danh mục"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-5">
                  <label htmlFor="categoryDescription" className="form-label">Mô tả</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryDescription"
                    placeholder="Nhập mô tả danh mục"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-2 d-grid">
                  <button type="submit" className="btn btn-success">
                    Tạo Danh mục
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
                <th>Loại sách</th>
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
                    <td>{book.category ? book.category.name : 'N/A'}</td>
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
                  <td colSpan="9" className="text-center text-muted">Không có sách nào</td>
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