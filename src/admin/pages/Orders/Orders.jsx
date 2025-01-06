import React, { useContext } from 'react'
import './Orders.css'
import axios from "axios"
import { toast } from "react-toastify"
import { useState } from 'react'
import { useEffect } from 'react'
import {assets} from "../../assets/admin_assets/assets"
import { StoreContext } from '../../../context/StoreContext'

const Orders = () => {

  const [orders,setOrders]=useState([]);
  const { url } = useContext(StoreContext);

  const fetchAllOrders=async()=>{
    const response=await axios.get(url+"/api/admin/orders/all",{headers:{Authorization:`Bearer ${token}`}});
    if(response.data.success){
      setOrders(response.data.data);
    }
    else{
      toast.error("Unexpected error")
    }
  }


  const statusHandler=async(event,orderId)=>{
    const response=await axios.put(url+"/api/admin/orders/update",{
      orderId,
      status:event.target.value
    },{headers:{Authorization:`Bearer ${token}`}});
    if(response.data.success){
      await fetchAllOrders();
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.slice().reverse().map((order,index)=>(
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item,index)=>{
                  if(index===order.items.length-1){
                    return item.name+" X "+item.quantity
                  }
                  else{
                    return item.name+" X "+item.quantity+", " 
                  }
                })}
              </p>
              <p className="order-item-name">{order.address.firstName+" "+order.address.lastName}</p>
              <div className="order-item-address">
              <p >{order.address.block+", "}</p>
              <p>{order.address.roomNo}</p>
              {/* <p>{+", "+order.address.state+", "+order.address.country+", "+order.address.pincode}</p> */}
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>&#8377;{order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="filling happiness on a Plate">Filling happiness</option>
              <option value="Reaching you">Reaching you</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}


export default Orders
