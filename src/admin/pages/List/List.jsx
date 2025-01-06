import React, { useState,useEffect, useContext } from 'react'
import './List.css'
import axios from "axios"
import {toast} from "react-toastify"
import { StoreContext } from '../../../context/StoreContext'

const List = () => {

  const[list,setList]=useState([]);
  const { url,token } = useContext(StoreContext);

  const fetchlist=async()=>{
    const response=await axios.get(`${url}/api/admin/products`,{headers:{Authorization:`Bearer ${token}`}});
    console.log("response is: ",response)
    if(response.data.success){
      setList(response.data.products);
      console.log("list is:  ",list)
    }
    else{
      toast.error("Error")
    }
  }

  const removeFood=async(foodId)=>{
    const response=await axios.post(`${url}/api/admin/delete`,{id:foodId},{headers:{Authorization:`Bearer ${token}`}});
    await fetchlist();
    if(response.data.success){
      toast.success(response.data.message)
    }
    else{
      toast.error("Error")
    }
  }

  useEffect(()=>{
    fetchlist();
  },[])

  return (
    <div>
      <div className="list add flex-col">
        <p>All foods list</p>
        <div className="list-table">
          <div className="list-table-format title">
            <p>Image</p>
            <p>Name</p>
            <p>Category</p>
            <p>Price</p>
            <p>Discount</p>
            <p>Action</p>
          </div>
          {list.map((item,index)=>{
            return(
              <div key={index} className='list-table-format'>
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{item.price}</p>
                <p>{item.discount}&nbsp;</p>
                <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default List
