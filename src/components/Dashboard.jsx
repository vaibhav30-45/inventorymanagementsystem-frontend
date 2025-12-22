import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaBox, FaDollarSign, FaUsers, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaCog, FaShoppingCart, FaFileInvoice, FaReceipt ,FaTruck,
  FaTools,
  FaLeaf, } from 'react-icons/fa';
import MainContent from './MainContent';
import '../styles/Dashboard.css';
import LoginForm from './LoginForm';
import Inventory from './Inventory';
import Sales from './Sales';
import Customer from './Customer';
import Product from './Product';
import Purchasing from './Purchasing';
import Receipt from './Receipt';
import Settings from './Settings';
import Hardware from "./Hardware";
import Pesticide from "./Pesticide";
import Suppliers from "./Suppliers";
import Billing from './Billing';  

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const location = useLocation();

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on mobile when a menu item is clicked
  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  useEffect(() => {
  // Always close sidebar after navigation (login, page change)
  setIsSidebarOpen(false);
}, [location.pathname]);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div className='dashboard-container'>
      
      {/* Mobile Header */}
      <header className='mobile-header'>
        <button className='menu-toggle' onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className='logo'>Inventory System</div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <div className='sidebar-header'>
         
        </div>
        <nav className='sidebar-nav'>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to='/' onClick={handleMenuItemClick}>
                <FaHome className='nav-icon' />
                <span className='nav-text'>Dashboard</span>
              </Link>
            </li>
            <li className={location.pathname.includes("/dashboard/inventory") ? 'active' : ''}>
              <Link to='/dashboard/inventory' onClick={handleMenuItemClick}>
                <FaBox className='nav-icon' />
                <span className='nav-text'>Inventory</span>
              </Link>
            </li>
            <li className={location.pathname.includes("/dashboard/sales") ? 'active' : ''}>
              <Link to='/dashboard/sales' onClick={handleMenuItemClick}>
                <FaDollarSign className='nav-icon' />
                <span className='nav-text'>Sales</span>
              </Link>
            </li>
            <li className={location.pathname.includes("/dashboard/customers") ? 'active' : ''}>
              <Link to='/dashboard/customers' onClick={handleMenuItemClick}>
                <FaUsers className='nav-icon' />
                <span className='nav-text'>Customers</span>
                
              </Link>
            </li>
            <li className={location.pathname.includes("/dashboard/hardware") ? "active" : ""}>
              <Link to="/dashboard/hardware" onClick={handleMenuItemClick}>
                <FaTools className="nav-icon" />
                <span className="nav-text">Hardware</span>
              </Link>
            </li>

            <li className={location.pathname.includes("/dashboard/pesticide") ? "active" : ""}>
              <Link to="/dashboard/pesticide" onClick={handleMenuItemClick}>
                <FaLeaf className="nav-icon" />
                <span className="nav-text">Pesticide</span>
              </Link>
            </li>
            <li className={location.pathname.includes("/dashboard/suppliers") ? "active" : ""}>
              <Link to="/dashboard/suppliers" onClick={handleMenuItemClick}>
                <FaTruck className="nav-icon" />
                <span className="nav-text">Suppliers</span>
              </Link>
            </li>
            <li className={location.pathname.includes("/dashboard/billing") ? "active" : ""}>
              <Link to="/dashboard/billing" onClick={handleMenuItemClick}>
                <FaDollarSign className="nav-icon" />
                <span className="nav-text">Billing</span>
              </Link>
            </li>
              <li className={location.pathname.includes("/dashboard/product") ? "active" : ""   }>
              <Link to='/dashboard/product' onClick={handleMenuItemClick}>
                <FaBox className='nav-icon' />
                <span className='nav-text'>Product</span>
                
              </Link>
            </li>
              <li className={location.pathname.includes("/dashboard/purchasing") ? "active" : ""}>
              <Link to='/dashboard/purchasing' onClick={handleMenuItemClick}>
                <FaShoppingCart className='nav-icon' />
                <span className='nav-text'>Purchasing</span>
                
              </Link>
            </li>
              {/* <li className={location.pathname === '/receipt' ? 'active' : ''}>
              <Link to='/receipt' onClick={handleMenuItemClick}>
                <FaReceipt className='nav-icon' />
                <span className='nav-text'>Bill Receipt</span>
                
              </Link>
            </li> */}
              <li className={location.pathname.includes("/dashboard/settings") ? "active" : ""}>
              <Link to='/dashboard/settings' onClick={handleMenuItemClick}>
                <FaCog className='nav-icon' />
                <span className='nav-text'>Settings</span>
                
              </Link>
            </li>
          </ul>
          
          <ul className='mt-auto'>
            {/* <li>
              <Link to='/logout' className='logout-btn' onClick={handleMenuItemClick}>
                <FaSignOutAlt className='nav-icon' />
                <span className='nav-text'>Logout</span>
              </Link>
            </li> */}
            {!isMobile && (
              <li>
                <button className='toggle-sidebar' onClick={toggleSidebar}>
                  {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${!isSidebarOpen ? 'expanded' : ''}`}>
        <div className='content-wrapper'>
          <Routes>
  <Route index element={<MainContent />} />
  <Route path="inventory" element={<Inventory />} />
  <Route path="sales" element={<Sales />} />
  <Route path="customers" element={<Customer />} />
  <Route path="product" element={<Product />} />
  <Route path="purchasing" element={<Purchasing />} />
  <Route path="settings" element={<Settings />} />
  <Route path="hardware" element={<Hardware />} />
  <Route path="pesticide" element={<Pesticide />} />
  <Route path="suppliers" element={<Suppliers />} />
  <Route path="billing" element={<Billing />} />
</Routes>



          
        </div>
        
      </main>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div className='overlay' onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default Dashboard;