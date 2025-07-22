import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookPage from './pages/BookPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={    
          <PrivateRoute>
            <BookPage />
          </PrivateRoute>} />
          <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
