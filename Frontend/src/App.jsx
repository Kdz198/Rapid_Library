import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import BookPage from "./pages/manager/BookPage";
import BorrowerPage from "./pages/manager/BorrowerPage";
import UserManagement from "./pages/manager/UserManagement";
import OrderPage from "./pages/OrderPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <PrivateRoute>
              <BookPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/borrowers"
          element={
            <PrivateRoute>
              <BorrowerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/users"
          element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
