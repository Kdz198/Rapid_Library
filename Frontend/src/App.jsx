import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import BookPage from "./pages/BookPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<BookPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
