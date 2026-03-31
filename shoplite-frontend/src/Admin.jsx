import { useState, useEffect, useRef } from "react";
import API_URL from "./config";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .admin-page { max-width: 1200px; margin: 0 auto; padding: 0 20px 60px; font-family: 'DM Sans', sans-serif; }

  .admin-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 0; border-bottom: 1px solid #E8E0D5; margin-bottom: 32px;
    position: sticky; top: 0; background: #FAF7F2; z-index: 100;
  }
  .admin-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
  .admin-logo span { color: #8B5E3C; }
  .back-btn {
    padding: 8px 18px; border-radius: 40px; border: 1.5px solid #E8E0D5;
    background: white; font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 500; cursor: pointer; color: #1C1C1E; transition: all 0.2s;
  }
  .back-btn:hover { border-color: #8B5E3C; color: #8B5E3C; }

  .admin-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; margin-bottom: 8px; }
  .admin-sub { font-size: 14px; color: #888; margin-bottom: 32px; }

  .admin-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }

  .admin-card {
    background: white; border-radius: 16px; border: 1px solid #E8E0D5;
    overflow: hidden; transition: box-shadow 0.2s;
  }
  .admin-card:hover { box-shadow: 0 8px 30px rgba(28,28,30,0.1); }

  .admin-img-wrap { position: relative; height: 180px; overflow: hidden; background: #F5F0EA; }
  .admin-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .img-placeholder {
    width: 100%; height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; color: #bbb; gap: 8px;
  }
  .img-placeholder span { font-size: 36px; }
  .img-placeholder p { font-size: 12px; }

  .upload-overlay {
    position: absolute; inset: 0; background: rgba(28,28,30,0.6);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s; cursor: pointer;
  }
  .admin-img-wrap:hover .upload-overlay { opacity: 1; }
  .upload-overlay-text { color: white; font-size: 13px; font-weight: 600; text-align: center; }

  .admin-card-body { padding: 16px; }
  .admin-card-cat { font-size: 11px; color: #C4956A; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .admin-card-name { font-size: 15px; font-weight: 600; color: #1C1C1E; margin-bottom: 4px; }
  .admin-card-price { font-family: 'Playfair Display', serif; font-size: 16px; color: #1C1C1E; margin-bottom: 14px; }

  .upload-btn {
    width: 100%; padding: 9px; border-radius: 40px;
    border: 1.5px solid #E8E0D5; background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; color: #1C1C1E; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .upload-btn:hover { border-color: #8B5E3C; color: #8B5E3C; background: #FAF7F2; }
  .upload-btn.uploading { background: #F5F0EA; color: #888; cursor: not-allowed; }
  .upload-btn.success { border-color: #2D5A3D; color: #2D5A3D; background: #E8F0EA; }

  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #ccc; display: inline-block; margin-right: 6px;
  }
  .status-dot.has-image { background: #2D5A3D; }

  .toast {
    position: fixed; bottom: 30px; right: 30px;
    background: #2D5A3D; color: white; padding: 14px 24px;
    border-radius: 12px; font-size: 14px; font-weight: 500;
    box-shadow: 0 8px 30px rgba(45,90,61,0.3);
    animation: slideUp 0.3s ease; z-index: 1000;
  }
  .toast.error { background: #C0392B; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .loading { text-align: center; padding: 60px; color: #888; font-size: 16px; }
`;

export default function AdminPage({ onBack }) {
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState({});
  const [toast, setToast] = useState(null);
  const fileInputRefs = useRef({});

  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  const showToast = (msg, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      showToast("Failed to load products", true);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpload = async (productId, file) => {
    if (!file) return;

    setUploading((prev) => ({ ...prev, [productId]: true }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/products/${productId}/image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      // Update product image in state instantly
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, image_url: data.image_url } : p))
      );

      showToast("Image uploaded successfully! ✓");
    } catch {
      showToast("Upload failed. Try again.", true);
    } finally {
      setUploading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="admin-page" style={{ background: "#FAF7F2", minHeight: "100vh" }}>
        <nav className="admin-nav">
          <div className="admin-logo">Shop<span>Lite</span> Admin</div>
          <button className="back-btn" onClick={onBack}>← Back to Shop</button>
        </nav>

        <h1 className="admin-title">Product Images</h1>
        <p className="admin-sub">Upload images for each product. Images are stored in AWS S3.</p>

        {products.length === 0 ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="admin-grid">
            {products.map((p) => (
              <div key={p.id} className="admin-card">
                {/* Image area - click to upload */}
                <div
                  className="admin-img-wrap"
                  onClick={() => fileInputRefs.current[p.id]?.click()}
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} />
                  ) : (
                    <div className="img-placeholder">
                      <span>{p.icon}</span>
                      <p>No image yet</p>
                    </div>
                  )}
                  <div className="upload-overlay">
                    <div className="upload-overlay-text">
                      📷<br />Click to upload
                    </div>
                  </div>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={(el) => (fileInputRefs.current[p.id] = el)}
                    onChange={(e) => handleUpload(p.id, e.target.files[0])}
                  />
                </div>

                <div className="admin-card-body">
                  <div className="admin-card-cat">{p.category}</div>
                  <div className="admin-card-name">
                    <span className={`status-dot ${p.image_url ? "has-image" : ""}`} />
                    {p.name}
                  </div>
                  <div className="admin-card-price">{fmt(p.price)}</div>
                  <button
                    className={`upload-btn ${uploading[p.id] ? "uploading" : ""} ${p.image_url && !uploading[p.id] ? "success" : ""}`}
                    onClick={() => fileInputRefs.current[p.id]?.click()}
                    disabled={uploading[p.id]}
                  >
                    {uploading[p.id]
                      ? "⏳ Uploading..."
                      : p.image_url
                      ? "✓ Change Image"
                      : "📷 Upload Image"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className={`toast ${toast.error ? "error" : ""}`}>{toast.msg}</div>
      )}
    </>
  );
}