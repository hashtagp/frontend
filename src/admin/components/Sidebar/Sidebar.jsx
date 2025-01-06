import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/admin_assets/assets'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {

  const [activeRoute, setActiveRoute] = useState('/admin/add');

  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/add')
  }, [navigate])

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/admin/add' className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/add')}>
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to="/admin/list" className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/list')}>
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/orders')}>
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar