import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setIsAuthorized(false);
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

                const userRole = res.data.role;
                if (requiredRole === null) {
                    // Cho phép tất cả người dùng đã đăng nhập
                    setIsAuthorized(true);
                } else if (userRole === requiredRole) {
                    // Chỉ cho phép vai trò cụ thể (ví dụ: "ADMIN")
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error("Lỗi kiểm tra quyền:", error);
                setIsAuthorized(false);
            }
        };

        checkAuthorization();
    }, [requiredRole]);

    if (isAuthorized === null) {
        // Hiển thị loading trong khi kiểm tra
        return <div className="flex items-center justify-center h-screen">Đang kiểm tra quyền truy cập...</div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;