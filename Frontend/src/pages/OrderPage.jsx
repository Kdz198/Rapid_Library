import axios from "axios";
import { Book, BookOpen, Heart, Minus, Plus, ShoppingCart, Star, Trash2, Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderPage() {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [returnDate, setReturnDate] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch books
    axios
        .get("http://localhost:8080/api/books")
        .then((response) => {
          setBooks(response.data);
          // Extract unique categories from books
          const uniqueCategories = ["All", ...new Set(response.data.map((book) => book.category?.name).filter(Boolean))];
          setCategories(uniqueCategories);
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          toast.error("Failed to fetch books. Please try again.");
        });

    // Fetch user data
    const token = localStorage.getItem("token");
    if (token) {
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
          });
    }
  }, []);

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.bookId === book.bookId);
      if (existingItem) {
        if (existingItem.quantity >= book.available) {
          toast.warn(`Cannot add more of "${book.title}". Only ${book.available} available.`);
          return prevCart;
        }
        return prevCart.map((item) => (item.bookId === book.bookId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      if (book.available <= 0) {
        toast.warn(`"${book.title}" is not available for borrowing.`);
        return prevCart;
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const updateCartQuantity = (bookId, change) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
          .map((item) => {
            if (item.bookId === bookId) {
              const newQuantity = item.quantity + change;
              if (newQuantity <= 0) return null;
              if (newQuantity > item.available) {
                toast.warn(`Cannot add more of "${item.title}". Only ${item.available} available.`);
                return item;
              }
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter((item) => item !== null);
      return updatedCart;
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
  };

  const handleBorrow = async () => {
    if (cart.length === 0) {
      toast.warn("Your cart is empty!");
      return;
    }
    if (!returnDate) {
      toast.warn("Please select a return date!");
      return;
    }
    if (!user?.email) {
      toast.warn("User information is missing!");
      return;
    }

    setIsLoading(true);

    const loanRequest = {
      userEmail: user.email,
      books: cart.reduce((acc, item) => ({
        ...acc,
        [item.bookId]: item.quantity
      }), {}),
      borrowDate: formatDate(new Date()),
      dueDate: formatDate(returnDate)
    };

    try {
      // Simulate 2-second delay for loading effect
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await axios.post("http://localhost:8080/api/loans", loanRequest, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (response.data === true) {
        toast.success("You have successfully borrowed the books!");
        setCart([]);
        setReturnDate(null);
      } else {
        toast.error("The library is out of stock for some books!");
      }
    } catch (error) {
      console.error("Error borrowing books:", error);
      toast.error("An error occurred while processing your borrow request.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter books based on search query and selected category
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
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

        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Digital Library
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Discover, explore, and borrow from our curated collection of literary treasures</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Books Catalog */}
          <div className="xl:col-span-2">
            <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Book Collection</h2>
                  <p className="text-slate-600">Browse our available titles</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title or author..."
                      className="w-full py-3 px-12 pl-10 bg-white/80 border border-white/30 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <Search className="w-5 h-5 text-indigo-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Category Filters */}
              <div className="mb-6 flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                            selectedCategory === category
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                : "bg-white/80 border border-white/30 text-slate-800 hover:bg-indigo-100/80"
                        }`}
                    >
                      {category}
                    </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No books found</h3>
                      <p className="text-slate-500 text-sm">Try adjusting your search or category</p>
                    </div>
                ) : (
                    filteredBooks.map((book) => (
                        <div
                            key={book.bookId}
                            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/30"
                        >
                          {/* Book Cover */}
                          <div className="relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&crop=top"
                                alt={book.title}
                                className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                                book.status ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"
                            }`}
                        >
                          {book.status ? "Available" : "Out of Stock"}
                        </span>
                            </div>

                            {/* Favorite Icon */}
                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Heart className="w-5 h-5 text-white/80 hover:text-red-400 cursor-pointer transition-colors" />
                            </div>
                          </div>

                          {/* Book Info */}
                          <div className="p-5">
                            <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                            <p className="text-slate-600 text-sm mb-1">by {book.author}</p>
                            <p className="text-slate-500 text-xs mb-3">
                              {book.yearOfPublisher} • {book.category?.name || "N/A"}
                            </p>

                            {/* Availability */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <span className="text-xs text-slate-500">(4.8)</span>
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                          {book.available}/{book.quantity} left
                        </span>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => addToCart(book)}
                                disabled={!book.status || book.available === 0}
                                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                            >
                              {book.status ? "Add to Cart" : "Unavailable"}
                            </button>
                          </div>
                        </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Shopping Cart */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
                  <p className="text-slate-600 text-sm">{cart.length} items selected</p>
                </div>
              </div>

              {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Cart is Empty</h3>
                    <p className="text-slate-500 text-sm">Add some books to get started</p>
                  </div>
              ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-97 overflow-y-auto">
                      {cart.map((item) => (
                          <div
                              key={item.bookId}
                              className="bg-white/80 rounded-xl p-2 shadow-sm border border-white/30 hover:bg-gray-100/80 transition-all duration-300 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=50&h=65&fit=crop&crop=top"
                                  alt={item.title}
                                  className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                              />
                              <div>
                                <h4 className="font-semibold text-sm text-slate-800 line-clamp-1">{item.title}</h4>
                                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                  onClick={() => updateCartQuantity(item.bookId, -1)}
                                  className="w-6 h-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full flex items-center justify-center transition-all duration-200"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                              <button
                                  onClick={() => updateCartQuantity(item.bookId, 1)}
                                  disabled={item.quantity >= item.available}
                                  className="w-6 h-6 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 text-gray-800 rounded-full flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                  onClick={() => removeFromCart(item.bookId)}
                                  className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>

                    {/* User Information */}
                    {user && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-slate-800 mb-2">User Information</h3>
                          <p className="text-sm text-slate-600">Name: {user.name}</p>
                          <p className="text-sm text-slate-600">Email: {user.email}</p>
                        </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Select Return Date
                      </label>
                      <div className="relative">
                        <DatePicker
                            selected={returnDate}
                            onChange={(date) => setReturnDate(date)}
                            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                            dateFormat="MMMM d, yyyy"
                            placeholderText="Choose return date"
                            className="w-full py-2 px-3 bg-white/80 border border-white/30 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            wrapperClassName="w-full"
                            calendarClassName="bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl shadow-xl"
                            dayClassName={(date) =>
                                date.getTime() < Date.now() + 24 * 60 * 60 * 1000
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-slate-800 hover:bg-indigo-100"
                            }
                            renderCustomHeader={({
                                                   date,
                                                   decreaseMonth,
                                                   increaseMonth,
                                                   prevMonthButtonDisabled,
                                                   nextMonthButtonDisabled,
                                                 }) => (
                                <div className="flex items-center justify-between px-2 py-2">
                                  <button
                                      onClick={decreaseMonth}
                                      disabled={prevMonthButtonDisabled}
                                      className="p-1 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:bg-gray-300"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-sm font-semibold text-slate-800">
                            {date.toLocaleString("default", { month: "long", year: "numeric" })}
                          </span>
                                  <button
                                      onClick={increaseMonth}
                                      disabled={nextMonthButtonDisabled}
                                      className="p-1 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:bg-gray-300"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                            )}
                        />
                        <Calendar className="w-5 h-5 text-indigo-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <button
                        onClick={handleBorrow}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 Hover:via-teal-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Checking inventory...
                          </>
                      ) : (
                          <>
                            <Book className="w-5 h-5" />
                            Borrow Books ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                          </>
                      )}
                    </button>
                  </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default OrderPage;