import React, { useContext, useState } from 'react';
import './Item.css';
import { StoreContext } from '../context/StoreContext';
import add_icon_white from "../assets/add_icon_white.png";
import add_icon_green from "../assets/add_icon_green.png";
import remove_icon_red from "../assets/remove_icon_red.png";
import { useNavigate } from 'react-router-dom';

const Item = ({ id, name, price, image, discount, gst }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const [disable,setDisable] = useState(false);
  const navigate = useNavigate();

  const handleIconClick = (e, action) => {
    e.stopPropagation();
    setDisable(true);
    action();
    setDisable(false);
  };

  const item = { id, name, price, image, discount, gst  };

  return (
    <div onClick={()=>navigate(`/product/${id}`)} className='product-item'>
      <div className="product">
        <img className='product-item-image' src={image} alt='' />
        {
          !cartItems[id]
          ?<img className='add' onClick={(e) => handleIconClick(e, () => addToCart(item))} src={add_icon_white} alt="" disabled={disable}/>
          :<div className='product-item-Count'>
            <img className="add1" onClick={(e) => handleIconClick(e, () => removeFromCart(id))} src={remove_icon_red} alt='' disabled={disable}/>
            <p>{cartItems[id].quantity}</p>
            <img className="add2" onClick={(e) => handleIconClick(e, () => addToCart(item))} src={add_icon_green} alt='' disabled={disable}/>
          </div>
        }
      </div>
      <div className="product-item-info">
        <div className="product">
          <p>{name}</p>
        </div>
        <span><del>{price}</del></span>&nbsp;
        <a className='product-item-price'>&#8377;{price-discount}</a>
      </div>
    </div>
  );
}

export default Item;