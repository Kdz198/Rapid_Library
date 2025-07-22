import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookPage from './pages/BookPage';
<<<<<<< HEAD
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import UserManagement from './pages/UserManagement';
=======
>>>>>>> 55c356e263bd4314c7c4746e432b35728f4d5f47

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={    
          <PrivateRoute>
            <BookPage />
          </PrivateRoute>} />
          <Route path="/users" element={<UserManagement />} />
=======
        <Route path="/" element={<BookPage />} />
>>>>>>> 55c356e263bd4314c7c4746e432b35728f4d5f47
      </Routes>
    </Router>
  );
}

export default App;
