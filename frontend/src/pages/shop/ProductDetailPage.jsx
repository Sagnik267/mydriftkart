import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import StarRating from "../../components/shop/StarRating";
import Loader from "../../components/shop/Loader";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import "./Pages.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const fetchProduct = async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        axios.get(`/api/products/${id}`),
        axios.get(`/api/reviews/${id}`)
      ]);
      setProduct(pRes.data);
      setReviews(rRes.data);
    } catch (err) {
      setToast({ msg: "Failed to load product", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const res = await addToCart(product.product._id, parseInt(qty));
    if (res.error) setToast({ msg: res.error, type: "error" });
    else setToast({ msg: "Added to cart successfully!", type: "success" });
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return setToast({ msg: "Please login to review", type: "error" });
    try {
      await axios.post("/api/reviews", { productId: id, rating, comment });
      setToast({ msg: "Review submitted!", type: "success" });
      setComment("");
      setRating(5);
      fetchProduct();
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Error submitting review", type: "error" });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      setToast({ msg: "Review deleted", type: "success" });
      fetchProduct();
    } catch (err) {
      setToast({ msg: "Error deleting review", type: "error" });
    }
  };

  if (loading) return <div className="page-wrapper"><Navbar /><Loader /></div>;
  if (!product || !product.product) return <div className="page-wrapper"><Navbar /><h2 style={{textAlign:'center', marginTop:'3rem'}}>Product not found</h2></div>;

  const { product: prod, avgRating, numReviews } = product;

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="detail-container">
        <div className="product-detail-flex">
          <div className="product-detail-image-wrapper">
            <img src={prod.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} alt={prod.name} className="product-detail-img" />
          </div>

          <div className="product-detail-info">
            <h1 className="product-detail-title">{prod.name}</h1>
            <p className="product-detail-brand">Category: {prod.category}</p>
            
            <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem'}}>
              <StarRating rating={avgRating} readonly />
              <span style={{color: 'var(--shop-text-muted)', fontWeight: 600}}>({numReviews} Reviews)</span>
            </div>

            <div className="product-detail-price">₹{prod.price}</div>
            
            <p className="product-detail-desc">{prod.description}</p>
            
            {prod.stock > 0 ? (
              <div className="stock-badge stock-in">In Stock ({prod.stock} units)</div>
            ) : (
              <div className="stock-badge stock-out">Out of Stock</div>
            )}

            {prod.stock > 0 && (
              <div className="add-qty-wrapper">
                <input 
                  type="number" 
                  min="1" 
                  max={prod.stock} 
                  value={qty} 
                  onChange={(e) => setQty(e.target.value)} 
                  className="qty-input"
                />
                <button className="btn-large-add" onClick={handleAddToCart}>Add to Cart</button>
              </div>
            )}
          </div>
        </div>

        <div className="reviews-section">
          <h2 className="section-title">Customer Reviews</h2>
          
          {user && (
            <form className="profile-card" style={{marginBottom: '2rem', maxWidth: '600px'}} onSubmit={handleAddReview}>
              <h3 style={{marginBottom:'1rem'}}>Write a Review</h3>
              <div style={{marginBottom:'1rem'}}>
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>
              <div className="auth-input-group">
                <textarea 
                  rows="4" 
                  placeholder="Share your experience..." 
                  required 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <button type="submit" className="auth-btn">Submit Review</button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p style={{color: 'var(--shop-text-muted)'}}>No reviews yet.</p>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              {reviews.map(rev => (
                <div key={rev._id} style={{padding:'1.5rem', border:'1px solid var(--shop-border)', borderRadius:'12px', background:'white'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'0.5rem'}}>
                    <strong>{rev.user?.name || "Unknown"}</strong>
                    <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                      <StarRating rating={rev.rating} readonly />
                      {(user?._id === rev.user?._id || user?.isAdmin) && (
                        <button onClick={() => handleDeleteReview(rev._id)} className="btn-icon">🗑️</button>
                      )}
                    </div>
                  </div>
                  <p style={{margin:0, color:'var(--shop-text)'}}>{rev.comment}</p>
                  <em style={{fontSize:'0.8rem', color:'var(--shop-text-muted)', display:'block', marginTop:'0.5rem'}}>
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </em>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
