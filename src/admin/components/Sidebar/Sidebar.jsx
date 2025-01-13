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

  // useEffect(() => {
  //   navigate('/admin/add')
  // }, [navigate])

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/admin' className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin')} end>
            <img src={assets.dashboard_icon} alt="" />
            <p>Dashboard</p>
        </NavLink>
        <NavLink to='/admin/add' className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/add')}>
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to="/admin/list" className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/list')}>
            <img src={assets.list_icon} alt="" />
            <p>List Items</p>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/orders')}>
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>
        <NavLink to="/admin/banner" className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/banner')}>
            <img src={assets.banner_icon} alt="" />
            <p>Banner</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar