<<<<<<< HEAD
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookPage from './pages/BookPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import UserManagement from './pages/UserManagement';

=======
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import BookPage from "./pages/manager/BookPage";
import BorrowerPage from "./pages/manager/BorrowerPage";
import UserManagement from "./pages/manager/UserManagement";
>>>>>>> 1f5815c16160a86ea1b0c5d9ee4009b83b4d963c

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
        <Route path="/" element={    
          <PrivateRoute>
            <BookPage />
          </PrivateRoute>} />
          <Route path="/users" element={<UserManagement />} />
=======

        <Route
          path="/manager/books"
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
>>>>>>> 1f5815c16160a86ea1b0c5d9ee4009b83b4d963c
      </Routes>
    </Router>
  );
}

export default App;
