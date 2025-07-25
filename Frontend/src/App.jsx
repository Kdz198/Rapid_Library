import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import BookPage from "./pages/manager/BookPage";
import BorrowerPage from "./pages/manager/BorrowerPage";
import UserManagement from "./pages/manager/UserManagement";
import OrderPage from "./pages/OrderPage";
import UserLayout from "./pages/UserLayout";
import UserPage from "./pages/UserPage";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* User Routes (protected for logged-in users, no role check) */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute requiredRole={null}>
                            <UserLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={
                            <ProtectedRoute requiredRole={null}>
                                <UserPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="history"
                        element={
                            <ProtectedRoute requiredRole={null}>
                                <HistoryPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute requiredRole={null}>
                            <OrderPage />
                        </ProtectedRoute>
                    }
                />

                {/* Manager Routes (protected for ADMIN only) */}
                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <BookPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/borrowers"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <BorrowerPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/users"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;