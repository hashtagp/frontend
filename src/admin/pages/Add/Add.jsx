import React, { useContext, useEffect,useState } from 'react'
import './Add.css'
import { assets } from '../../assets/admin_assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'
import { StoreContext } from '../../../context/StoreContext'

const Add = () => {

  const [image,setImage]=useState(false);
  const { url,token } = useContext(StoreContext);
    const [data,setData]=useState({
    name:"",
    description:"",
    price:"",
    category:"Pens",
    discount:""
  })

  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const onSubmitHandler=async(event)=>{
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('image', image);
    formData.append('discount', Number(data.discount));
    const response=await axios.post(`${url}/api/admin/add`,formData,{headers:{Authorization:`Bearer ${token}`}});
    if(response.data.success){
      setData({
        name:"",
        description:"",
        price:"",
        category:"Pens",
        discount:""
      })
      setImage(false)
      toast.success(response.data.message)
    }
    else{
      toast.error(response.data.message)
    }
    
  }
//   useEffect(()=>{
// console.log(data)
//   },[data])

  return (
    <div>
      <div className="add">
        <form className='flex-col' onSubmit={onSubmitHandler}>
          <div className="add-img-upload flex-col">
            <p>Upload Image</p>
            <label htmlFor="image">
              <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
            </label>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
          </div>
          <div className="add-product-name flex-col">
            <p>Product name</p>
            <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Type here' />
          </div>
          <div className="add-product-description flex-col">
            <p>Product description</p>
            <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
          </div>
          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Product category</p>
              <select onChange={onChangeHandler} name="category" >
                <option value="Pens">Pens</option>
                <option value="Mug">Mug</option>
                <option value="Diary">Diary</option>
                <option value="Bottle">Bottle</option>
                <option value="3-D printing models">3-D printing models</option>
                <option value="Keychains">Keychains</option>
                <option value="Mobile stand">Mobile stand</option>
                <option value="Pen stand">Pen stand</option>
                <option value="Bonsai plant">Bonsai plant</option>
              </select>
            </div>
            <div className="add-price flex-col">
              <p>Product price</p>
              <input onChange={onChangeHandler} value={data.price} type="Number" name="price" placeholder="₹ 20"  />
            </div>
          </div>
          <div className="add-discount ">
            <p>Discount</p>
            <input onChange={onChangeHandler} value={data.discount} type="Number" name="discount" placeholder="Percentage"  />
          </div>
          <button type="submit" className='add-btn'>ADD</button>
        </form>
      </div>
    </div>
  )
}

export default Add
