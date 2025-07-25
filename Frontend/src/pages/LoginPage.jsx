import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    status: "ACTIVE",
    role: "USER",
  });
  const [isRegistering, setIsRegistering] = useState(false); // State để chuyển đổi form
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginRes = await axios.post(
          "http://localhost:8080/api/auth/login",
          null,
          {
            params: {
              email: email,
              password: password,
            },
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
          }
      );

      const token = loginRes.data;
      localStorage.setItem("token", token);
      console.log("Đăng nhập thành công:", token);

      const userRes = await axios.get("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });

      if (userRes.data.role === "ADMIN") {
        navigate("/manager");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
          "http://localhost:8080/api/users/register",
          {
            email: registerData.email,
            password: registerData.password,
            name: registerData.name,
            status: registerData.status,
            role: registerData.role,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "ngrok-skip-browser-warning": "true",
            },
          }
      );

      setError("Đăng ký thành công! Vui lòng đăng nhập.");
      setRegisterData({ email: "", password: "", name: "", status: "ACTIVE", role: "USER" });
      setIsRegistering(false); // Quay lại form đăng nhập sau khi đăng ký thành công
    } catch (err) {
      console.error(err);
      setError("Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card p-4 shadow-sm" style={{ width: "100%", maxWidth: 400 }}>
          <h3 className="mb-4 text-center text-primary">
            {isRegistering ? "Đăng ký tài khoản 📝" : "Đăng nhập hệ thống 📚"}
          </h3>

          {error && <div className="alert alert-danger">{error}</div>}

          {!isRegistering ? (
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                      type="text"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Đăng nhập
                </button>
                <button
                    type="button"
                    className="btn btn-link w-100 text-primary"
                    onClick={() => setIsRegistering(true)}
                >
                  Đăng ký tài khoản
                </button>
              </form>
          ) : (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                      type="text"
                      name="email"
                      className="form-control"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="email@example.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Mật khẩu"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      placeholder="Nhập tên của bạn"
                  />
                </div>
                <input
                    type="hidden"
                    name="status"
                    value={registerData.status}
                />
                <input
                    type="hidden"
                    name="role"
                    value={registerData.role}
                />
                <button type="submit" className="btn btn-success w-100 mb-3">
                  Đăng ký
                </button>
                <button
                    type="button"
                    className="btn btn-link w-100 text-primary"
                    onClick={() => setIsRegistering(false)}
                >
                  Quay lại đăng nhập
                </button>
              </form>
          )}
        </div>
      </div>
  );
};

export default LoginPage;