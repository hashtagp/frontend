import React, { useContext } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/admin_assets/assets'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { StoreContext } from '../../../context/StoreContext'

const Sidebar = () => {

  const [activeRoute, setActiveRoute] = useState('/admin/add');
  const { token } = useContext(StoreContext);

  const logoutHandler = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/admin' className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin')} end>
            <img src={assets.dashboard_icon} alt="" />
            <p>Dashboard</p>
            <span>&#10148;</span>
        </NavLink>
        <NavLink to='/admin/add' className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/add')}>
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
            <span>&#10148;</span>
        </NavLink>
        <NavLink to="/admin/list" className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/list')}>
            <img src={assets.list_icon} alt="" />
            <p>List Items</p>
            <span>&#10148;</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/orders')}>
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
            <span>&#10148;</span>
        </NavLink>
        <NavLink to="/admin/banner" className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/banner')}>
            <img src={assets.banner_icon} alt="" />
            <p>Banner</p>
            <span>&#10148;</span>
        </NavLink>
        <NavLink to="/admin/coupon" className={({ isActive }) => isActive ? 'sidebar-option active' : 'sidebar-option'} onClick={() => setActiveRoute('/admin/coupon')}>
            <img src={assets.banner_icon} alt="" />
            <p>Coupon</p>
            <span>&#10148;</span>
        </NavLink>
        <div className="sidebar-option logout" onClick={() => logoutHandler()}>
            <img src={assets.logout_icon} alt="" />
            <p>Logout</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar