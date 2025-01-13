import React, { useContext, useEffect,useState } from 'react'
import "./Banner.css"
import { assets } from '../../assets/admin_assets/assets'
import { StoreContext } from '../../../context/StoreContext'
import axios from "axios"
import { toast } from 'react-toastify'

const Banner = () => {

    const [image,setImage]=useState(false);
    const { url,token } = useContext(StoreContext);
    const [data,setData]=useState({
    name:"",
  })

  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const onSubmitHandler=async(event)=>{
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', data.name);
    const response=await axios.post(`${url}/api/admin/add/banner`,formData,{headers:{Authorization:`Bearer ${token}`}});
    if(response.data.success){
      setData({
        name:"",
      })
      setImage(false)
      toast.success(response.data.message)
    }
    else{
      toast.error(response.data.message)
    }
    
  }

  return (
    <div className="add-banner">
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className="add-banner-img-upload flex-col">
                <p>Banner Image</p>
                <label htmlFor="image">
                <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
                </label>
                <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
            </div>
            <div className="add-banner-product-name flex-col">
                <p>Banner name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Type here' />
            </div>
            <button type="submit" className='add-btn'>SAVE</button>
        </form>
    </div>            
  )
}

export default Banner
