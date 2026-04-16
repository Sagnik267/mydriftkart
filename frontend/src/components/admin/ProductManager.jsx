import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';

export default function ProductManager() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/products').then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const toggleVisibility = async (id, currentVis) => {
    // We update isVisible assuming model has it, or just a placeholder logic if simple hide/delete
    await axios.put(`/api/admin/products/${id}`, { isVisible: !currentVis });
    setProducts(products.map(p => p._id === id ? { ...p, isVisible: !currentVis } : p));
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
    await axios.delete(`/api/admin/products/${id}`);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="admin-container-block">
      <h2>🛍️ Product Management</h2>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: 'var(--border)' }}>
            <th style={{ padding: '12px' }}>Product Name</th>
            <th style={{ padding: '12px' }}>Shopkeeper</th>
            <th style={{ padding: '12px' }}>Category</th>
            <th style={{ padding: '12px' }}>Price</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px' }}>{product.name}</td>
              <td style={{ padding: '12px' }}>{product.shopkeeper?.name || 'N/A'}</td>
              <td style={{ padding: '12px' }}>{product.category?.name || product.category}</td>
              <td style={{ padding: '12px' }}>${product.price}</td>
              <td style={{ padding: '12px', display: 'flex', gap: '5px' }}>
                <button onClick={() => toggleVisibility(product._id, product.isVisible)}>
                  {product.isVisible === false ? 'Unhide' : 'Hide'}
                </button>
                <button onClick={() => deleteProduct(product._id)} style={{ background: 'red', color: 'white' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
