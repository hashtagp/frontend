import React from 'react'
import './AdminNavbar.css'
import { assets } from '../../assets/admin_assets/assets'
import logo from "../../../assets/logo.svg"

const AdminNavbar = () => {
  return (
    <>
    <div className="admin-navbar">
        <img className='admin-logo' src={logo} alt="" />
        <img className="admin-profile" src={assets.profile_image} alt="" />
    </div>
    </>
  )
}

export default AdminNavbar