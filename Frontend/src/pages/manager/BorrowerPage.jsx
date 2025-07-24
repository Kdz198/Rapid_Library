import axios from "axios";
import { useEffect, useState } from "react";
import { AdminNavbar } from "../../components/Navbar";
import { Book, ChevronDown, ChevronUp, RefreshCw, Search, Calendar } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const API_URL = "http://localhost:8080/api/loans";

const BorrowerPage = () => {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedLoan, setExpandedLoan] = useState(null);
  const [isReturning, setIsReturning] = useState(null);

  // Lấy danh sách sách và lịch sử mượn
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Lấy danh sách sách
        const booksResponse = await axios.get("http://localhost:8080/api/books", {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "true",
          },
        });
        setBooks(booksResponse.data);

        // Lấy danh sách lịch sử mượn
        const loansResponse = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "true",
          },
        });
        setLoans(loansResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể lấy dữ liệu. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lấy tiêu đề sách
  const getBookTitles = (bookIds) => {
    return Object.keys(bookIds)
        .map((bookId) => {
          const book = books.find((b) => b.bookId === parseInt(bookId));
          return book ? `${book.title} (Qty: ${bookIds[bookId]})` : `Book ID ${bookId} (Qty: ${bookIds[bookId]})`;
        })
        .join(", ");
  };

  // Lọc danh sách mượn
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
        Object.keys(loan.books).some((bookId) => {
          const book = books.find((b) => b.bookId === parseInt(bookId));
          return book?.title.toLowerCase().includes(searchQuery.toLowerCase());
        }) ||
        loan.id.toString().includes(searchQuery) ||
        loan.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
        selectedStatus === "All" ||
        loan.status === (selectedStatus === "Borrowed" ? "BORROWED" : "RETURNED");

    const matchesDate =
        !selectedDate ||
        new Date(loan.borrowDate).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Xử lý trả sách
  const handleReturnBook = async (loanId) => {
    setIsReturning(loanId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
          `http://localhost:8080/api/loans/return?loanId=${loanId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "ngrok-skip-browser-warning": "true",
            },
          }
      );
      toast.success("Trả sách thành công!");
      setLoans((prevLoans) =>
          prevLoans.map((loan) =>
              loan.id === loanId
                  ? { ...loan, status: "RETURNED", returnDate: new Date().toISOString().split("T")[0] }
                  : loan
          )
      );
    } catch (error) {
      console.error("Lỗi khi trả sách:", error);
      toast.error("Lỗi khi trả sách. Vui lòng thử lại.");
    } finally {
      setIsReturning(null);
    }
  };

  // Toggle chi tiết khoản mượn
  const toggleLoanDetails = (loanId) => {
    setExpandedLoan(expandedLoan === loanId ? null : loanId);
  };

  // Dữ liệu cho biểu đồ
  // 1. Top 5 sách mượn nhiều nhất
  const bookBorrowCount = {};
  loans.forEach((loan) => {
    Object.keys(loan.books).forEach((bookId) => {
      bookBorrowCount[bookId] = (bookBorrowCount[bookId] || 0) + loan.books[bookId];
    });
  });
  const topBooks = Object.entries(bookBorrowCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([bookId, count]) => {
        const book = books.find((b) => b.bookId === parseInt(bookId));
        return { title: book ? book.title : `Book ID ${bookId}`, count };
      });

  const barChartData = {
    labels: topBooks.map((book) => book.title),
    datasets: [
      {
        label: "Số lần mượn",
        data: topBooks.map((book) => book.count),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 2. Số lượng mượn theo ngày trong tuần
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const loansByDay = last7Days.map((date) => {
    return loans.filter((loan) => loan.borrowDate === date).length;
  });

  const lineChartData = {
    labels: last7Days.map((date) => new Date(date).toLocaleDateString("vi-VN", { weekday: "short" })),
    datasets: [
      {
        label: "Số khoản mượn",
        data: loansByDay,
        fill: false,
        borderColor: "rgba(16, 185, 129, 1)",
        tension: 0.3,
      },
    ],
  };

  // 3. Tỷ lệ trạng thái mượn
  const statusCount = {
    BORROWED: loans.filter((loan) => loan.status === "BORROWED").length,
    RETURNED: loans.filter((loan) => loan.status === "RETURNED").length,
  };

  const pieChartData = {
    labels: ["Đang mượn", "Đã trả"],
    datasets: [
      {
        data: [statusCount.BORROWED, statusCount.RETURNED],
        backgroundColor: ["rgba(234, 179, 8, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderColor: ["rgba(234, 179, 8, 1)", "rgba(16, 185, 129, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
      <>
        <AdminNavbar />
        <div className="max-w-7xl mx-auto py-4">
          <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
          />
          <div className="backdrop-blur-xl bg-white/70 rounded-xl p-4 shadow-md border border-white/30">
            <div className="flex flex-col md:flex-row justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-indigo-500" />
                <h1 className="text-xl font-bold text-slate-800">Quản Lý Lịch Sử Mượn Sách</h1>
              </div>
              <button
                  onClick={() => window.location.reload()}
                  className="mt-2 md:mt-0 px-2 py-1 bg-indigo-500 text-white rounded-full text-xs hover:bg-indigo-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Làm mới
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-3">Danh sách lịch sử mượn sách của toàn hệ thống</p>

            {/* Biểu đồ thống kê */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Thống Kê Mượn Sách</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-white/30">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Top 5 Sách Mượn Nhiều Nhất</h3>
                  <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true },
                        },
                        scales: {
                          y: { beginAtZero: true, title: { display: true, text: "Số lần mượn" } },
                          x: { title: { display: true, text: "Tên sách" } },
                        },
                      }}
                  />
                </div>
                <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-white/30">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Số Lượng Mượn Theo Ngày (7 ngày gần nhất)</h3>
                  <Line
                      data={lineChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true },
                        },
                        scales: {
                          y: { beginAtZero: true, title: { display: true, text: "Số khoản mượn" } },
                          x: { title: { display: true, text: "Ngày" } },
                        },
                      }}
                  />
                </div>
                <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-white/30">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Tỷ Lệ Trạng Thái Mượn</h3>
                  <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: "bottom" },
                          tooltip: { enabled: true },
                        },
                      }}
                  />
                </div>
              </div>
            </div>

            {/* Bộ lọc */}
            <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tiêu đề sách, ID mượn hoặc email người mượn..."
                    className="w-full py-1.5 px-6 pl-7 bg-white/80 border border-white/30 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <Search className="w-3 h-3 text-indigo-500 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="relative">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Chọn ngày mượn"
                    className="w-full py-1.5 px-6 pl-7 bg-white/80 border border-white/30 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    wrapperClassName="w-full"
                    calendarClassName="bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg shadow-md"
                    dayClassName={() => "text-slate-800 hover:bg-indigo-100 text-xs"}
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                        <div className="flex items-center justify-between px-2 py-1">
                          <button
                              onClick={decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                              className="p-1 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:bg-gray-300"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-slate-800">
                      {date.toLocaleString("default", { month: "long", year: "numeric" })}
                    </span>
                          <button
                              onClick={increaseMonth}
                              disabled={nextMonthButtonDisabled}
                              className="p-1 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:bg-gray-300"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                        </div>
                    )}
                />
                <Calendar className="w-3 h-3 text-indigo-500 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {["All", "Borrowed", "Returned"].map((status) => (
                  <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                          selectedStatus === status
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                              : "bg-white/80 border border-white/30 text-slate-800 hover:bg-indigo-100/80"
                      }`}
                  >
                    {status === "All" ? "Tất cả" : status === "Borrowed" ? "Đang mượn" : "Đã trả"}
                  </button>
              ))}
            </div>

            {/* Danh sách */}
            {isLoading ? (
                <div className="text-center py-4">
                  <svg
                      className="animate-spin h-5 w-5 text-indigo-500 mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-xs text-slate-600 mt-1">Đang tải lịch sử mượn sách...</p>
                </div>
            ) : filteredLoans.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto mb-1 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <Book className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Không có lịch sử mượn</h3>
                  <p className="text-xs text-slate-500">Không có khoản mượn nào khớp với tiêu chí tìm kiếm hoặc bộ lọc.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2">
                  {filteredLoans.map((loan) => (
                      <div
                          key={loan.id}
                          className="bg-white/80 rounded-lg p-2 shadow-sm border border-white/30 hover:bg-gray-100/80 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div
                              className="flex items-center gap-1 cursor-pointer flex-grow"
                              onClick={() => toggleLoanDetails(loan.id)}
                          >
                            <Book className="w-3 h-3 text-indigo-500" />
                            <h3 className="font-semibold text-xs text-slate-800">#{loan.id}</h3>
                            <span
                                className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                                    loan.status === "BORROWED" ? "bg-yellow-500/80 text-white" : "bg-emerald-500/80 text-white"
                                }`}
                            >
                        {loan.status === "BORROWED" ? "Đang mượn" : "Đã trả"}
                      </span>
                          </div>
                          {loan.status === "BORROWED" && (
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReturnBook(loan.id);
                                  }}
                                  disabled={isReturning === loan.id}
                                  className="ml-2 py-1.5 px-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center gap-2"
                              >
                                {isReturning === loan.id ? (
                                    <>
                                      <svg
                                          className="animate-spin h-4 w-4 text-white"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                      >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                      </svg>
                                      Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                      <Book className="w-4 h-4" />
                                      Trả sách
                                    </>
                                )}
                              </button>
                          )}
                        </div>
                        {expandedLoan === loan.id && (
                            <div className="mt-2 pl-2 text-xs text-slate-600 animate-fadeIn w-full">
                              <p>
                                <span className="font-semibold">Email người mượn:</span> {loan.userEmail}
                              </p>
                              <p>
                                <span className="font-semibold">Ngày mượn:</span> {loan.borrowDate}
                              </p>
                              <p>
                                <span className="font-semibold">Ngày đến hạn:</span> {loan.dueDate}
                              </p>
                              {loan.returnDate && (
                                  <p>
                                    <span className="font-semibold">Ngày trả:</span> {loan.returnDate}
                                  </p>
                              )}
                              <p>
                                <span className="font-semibold">Sách:</span> {getBookTitles(loan.books)}
                              </p>
                            </div>
                        )}
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </>
  );
};

export default BorrowerPage;