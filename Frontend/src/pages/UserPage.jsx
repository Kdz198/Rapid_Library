import axios from "axios";
import { Eye, EyeOff, User } from "lucide-react"; // Thêm Eye, EyeOff từ lucide-react
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị/ẩn mật khẩu
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Hiển thị mặc định là "***..."
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:8080/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
        });

        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          password: res.data.password || "Null",
        });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // Chỉ gửi mật khẩu nếu người dùng nhập giá trị mới (khác "***...")
      const updatedData = { ...formData };
      if (updatedData.password === formData.password || updatedData.password === "") {
        delete updatedData.password; // Không gửi mật khẩu nếu không thay đổi
      }

      await axios.put(`http://localhost:8080/api/users/${user.email}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });

      setUser({ ...user, ...updatedData });
      setIsEditing(false);
      // Reset password về "***..." sau khi lưu
      setFormData((prev) => ({ ...prev, password: "***..." }));
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật thông tin!");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    // Reset password về "***..." khi hủy hoặc mở form chỉnh sửa
    if (isEditing) {
      setFormData((prev) => ({ ...prev, password: "***..." }));
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  if (!user && !error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full transform transition-all duration-300 mx-auto">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 relative z-10">Hồ Sơ Người Dùng</h2>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center relative z-10 animate-fade-in">{error}</div>}
      {user && (
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="rounded-full bg-indigo-100 p-4 mb-4 shadow-lg">
              <User className="w-16 h-16 text-indigo-600" />
            </div>
            <h4 className="text-3xl font-semibold text-gray-900 mb-4">{user.name || "Không có tên"}</h4>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                  Tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nhập tên của bạn"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Nhập email của bạn"
                />
              </div>
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nhập mật khẩu của bạn"
                />
                <button type="button" className="absolute right-3 top-10 text-gray-600 hover:text-gray-800" onClick={toggleShowPassword}>
                  {showPassword ? <EyeOff className="w-5 h-5 mt-2" /> : <Eye className="w-5 h-5 mt-2" />}
                </button>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={toggleEdit}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Lưu
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-medium">Vai trò:</span> {user.role || "Người dùng"}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-medium">Trạng thái:</span> {user.status || "N/A"}
              </p>
              <button
                className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                onClick={toggleEdit}
              >
                Chỉnh sửa hồ sơ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPage;
