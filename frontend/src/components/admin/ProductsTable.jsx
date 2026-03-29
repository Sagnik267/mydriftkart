import React, { useEffect, useState } from "react";

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", shop: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Product deleted successfully");
        setProducts(products.filter(p => p._id !== id));
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch (err) {
      showToast("Server Error", "error");
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", shop: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({ name: product.name, price: product.price, shop: product.shop || "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const isEditing = !!editingId;
      const url = isEditing 
        ? `http://localhost:5000/api/admin/products/${editingId}`
        : `http://localhost:5000/api/admin/products`;
        
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        showToast(isEditing ? "Product updated" : "Product created");
        setIsModalOpen(false);
        fetchProducts();
      } else {
        showToast(isEditing ? "Failed to update" : "Failed to create", "error");
      }
    } catch (err) {
      showToast("Server Error", "error");
    }
  };

  if (loading) return <div style={{color: 'var(--admin-text-muted)'}}>Loading products...</div>;

  return (
    <>
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2>Product Management</h2>
          <button className="admin-btn admin-btn-success" onClick={openAddModal}>
            + Add Product
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Shop</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center'}}>No products found.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>₹{product.price}</td>
                    <td>{product.shop || "-"}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="admin-btn" onClick={() => openEditModal(product)}>
                          Edit
                        </button>
                        <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(product._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Wireless Mouse"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input 
                  type="number" 
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g. 599"
                />
              </div>
              <div className="form-group">
                <label>Shop Name</label>
                <input 
                  type="text" 
                  value={formData.shop}
                  onChange={e => setFormData({...formData, shop: e.target.value})}
                  placeholder="e.g. Sharma Electronics"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-success">
                  {editingId ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
