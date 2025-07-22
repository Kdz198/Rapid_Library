import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookPage from './pages/BookPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookPage />} />
      </Routes>
    </Router>
  );
}

export default App;
