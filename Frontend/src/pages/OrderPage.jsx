import axios from "axios";
import { Book, BookOpen, Heart, Minus, Plus, ShoppingCart, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
function OrderPage() {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.bookId === book.bookId);
      if (existingItem) {
        if (existingItem.quantity >= book.available) {
          alert(`Cannot add more of "${book.title}". Only ${book.available} available.`);
          return prevCart;
        }
        return prevCart.map((item) => (item.bookId === book.bookId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      if (book.available <= 0) {
        alert(`"${book.title}" is not available for borrowing.`);
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
              alert(`Cannot add more of "${item.title}". Only ${item.available} available.`);
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

  const handleBorrow = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    console.log("Borrowing books:", cart);
    alert("Borrow request submitted for: " + cart.map((item) => `${item.title} (x${item.quantity})`).join(", "));
    setCart([]);
  };

  return (
    <>
      {" "}
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Digital Library
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover, explore, and borrow from our curated collection of literary treasures
            </p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
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
                      <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {book.title}
                      </h3>
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
                ))}
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
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.bookId}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/30 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=130&fit=crop&crop=top"
                            alt={item.title}
                            className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{item.title}</h4>
                            <p className="text-xs text-slate-500 mb-3">Qty: {item.quantity}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateCartQuantity(item.bookId, -1)}
                                  className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.bookId, 1)}
                                  disabled={item.quantity >= item.available}
                                  className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.bookId)}
                                className="w-7 h-7 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleBorrow}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <Book className="w-5 h-5" />
                    Borrow Books ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderPage;
