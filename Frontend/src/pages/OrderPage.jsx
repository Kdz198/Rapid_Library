import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderPage() {
    const [books, setBooks] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/books")
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error("Error fetching books:", error);
            });
    }, []);

    const addToCart = (book) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.bookId === book.bookId);
            if (existingItem) {
                if (existingItem.quantity >= book.available) {
                    alert(`Cannot add more of "${book.title}". Only ${book.available} available.`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.bookId === book.bookId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            if (book.available <= 0) {
                alert(`"${book.title}" is not available for borrowing.`);
                return prevCart;
            }
            return [...prevCart, { ...book, quantity: 1 }];
        });
    };

    const updateCartQuantity = (bookId, change) => {
        setCart(prevCart => {
            const updatedCart = prevCart
                .map(item => {
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
                .filter(item => item !== null);
            return updatedCart;
        });
    };

    const removeFromCart = (bookId) => {
        setCart(prevCart => prevCart.filter(item => item.bookId !== bookId));
    };

    const handleBorrow = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        console.log("Borrowing books:", cart);
        alert("Borrow request submitted for: " + cart.map(item => `${item.title} (x${item.quantity})`).join(", "));
        setCart([]);
    };

    return (
        <div style={{
            display: "flex",
            padding: "40px",
            fontFamily: "'Inter', sans-serif",
            background: "linear-gradient(135deg, #f0f4ff 0%, #e6e9f0 100%)",
            minHeight: "100vh",
            gap: "30px"
        }}>
            <div style={{
                flex: 2,
                background: "#ffffff",
                borderRadius: "16px",
                padding: "30px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
            }}>
                <h1 style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#1a1a2e",
                    marginBottom: "10px",
                    letterSpacing: "-0.5px"
                }}>Library Catalog</h1>
                <p style={{
                    fontSize: "16px",
                    color: "#6b7280",
                    marginBottom: "30px",
                    lineHeight: "1.5"
                }}>Browse and select books to borrow from our collection.</p>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "20px"
                }}>
                    {books.map(book => (
                        <div key={book.bookId} style={{
                            background: "#ffffff",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                            }
                        }}>
                            <img
                                src="https://m.media-amazon.com/images/I/91ckLZfJiBL.jpg"
                                alt={book.title}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "12px 12px 0 0"
                                }}
                            />
                            <div style={{ padding: "16px" }}>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: "#1a1a2e",
                                    marginBottom: "8px",
                                    lineHeight: "1.3",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}>{book.title}</h3>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    marginBottom: "4px"
                                }}>by {book.author}</p>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    marginBottom: "4px"
                                }}>Year: {book.yearOfPublisher}</p>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    marginBottom: "4px"
                                }}>Category: {book.category?.name || "N/A"}</p>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    marginBottom: "8px"
                                }}>Available: {book.available}/{book.quantity}</p>
                                <p style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: book.status ? "#10b981" : "#ef4444",
                                    marginBottom: "12px"
                                }}>{book.status ? "Available" : "Unavailable"}</p>
                                <button
                                    onClick={() => addToCart(book)}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        transition: "background 0.3s ease, transform 0.2s ease",
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)",
                                            transform: "scale(1.03)"
                                        }
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{
                flex: 1,
                background: "#ffffff",
                borderRadius: "16px",
                padding: "30px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                position: "sticky",
                top: "40px",
                maxHeight: "calc(100vh - 80px)",
                overflowY: "auto",
                border: "1px solid #e5e7eb"
            }}>
                <h2 style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1a1a2e",
                    marginBottom: "20px",
                    letterSpacing: "-0.5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <i className="fas fa-shopping-cart" style={{ color: "#2563eb" }}></i>
                    Your Cart
                </h2>
                {cart.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "40px 0",
                        color: "#6b7280",
                        fontSize: "16px"
                    }}>
                        <i className="fas fa-cart-arrow-down" style={{
                            fontSize: "48px",
                            color: "#d1d5db",
                            marginBottom: "16px"
                        }}></i>
                        <p>Your cart is empty. Add some books!</p>
                    </div>
                ) : (
                    <>
                        <ul style={{ listStyle: "none", padding: 0, marginBottom: "30px" }}>
                            {cart.map(item => (
                                <li
                                    key={item.bookId}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "15px",
                                        borderRadius: "8px",
                                        background: "#f9fafb",
                                        marginBottom: "12px",
                                        transition: "background 0.2s ease, transform 0.2s ease",
                                        "&:hover": {
                                            background: "#f1f5f9",
                                            transform: "translateY(-2px)"
                                        }
                                    }}
                                >
                                    <img
                                        src="https://m.media-amazon.com/images/I/91ckLZfJiBL.jpg"
                                        alt={item.title}
                                        style={{
                                            width: "50px",
                                            height: "75px",
                                            objectFit: "cover",
                                            borderRadius: "6px",
                                            marginRight: "12px"
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                            color: "#1a1a2e",
                                            display: "block",
                                            marginBottom: "4px"
                                        }}>{item.title}</span>
                                        <span style={{
                                            fontSize: "14px",
                                            color: "#6b7280"
                                        }}>Quantity: {item.quantity}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <button
                                            onClick={() => updateCartQuantity(item.bookId, -1)}
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
                                                color: "#ffffff",
                                                border: "none",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "background 0.3s ease, transform 0.2s ease",
                                                "&:hover": {
                                                    background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                                                    transform: "scale(1.1)"
                                                }
                                            }}
                                        >
                                            <i className="fas fa-minus" style={{ fontSize: "14px" }}></i>
                                        </button>
                                        <button
                                            onClick={() => updateCartQuantity(item.bookId, 1)}
                                            disabled={item.quantity >= item.available}
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                background: item.quantity >= item.available
                                                    ? "#d1d5db"
                                                    : "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
                                                color: "#ffffff",
                                                border: "none",
                                                borderRadius: "50%",
                                                cursor: item.quantity >= item.available ? "not-allowed" : "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "background 0.3s ease, transform 0.2s ease",
                                                "&:hover": item.quantity >= item.available ? {} : {
                                                    background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                                                    transform: "scale(1.1)"
                                                }
                                            }}
                                        >
                                            <i className="fas fa-plus" style={{ fontSize: "14px" }}></i>
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.bookId)}
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                background: "linear-gradient(90deg, #ef4444 0%, #f87171 100%)",
                                                color: "#ffffff",
                                                border: "none",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "background 0.3s ease, transform 0.2s ease",
                                                "&:hover": {
                                                    background: "linear-gradient(90deg, #dc2626 0%, #ef4444 100%)",
                                                    transform: "scale(1.1)"
                                                }
                                            }}
                                        >
                                            <i className="fas fa-trash" style={{ fontSize: "14px" }}></i>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleBorrow}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "background 0.3s ease, transform 0.2s ease",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #059669 0%, #10b981 100%)",
                                    transform: "scale(1.02)"
                                }
                            }}
                        >
                            <i className="fas fa-book" style={{ fontSize: "16px" }}></i>
                            Borrow Books
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrderPage;