import React, { useContext, useEffect,useState } from 'react'
import "./Banner.css"
import { assets } from '../../assets/admin_assets/assets'
import { StoreContext } from '../../../context/StoreContext'
import axios from "axios"
import { toast } from 'react-toastify'

const Banner = () => {

    const [image,setImage]=useState(false);
    const [disable,setdisable] = useState(false);
    const { url,token } = useContext(StoreContext);
    const [data,setData]=useState({
    name:"",
  })
  const [bannerList,setBannerList]=useState([])

  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const onSubmitHandler=async(event)=>{
    event.preventDefault();
    setdisable(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', data.name);
    const response=await axios.post(`${url}/api/admin/add/banner`,formData,{headers:{Authorization:`Bearer ${token}`}});
    if(response.data.success){
      setData({
        name:"",
      })
      setImage(false)
      setdisable(false)
      toast.success(response.data.message)
    }
    else{
      setdisable(false)
      toast.error(response.data.message)
    }
  }

  const removeBanner=async(id)=>{ 
    setdisable(true);
    const response=await axios.delete(`${url}/api/admin/delete/banner/${id}`,{headers:{Authorization:`Bearer ${token}`}});
    if(response.data.success){
      setdisable(false);
      toast.success(response.data.message);
    }
    else{
      setdisable(false);
      toast.error(response.data.message);
    }
  }


  useEffect(()=>{
    const fetchData=async()=>{
      const response=await axios.get(`${url}/api/admin/get/banner`);
      if(response.data.success){
        console.log(response.data.data);
        setBannerList(response.data.data)
      }
    }
    fetchData();
  },[url,disable])

  return (
    <div className="banner-details">
    <div className="add-banner">
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className="add-banner-product-name flex-col">
                <p>Banner name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Type here' />
            </div>
            <div className="add-banner-img-upload flex-col">
                <p>Banner Image</p>
                <label htmlFor="image">
                <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
                </label>
                <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
            </div>
            <button type="submit" className='save-btn' disabled={disable}>SAVE</button>
        </form>
    </div> 
    <div className="banner-list-table">
          <div className="list-table-format title">
            Banner Details:
          </div>
          {bannerList.map((banner, index) => {
              return (
                <div key={index} className='list-table-format'>
                  <img src={banner.image} alt="" />
                  <div>
                  <p>{banner.name}</p>
                  <p onClick={() => removeBanner(banner._id)} className='cursor' disabled={disable}>Delete</p>
                  </div>
                </div>
              )
            }
            )}
        </div>
  </div>
  )
}

export default Banner
