import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Book, Calendar, Search, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function HistoryPage() {
  const [loans, setLoans] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedLoan, setExpandedLoan] = useState(null);
  const [isReturning, setIsReturning] = useState(null); // Track which loan is being returned

  useEffect(() => {
    // Fetch user data
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoading(true);
      axios
          .get("http://localhost:8080/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "ngrok-skip-browser-warning": "true",
            },
          })
          .then((response) => {
            setUser(response.data);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            toast.error("Failed to fetch user data. Please try again.");
          })
          .finally(() => {
            setIsLoading(false);
          });
    }

    // Fetch books for title lookup
    axios
        .get("http://localhost:8080/api/books")
        .then((response) => {
          setBooks(response.data);
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          toast.error("Failed to fetch books data. Please try again.");
        });

    // Fetch loan history
    if (user?.email) {
      setIsLoading(true);
      axios
          .get("http://localhost:8080/api/loans", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "ngrok-skip-browser-warning": "true",
            },
          })
          .then((response) => {
            const userLoans = response.data.filter(
                (loan) => loan.userEmail === user.email
            );
            setLoans(userLoans);
          })
          .catch((error) => {
            console.error("Error fetching loan history:", error);
            toast.error("Failed to fetch loan history. Please try again.");
          })
          .finally(() => {
            setIsLoading(false);
          });
    }
  }, [user?.email]);

  // Function to get book titles from book IDs
  const getBookTitles = (bookIds) => {
    return Object.keys(bookIds).map((bookId) => {
      const book = books.find((b) => b.bookId === parseInt(bookId));
      return book ? `${book.title} (Qty: ${bookIds[bookId]})` : `Book ID ${bookId} (Qty: ${bookIds[bookId]})`;
    }).join(", ");
  };

  // Filter loans based on search query, status, and date
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
        Object.keys(loan.books).some((bookId) => {
          const book = books.find((b) => b.bookId === parseInt(bookId));
          return book?.title.toLowerCase().includes(searchQuery.toLowerCase());
        }) ||
        loan.id.toString().includes(searchQuery);

    const matchesStatus =
        selectedStatus === "All" ||
        loan.status === (selectedStatus === "Borrowed" ? "BORROWED" : "RETURNED");

    const matchesDate =
        !selectedDate ||
        new Date(loan.borrowDate).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Toggle dropdown for loan details
  const toggleLoanDetails = (loanId) => {
    setExpandedLoan(expandedLoan === loanId ? null : loanId);
  };

  // Handle return book
  const handleReturnBook = async (loanId) => {
    setIsReturning(loanId);
    try {
      // Simulate 2-second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
      toast.success("Đã trả sách thành công!");
      // Refresh loan list after successful return
      setLoans((prevLoans) =>
          prevLoans.map((loan) =>
              loan.id === loanId ? { ...loan, status: "RETURNED", returnDate: new Date().toISOString().split('T')[0] } : loan
          )
      );
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Failed to return book. Please try again.");
    } finally {
      setIsReturning(null);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        {/* Toast Container for Notifications */}
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

        {/* Main Container */}
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/70 rounded-xl p-4 shadow-md border border-white/30">
            <div className="flex flex-col md:flex-row justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-indigo-500" />
                <h1 className="text-xl font-bold text-slate-800">Loan History</h1>
              </div>
              <button
                  onClick={() => window.location.reload()}
                  className="mt-2 md:mt-0 px-2 py-1 bg-indigo-500 text-white rounded-full text-xs hover:bg-indigo-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-3">Your borrowing records</p>

            {/* Search Bar and Date Picker */}
            <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by book title or Loan ID..."
                    className="w-full py-1.5 px-6 pl-7 bg-white/80 border border-white/30 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <Search className="w-3 h-3 text-indigo-500 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="relative">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select borrow date"
                    className="w-full py-1.5 px-6 pl-7 bg-white/80 border border-white/30 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    wrapperClassName="w-full"
                    calendarClassName="bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg shadow-md"
                    dayClassName={() => "text-slate-800 hover:bg-indigo-100 text-xs"}
                    renderCustomHeader={({
                                           date,
                                           decreaseMonth,
                                           increaseMonth,
                                           prevMonthButtonDisabled,
                                           nextMonthButtonDisabled,
                                         }) => (
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

            {/* Status Filters */}
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
                    {status}
                  </button>
              ))}
            </div>

            {isLoading ? (
                <div className="text-center py-4">
                  <svg
                      className="animate-spin h-5 w-5 text-indigo-500 mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                  >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-xs text-slate-600 mt-1">Loading your loan history...</p>
                </div>
            ) : filteredLoans.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 mx-auto mb-1 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <Book className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">
                    No Borrowing History
                  </h3>
                  <p className="text-xs text-slate-500">
                    No loans match your search or filter criteria.
                  </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                            <h3 className="font-semibold text-xs text-slate-800">
                              #{loan.id}
                            </h3>
                            <span
                                className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                                    loan.status === "BORROWED"
                                        ? "bg-yellow-500/80 text-white"
                                        : "bg-emerald-500/80 text-white"
                                }`}
                            >
                        {loan.status === "BORROWED" ? "Borrowed" : "Returned"}
                      </span>
                          </div>
                          {loan.status === "BORROWED" && (
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent toggle dropdown
                                    handleReturnBook(loan.id);
                                  }}
                                  disabled={isReturning === loan.id}
                                  className="ml-2 py-1.5 px-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center gap-2"
                              >
                                {isReturning === loan.id ? (
                                    <>
                                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Checking...
                                    </>
                                ) : (
                                    <>
                                      <Book className="w-4 h-4" />
                                      Return
                                    </>
                                )}
                              </button>
                          )}
                        </div>
                        {expandedLoan === loan.id && (
                            <div className="mt-2 pl-2 text-xs text-slate-600 animate-fadeIn w-full">
                              <p><span className="font-semibold">Borrow Date:</span> {loan.borrowDate}</p>
                              <p><span className="font-semibold">Due Date:</span> {loan.dueDate}</p>
                              {loan.returnDate && (
                                  <p><span className="font-semibold">Return Date:</span> {loan.returnDate}</p>
                              )}
                              <p><span className="font-semibold">Books:</span> {getBookTitles(loan.books)}</p>
                            </div>
                        )}
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default HistoryPage;