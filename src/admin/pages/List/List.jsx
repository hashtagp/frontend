import React, { useState, useEffect, useContext } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"
import { StoreContext } from '../../../context/StoreContext'

const List = () => {

  const [list, setList] = useState([]);
  const { url, token } = useContext(StoreContext);
  const [disable,setDisable] = useState(false);
  const [category, setCategory] = useState("All");

  const onChangeHandler = (event) => {
    const value = event.target.value;
    setCategory(value);
  }

  const fetchlist = async () => {
    const response = await axios.get(`${url}/api/admin/products`, { headers: { Authorization: `Bearer ${token}` } });
    console.log("response is: ", response)
    if (response.data.success) {
      setList(response.data.products);
      console.log("list is:  ", response.data.products)
    } else {
      toast.error("Error")
    }
  }

  const removeFood = async (foodId) => {
    setDisable(true);
    const response = await axios.post(`${url}/api/admin/delete`, { id: foodId }, { headers: { Authorization: `Bearer ${token}` } });
    await fetchlist();
    if (response.data.success) {
      setDisable(false);
      toast.success(response.data.message)
    } else {
      setDisable(false);
      toast.error("Error")
    }
  }

  useEffect(() => {
    if (token) {
      fetchlist();
    }
  }, [token])

  return (
    <div>
      <div className="list add flex-col">
        <h3>Products <span>inventory</span></h3>
        <div className="list-category flex-col mb-2">
          <p>Product category</p>
          <select onChange={onChangeHandler} name="category" >
            <option value="All">All</option>
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
        <div className="list-table">
          <div className="list-table-format title">
            <p>Image</p>
            <p>Name</p>
            <p>Category</p>
            <p>Price</p>
            <p>Discount</p>
            <p>Action</p>
          </div>
          {list.map((item, index) => {
            if (category === "All" || item.category === category) {
              return (
                <div key={index} className='list-table-format'>
                  <img src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>{item.price}</p>
                  <p>{item.discount}&nbsp;</p>
                  <p onClick={() => removeFood(item._id)} className='cursor' disabled={disable}>Delete</p>
                </div>
              )
            }
            return null;
          })}
        </div>
      </div>
    </div>
  )
}

export default List