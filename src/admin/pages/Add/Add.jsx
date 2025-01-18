// Add.js
import React, { useContext, useState } from 'react';
import './Add.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../../context/StoreContext';

const Add = () => {
  const [image, setImage] = useState(false);
  const [disable, setDisable] = useState(false);
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Pens',
    discount: '',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setDisable(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('image', image);
    formData.append('discount', Number(data.discount));

    try {
      const response = await axios.post(`${url}/api/admin/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Pens',
          discount: '',
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="add-container">
      <h1>Add <span>Products</span></h1>
      <p className="subtitle">Add Your Products!</p>
      <form className="add-form" onSubmit={onSubmitHandler}>
        <div className="left-section">
          <div className="input-group">
            <label>Title:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter product title"
              value={data.name}
              onChange={onChangeHandler}
              required
            />
          </div>

          <div className="input-group">
            <label>Description:</label>
            <textarea
              name="description"
              rows="6"
              placeholder="Enter Product Description"
              value={data.description}
              onChange={onChangeHandler}
              required
            ></textarea>
          </div>

          <div className="input-group">
            <label>Media:</label>
            <label htmlFor="image" className="upload-label">
              {image ? <img src={URL.createObjectURL(image)} alt="Upload Preview" /> : 'Add Media from URL'}
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              hidden
              required
            />
          </div>
        </div>

        <div className="right-section">
          <div className="input-group">
            <label>Organization:</label>
            <input
              type="text"
              placeholder="Dev Creations and Solutions"
              disabled
            />
          </div>

          <div className="input-group">
            <label>Discount (%):</label>
            <input
              type="text"
              placeholder="e.g., 10,30"
              name='discount'
              value={data.discount}
              onChange={onChangeHandler}
            />
          </div>

          <div className="input-group">
            <label>Product Type:</label>
            <select name="category" value={data.category} onChange={onChangeHandler}>
              <option value="Pens">Pens</option>
              <option value="Mug">Mug</option>
              <option value="Diary">Diary</option>
              <option value="Bottle">Bottle</option>
              <option value="3-D">3-D printing models</option>
              <option value="Keychains">Keychains</option>
              <option value="Mobile-stand">Mobile stand</option>
              <option value="Pen-stand">Pen stand</option>
              <option value="Bonsai-plant">Bonsai plant</option>
              <option value="Monstera-plant">Monstera plant</option>
              <option value="Bamboo-plant">Bamboo plant</option>
              <option value="Jade-plant">Jade plant</option>
            </select>
          </div>

          <div className="input-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              placeholder="e.g., 200 Rs"
              value={data.price}
              onChange={onChangeHandler}
              required
            />
          </div>
          <button type="submit" className="add-btn" disabled={disable}>ADD</button>
        </div>
      </form>
    </div>
  );
};

export default Add;
