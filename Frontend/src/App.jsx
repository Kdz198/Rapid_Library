import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
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
        {/* User Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="history"
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <HistoryPage />
            </PrivateRoute>
          }
        />
        {/* Manager Routes */}
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
