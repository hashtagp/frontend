import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext';
import './Coupon.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { FiCheck, FiX } from 'react-icons/fi';

const Coupon = () => {
  const { url, token } = useContext(StoreContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '0',
    maxDiscount: '',
    isActive: true,
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    usageLimit: '',
    userUsageLimit: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if(token){
    fetchCoupons();
    }
  }, [token]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/coupon/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '0',
      maxDiscount: '',
      isActive: true,
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      usageLimit: '',
      userUsageLimit: ''
    });
    setFormErrors({});
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user makes a change
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.code.trim()) {
      errors.code = 'Coupon code is required';
    }
    
    if (!formData.discountValue || isNaN(formData.discountValue) || Number(formData.discountValue) <= 0) {
      errors.discountValue = 'Valid discount value is required';
    } else if (formData.discountType === 'percentage' && Number(formData.discountValue) > 100) {
      errors.discountValue = 'Percentage cannot exceed 100%';
    }
    
    if (formData.minPurchase && (isNaN(formData.minPurchase) || Number(formData.minPurchase) < 0)) {
      errors.minPurchase = 'Minimum purchase must be a positive number';
    }
    
    if (formData.discountType === 'percentage' && formData.maxDiscount && 
        (isNaN(formData.maxDiscount) || Number(formData.maxDiscount) <= 0)) {
      errors.maxDiscount = 'Maximum discount must be a positive number';
    }
    
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) <= new Date()) {
      errors.expiryDate = 'Expiry date must be in the future';
    }
    
    if (formData.usageLimit && (isNaN(formData.usageLimit) || Number(formData.usageLimit) <= 0)) {
      errors.usageLimit = 'Usage limit must be a positive number';
    }
    
    if (formData.userUsageLimit && (isNaN(formData.userUsageLimit) || Number(formData.userUsageLimit) <= 0)) {
      errors.userUsageLimit = 'User usage limit must be a positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const couponData = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minPurchase: formData.minPurchase ? Number(formData.minPurchase) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        userUsageLimit: formData.userUsageLimit ? Number(formData.userUsageLimit) : null,
      };
      
      let response;
      
      if (editingId) {
        response = await axios.put(`${url}/api/coupon/update/admin/${editingId}`, couponData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post(`${url}/api/coupon/create/admin`, couponData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      if (response.data) {
        fetchCoupons();
        resetForm();
        setShowForm(false);
      }
    } catch (err) {
      console.error('Error saving coupon:', err);
      setFormErrors({
        ...formErrors,
        submit: err.response?.data?.message || 'Failed to save coupon. Please try again.'
      });
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minPurchase: String(coupon.minPurchase || '0'),
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : '',
      isActive: coupon.isActive,
      expiryDate: new Date(coupon.expiryDate),
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : '',
      userUsageLimit: coupon.userUsageLimit ? String(coupon.userUsageLimit) : ''
    });
    setEditingId(coupon._id);
    setShowForm(true);
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axios.patch(`${url}/api/coupon/${id}/toggle`, 
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update the local state
      setCoupons(coupons.map(coupon => 
        coupon._id === id ? { ...coupon, isActive: !currentStatus } : coupon
      ));
    } catch (err) {
      console.error('Error toggling coupon status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }
    
    try {
      await axios.delete(`${url}/api/coupon/delete/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setCoupons(coupons.filter(coupon => coupon._id !== id));
    } catch (err) {
      console.error('Error deleting coupon:', err);
      alert('Failed to delete coupon. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="coupon admin-section">
      <div className="coupon-header">
        <h3>Coupon <span>Management</span></h3>
        <button 
          className="add-coupon-btn" 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : 'Add New Coupon'}
          {showForm ? <FiX /> : <AiOutlinePlus />}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="coupon-form-container">
          <form onSubmit={handleSubmit} className="coupon-form">
            <h4>{editingId ? 'Edit Coupon' : 'Create New Coupon'}</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="code">Coupon Code*</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="e.g. SUMMER20"
                  className={formErrors.code ? 'error' : ''}
                />
                {formErrors.code && <div className="error-text">{formErrors.code}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="discountType">Discount Type*</label>
                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleFormChange}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="discountValue">
                  {formData.discountType === 'percentage' ? 'Discount Percentage*' : 'Discount Amount (₹)*'}
                </label>
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleFormChange}
                  placeholder={formData.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                  className={formErrors.discountValue ? 'error' : ''}
                />
                {formErrors.discountValue && <div className="error-text">{formErrors.discountValue}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="minPurchase">Minimum Purchase (₹)</label>
                <input
                  type="number"
                  id="minPurchase"
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleFormChange}
                  placeholder="e.g. 1000"
                  className={formErrors.minPurchase ? 'error' : ''}
                />
                {formErrors.minPurchase && <div className="error-text">{formErrors.minPurchase}</div>}
              </div>
            </div>

            <div className="form-row">
              {formData.discountType === 'percentage' && (
                <div className="form-group">
                  <label htmlFor="maxDiscount">Maximum Discount (₹)</label>
                  <input
                    type="number"
                    id="maxDiscount"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleFormChange}
                    placeholder="e.g. 1000 (optional)"
                    className={formErrors.maxDiscount ? 'error' : ''}
                  />
                  {formErrors.maxDiscount && <div className="error-text">{formErrors.maxDiscount}</div>}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date*</label>
                <DatePicker
                  id="expiryDate"
                  selected={formData.expiryDate}
                  onChange={(date) => setFormData({...formData, expiryDate: date})}
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                  className={formErrors.expiryDate ? 'error' : ''}
                />
                {formErrors.expiryDate && <div className="error-text">{formErrors.expiryDate}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="usageLimit">Total Usage Limit</label>
                <input
                  type="number"
                  id="usageLimit"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleFormChange}
                  placeholder="Leave empty for unlimited"
                  className={formErrors.usageLimit ? 'error' : ''}
                />
                {formErrors.usageLimit && <div className="error-text">{formErrors.usageLimit}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="userUsageLimit">Per User Limit</label>
                <input
                  type="number"
                  id="userUsageLimit"
                  name="userUsageLimit"
                  value={formData.userUsageLimit}
                  onChange={handleFormChange}
                  placeholder="Leave empty for unlimited"
                  className={formErrors.userUsageLimit ? 'error' : ''}
                />
                {formErrors.userUsageLimit && <div className="error-text">{formErrors.userUsageLimit}</div>}
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="isActive" className="checkbox-label">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                />
                <span>Active</span>
              </label>
            </div>

            {formErrors.submit && <div className="error-text submit-error">{formErrors.submit}</div>}

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn">
                {editingId ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading coupons...</div>
      ) : (
        <>
          {coupons.length === 0 ? (
            <div className="no-coupons">No coupons found. Create your first coupon!</div>
          ) : (
            <div className="coupon-list">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min. Purchase</th>
                    <th>Expiry</th>
                    <th>Usage</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className={coupon.isActive ? '' : 'inactive-coupon'}>
                      <td>{coupon.code}</td>
                      <td>
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}%` 
                          : `₹${coupon.discountValue}`}
                        {coupon.discountType === 'percentage' && coupon.maxDiscount && 
                          ` (Max: ₹${coupon.maxDiscount})`}
                      </td>
                      <td>{coupon.minPurchase > 0 ? `₹${coupon.minPurchase}` : 'None'}</td>
                      <td>
                        <span className={new Date(coupon.expiryDate) < new Date() ? 'expired' : ''}>
                          {formatDate(coupon.expiryDate)}
                        </span>
                      </td>
                      <td>
                        {coupon.usageCount} / {coupon.usageLimit ? coupon.usageLimit : '∞'}
                      </td>
                      <td>
                        <button 
                          className={`status-toggle ${coupon.isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleActive(coupon._id, coupon.isActive)}
                        >
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="actions">
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEdit(coupon)}
                        >
                          <AiOutlineEdit />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(coupon._id)}
                        >
                          <AiOutlineDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Coupon;