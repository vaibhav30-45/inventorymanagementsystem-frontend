import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaBox, FaDollarSign, FaUsers, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MainContent from './MainContent';
import '../styles/Dashboard.css';
import LoginForm from './LoginForm';
import Inventory from './Inventory';
import Sales from './Sales';
import Customer from './Customer';

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
            <li className={location.pathname === '/inventory' ? 'active' : ''}>
              <Link to='/inventory' onClick={handleMenuItemClick}>
                <FaBox className='nav-icon' />
                <span className='nav-text'>Inventory</span>
              </Link>
            </li>
            <li className={location.pathname === '/sales' ? 'active' : ''}>
              <Link to='/sales' onClick={handleMenuItemClick}>
                <FaDollarSign className='nav-icon' />
                <span className='nav-text'>Sales</span>
              </Link>
            </li>
            <li className={location.pathname === '/customers' ? 'active' : ''}>
              <Link to='/customers' onClick={handleMenuItemClick}>
                <FaUsers className='nav-icon' />
                <span className='nav-text'>Customers</span>
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
            <Route path='/' element={<MainContent />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/inventory' element={<Inventory />} />
            <Route path='/sales' element={<Sales />} />
            <Route path='/customers' element={<Customer />} />
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