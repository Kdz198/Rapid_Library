import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BookPage from "./pages/BookPage";
import BorrowerPage from "./pages/BorrowerPage";
import LoginPage from "./pages/LoginPage";
import UserManagement from "./pages/manager/UserManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<BookPage />} />
        <Route path="/borrowers" element={<BorrowerPage />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
