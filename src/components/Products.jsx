import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Products.css';
import { StoreContext } from '../context/StoreContext';
import Item from "./Item";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { url } = useContext(StoreContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || 'All';
  const [maxDiscount, setMaxDiscount] = useState(0);

  useEffect(() => {
    axios.get(`${url}/api/products/allProducts`)
      .then(response => {
        setProducts(response.data.products);
        console.log("Products fetched successfully:", response.data);

        // Calculate max discount after products are fetched
        const maxDiscountValue = Math.max(...response.data.products.map((item) => ((item.discount / item.price) * 100)));
        setMaxDiscount(maxDiscountValue);
        console.log("Max Discount:", maxDiscountValue);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, [url]);
  return (
    <section className="products">
      <br/>
      <p className="discount">Upto {`${maxDiscount}`}% off on selected products</p>
      {!products.length && (
        <div className='loading'>
          <div className="spinner"></div>
        </div>
      )}
      <div className="product-grid">
        {products
          .filter(item => category === 'All' || item.category === category)
          .map((item, index) => (
            <Item 
              key={index} 
              id={item._id} 
              name={item.name} 
              price={item.price} 
              image={item.image} 
              discount={item.discount}
              gst={item.gst}
            />
          ))
        }
      </div>
    </section>
  );
};

export default Products;