import { useState, useEffect } from "react";

const API_URL = "";

const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 2499, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", tag: "Best Seller" },
  { id: 2, name: "Cotton T-Shirt", price: 499, category: "clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", tag: "New" },
  { id: 3, name: "Python Cookbook", price: 799, category: "books", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80", tag: null },
  { id: 4, name: "Dark Chocolate", price: 199, category: "food", image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80", tag: "Popular" },
  { id: 5, name: "Mechanical Keyboard", price: 3299, category: "electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", tag: "Top Pick" },
  { id: 6, name: "Running Shoes", price: 2199, category: "clothing", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", tag: null },
  { id: 7, name: "Green Tea Pack", price: 349, category: "food", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80", tag: null },
  { id: 8, name: "Design Thinking", price: 599, category: "books", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80", tag: null },
  { id: 9, name: "USB-C Hub", price: 1599, category: "electronics", image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&q=80", tag: null },
  { id: 10, name: "Denim Jacket", price: 1899, category: "clothing", image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=400&q=80", tag: "Trending" },
  { id: 11, name: "Almonds 500g", price: 449, category: "food", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80", tag: null },
  { id: 12, name: "Clean Code", price: 699, category: "books", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80", tag: null },
];

const CATEGORIES = ["all", "electronics", "clothing", "food", "books"];

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #FAF7F2;
    --warm-white: #FFFDF9;
    --charcoal: #1C1C1E;
    --brown: #8B5E3C;
    --brown-light: #C4956A;
    --brown-pale: #F0E6D9;
    --green: #2D5A3D;
    --green-light: #E8F0EA;
    --red: #C0392B;
    --red-light: #FDECEA;
    --border: #E8E0D5;
    --shadow: 0 2px 20px rgba(28,28,30,0.08);
    --shadow-hover: 0 8px 40px rgba(28,28,30,0.15);
    --radius: 16px;
    --radius-sm: 8px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--charcoal); min-height: 100vh; }

  .app { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

  /* NAV */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 0; border-bottom: 1px solid var(--border);
    position: sticky; top: 0; background: var(--cream); z-index: 100;
    backdrop-filter: blur(10px);
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700; color: var(--charcoal);
    letter-spacing: -0.5px;
  }
  .nav-logo span { color: var(--brown); }
  .nav-actions { display: flex; gap: 12px; align-items: center; }
  .nav-btn {
    padding: 8px 18px; border-radius: 40px; border: 1.5px solid var(--border);
    background: var(--warm-white); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer; color: var(--charcoal);
    transition: all 0.2s; display: flex; align-items: center; gap: 6px;
  }
  .nav-btn:hover { border-color: var(--brown); color: var(--brown); }
  .nav-btn.primary { background: var(--charcoal); color: white; border-color: var(--charcoal); }
  .nav-btn.primary:hover { background: var(--brown); border-color: var(--brown); }
  .badge {
    background: var(--brown); color: white; border-radius: 50%;
    width: 18px; height: 18px; font-size: 10px; font-weight: 600;
    display: flex; align-items: center; justify-content: center;
  }

  /* HERO */
  .hero {
    padding: 60px 0 40px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 52px; font-weight: 700; line-height: 1.1;
    letter-spacing: -1px; color: var(--charcoal);
  }
  .hero-title em { color: var(--brown); font-style: italic; }
  .hero-sub { margin-top: 16px; font-size: 16px; color: #666; font-weight: 300; line-height: 1.6; }
  .hero-image {
    border-radius: 24px; overflow: hidden; height: 280px;
    position: relative;
  }
  .hero-image img { width: 100%; height: 100%; object-fit: cover; }
  .hero-image-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(139,94,60,0.3), transparent);
  }

  /* FILTERS */
  .filters-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 0 20px; gap: 12px; flex-wrap: wrap;
  }
  .filter-pills { display: flex; gap: 8px; flex-wrap: wrap; }
  .pill {
    padding: 7px 16px; border-radius: 40px; border: 1.5px solid var(--border);
    background: var(--warm-white); font-size: 13px; font-weight: 500;
    cursor: pointer; color: #666; transition: all 0.2s; text-transform: capitalize;
  }
  .pill:hover { border-color: var(--brown-light); color: var(--brown); }
  .pill.active { background: var(--charcoal); color: white; border-color: var(--charcoal); }
  .search-wrap { position: relative; }
  .search-input {
    padding: 9px 16px 9px 38px; border-radius: 40px;
    border: 1.5px solid var(--border); background: var(--warm-white);
    font-family: 'DM Sans', sans-serif; font-size: 13px; width: 220px;
    outline: none; transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--brown-light); }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #999; font-size: 14px; }

  /* GRID */
  .products-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px; padding-bottom: 60px;
  }
  .product-card {
    background: var(--warm-white); border-radius: var(--radius);
    border: 1px solid var(--border); overflow: hidden;
    transition: all 0.3s; cursor: pointer; position: relative;
  }
  .product-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-4px); border-color: var(--brown-light); }
  .product-img-wrap { position: relative; height: 200px; overflow: hidden; }
  .product-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .product-card:hover .product-img-wrap img { transform: scale(1.05); }
  .product-tag {
    position: absolute; top: 12px; left: 12px;
    background: var(--charcoal); color: white;
    font-size: 10px; font-weight: 600; padding: 4px 10px;
    border-radius: 40px; letter-spacing: 0.5px; text-transform: uppercase;
  }
  .product-body { padding: 16px; }
  .product-cat { font-size: 11px; color: var(--brown-light); font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .product-name { font-size: 15px; font-weight: 600; color: var(--charcoal); margin-bottom: 12px; line-height: 1.3; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; color: var(--charcoal); }
  .add-btn {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--charcoal); color: white; border: none;
    font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .add-btn:hover { background: var(--brown); transform: scale(1.1); }
  .add-btn.added { background: var(--green); }
  .qty-badge {
    position: absolute; bottom: 12px; right: 12px;
    background: var(--green); color: white; border-radius: 40px;
    font-size: 11px; font-weight: 600; padding: 3px 10px;
  }

  /* CART PAGE */
  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px; font-weight: 700; padding: 32px 0 24px;
    border-bottom: 1px solid var(--border); margin-bottom: 24px;
  }
  .cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 32px; padding-bottom: 60px; }
  .cart-item {
    display: flex; gap: 16px; padding: 16px;
    background: var(--warm-white); border-radius: var(--radius);
    border: 1px solid var(--border); margin-bottom: 12px;
    transition: box-shadow 0.2s;
  }
  .cart-item:hover { box-shadow: var(--shadow); }
  .cart-item-img { width: 80px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; }
  .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .cart-item-body { flex: 1; }
  .cart-item-cat { font-size: 11px; color: var(--brown-light); font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
  .cart-item-name { font-size: 15px; font-weight: 600; margin: 2px 0 10px; }
  .qty-row { display: flex; align-items: center; gap: 10px; }
  .qty-btn {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1.5px solid var(--border); background: transparent;
    font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; color: var(--charcoal);
  }
  .qty-btn:hover { border-color: var(--brown); color: var(--brown); }
  .qty-num { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
  .remove-link { font-size: 12px; color: var(--red); cursor: pointer; margin-left: auto; padding: 4px 8px; border-radius: 4px; }
  .remove-link:hover { background: var(--red-light); }
  .cart-item-price { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 600; white-space: nowrap; }

  /* SUMMARY */
  .summary-card {
    background: var(--warm-white); border-radius: var(--radius);
    border: 1px solid var(--border); padding: 24px;
    position: sticky; top: 80px; height: fit-content;
  }
  .summary-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; margin-bottom: 20px; }
  .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #666; margin-bottom: 10px; }
  .summary-divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
  .summary-total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 600; }
  .summary-total span:last-child { font-family: 'Playfair Display', serif; }
  .checkout-btn {
    width: 100%; margin-top: 20px; padding: 14px;
    background: var(--charcoal); color: white; border: none;
    border-radius: 40px; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  }
  .checkout-btn:hover { background: var(--brown); }
  .checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .shipping-note { text-align: center; font-size: 12px; color: #999; margin-top: 12px; }
  .empty-state { text-align: center; padding: 60px 20px; color: #999; }
  .empty-state p { font-size: 16px; margin-top: 8px; }

  /* ORDERS */
  .orders-grid { display: grid; gap: 16px; padding-bottom: 60px; }
  .order-card {
    background: var(--warm-white); border-radius: var(--radius);
    border: 1px solid var(--border); padding: 20px; transition: box-shadow 0.2s;
  }
  .order-card:hover { box-shadow: var(--shadow); }
  .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .order-ref { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; }
  .order-date { font-size: 12px; color: #999; margin-top: 2px; }
  .status-badge {
    font-size: 11px; font-weight: 600; padding: 4px 12px;
    border-radius: 40px; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .status-processing { background: #FEF3C7; color: #92400E; }
  .status-delivered { background: var(--green-light); color: var(--green); }
  .order-items-preview { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
  .order-item-chip {
    font-size: 12px; color: #555; background: var(--cream);
    padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border);
  }
  .order-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border); }
  .order-total { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; }
  .order-shipping { font-size: 12px; color: #999; }

  /* SUCCESS TOAST */
  .toast {
    position: fixed; bottom: 30px; right: 30px;
    background: var(--green); color: white; padding: 14px 24px;
    border-radius: 12px; font-size: 14px; font-weight: 500;
    box-shadow: 0 8px 30px rgba(45,90,61,0.3);
    animation: slideUp 0.3s ease; z-index: 1000;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  @media (max-width: 768px) {
    .hero { grid-template-columns: 1fr; }
    .hero-image { display: none; }
    .hero-title { font-size: 36px; }
    .cart-layout { grid-template-columns: 1fr; }
    .summary-card { position: static; }
  }
`;

export default function ShopLite() {
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [placing, setPlacing] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = filter === "all" || p.category === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    showToast("Added to cart ✓");
  };

  const changeQty = (id, delta) => {
    setCart((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + delta };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const cartItems = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id == id), qty }));

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const total = subtotal + shipping;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const items = cartItems.map((i) => ({ product_id: i.id, quantity: i.qty }));
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, subtotal, shipping, total }),
      });
      if (!res.ok) throw new Error();
      setCart({});
      showToast("Order placed successfully! 🎉");
      setPage("orders");
      fetchOrders();
    } catch {
      showToast("Failed to place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  useEffect(() => {
    if (page === "orders") fetchOrders();
  }, [page]);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">Shop<span>Lite</span></div>
          <div className="nav-actions">
            {page !== "shop" && (
              <button className="nav-btn" onClick={() => setPage("shop")}>← Shop</button>
            )}
            <button className="nav-btn" onClick={() => setPage("orders")}>Orders</button>
            <button className="nav-btn primary" onClick={() => setPage("cart")}>
              🛒 Cart <span className="badge">{cartCount}</span>
            </button>
          </div>
        </nav>

        {/* SHOP PAGE */}
        {page === "shop" && (
          <>
            <div className="hero">
              <div>
                <h1 className="hero-title">
                  Curated goods,<br /><em>delivered fast.</em>
                </h1>
                <p className="hero-sub">
                  Discover premium electronics, fashion, books and gourmet food — all in one place.
                </p>
              </div>
              <div className="hero-image">
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" alt="Shopping" />
                <div className="hero-image-overlay" />
              </div>
            </div>

            <div className="filters-row">
              <div className="filter-pills">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`pill ${filter === cat ? "active" : ""}`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="products-grid">
              {filtered.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="product-img-wrap">
                    <img src={p.image} alt={p.name} loading="lazy" />
                    {p.tag && <span className="product-tag">{p.tag}</span>}
                    {cart[p.id] && <span className="qty-badge">{cart[p.id]} in cart</span>}
                  </div>
                  <div className="product-body">
                    <div className="product-cat">{p.category}</div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-footer">
                      <span className="product-price">{fmt(p.price)}</span>
                      <button
                        className={`add-btn ${cart[p.id] ? "added" : ""}`}
                        onClick={() => addToCart(p.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                  <p>No products found.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* CART PAGE */}
        {page === "cart" && (
          <>
            <h1 className="page-title">Your Cart</h1>
            {cartItems.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 48 }}>🛒</div>
                <p>Your cart is empty. Go add something!</p>
              </div>
            ) : (
              <div className="cart-layout">
                <div>
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-img">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-body">
                        <div className="cart-item-cat">{item.category}</div>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="qty-row">
                          <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                          <span className="qty-num">{item.qty}</span>
                          <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                          <span className="remove-link" onClick={() => changeQty(item.id, -item.qty)}>Remove</span>
                        </div>
                      </div>
                      <div className="cart-item-price">{fmt(item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>
                <div className="summary-card">
                  <div className="summary-title">Order Summary</div>
                  <div className="summary-row"><span>Subtotal ({cartCount} items)</span><span>{fmt(subtotal)}</span></div>
                  <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free 🎉" : fmt(shipping)}</span></div>
                  <hr className="summary-divider" />
                  <div className="summary-total"><span>Total</span><span>{fmt(total)}</span></div>
                  <button className="checkout-btn" onClick={placeOrder} disabled={placing}>
                    {placing ? "Placing order..." : "Place Order →"}
                  </button>
                  <p className="shipping-note">Free shipping on orders above ₹2,000</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ORDERS PAGE */}
        {page === "orders" && (
          <>
            <h1 className="page-title">Your Orders</h1>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 48 }}>📦</div>
                <p>No orders yet. Go shop something!</p>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map((o) => (
                  <div key={o.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <div className="order-ref">{o.order_ref}</div>
                        <div className="order-date">
                          {new Date(o.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </div>
                      </div>
                      <span className={`status-badge ${o.status === "Processing" ? "status-processing" : "status-delivered"}`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="order-items-preview">
                      {o.items.map((item) => (
                        <span key={item.id} className="order-item-chip">
                          {item.product_name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                    <div className="order-footer">
                      <span className="order-total">{fmt(o.total)}</span>
                      <span className="order-shipping">
                        Shipping: {o.shipping === 0 ? "Free" : fmt(o.shipping)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}