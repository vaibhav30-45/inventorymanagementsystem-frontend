// LeftContent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine, 
  FaCog,
  FaChevronRight,
  FaChevronDown
} from 'react-icons/fa';
import '../styles/LeftContent.css';

const LeftContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  
  

  const toggleSubmenu = (index) => {
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  const handleNavigation = (path, hasSubmenu, index) => {
    if (hasSubmenu) {
      toggleSubmenu(index);
    } else {
      navigate(path);
  
      if (window.innerWidth < 768) {
        const leftDiv = document.querySelector('.left-div');
        if (leftDiv) leftDiv.classList.remove('mobile-visible');
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.classList.remove('visible');
      }
    }
  };


  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.submenu && item.submenu.some(subItem => location.pathname.startsWith(subItem.path))) {
        setExpandedMenu(index);
      }
    });
  }, [location]);

  return (
    <div className="sidebar">
      
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              className={`
                ${location.pathname === item.path ? 'active' : ''}
                ${item.submenu && item.submenu.some(subItem => location.pathname.startsWith(subItem.path)) ? 'active-parent' : ''}
              `}
            >
              <div 
                className="nav-item"
                onClick={() => handleNavigation(item.path, item.submenu?.length > 0, index)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-title">{item.title}</span>
                {item.submenu?.length > 0 && (
                  <span className="nav-arrow">
                    {expandedMenu === index ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                )}
              </div>
              
              {item.submenu?.length > 0 && expandedMenu === index && (
                <ul className="submenu">
                  {item.submenu.map((subItem, subIndex) => (
                    <li 
                      key={subIndex}
                      className={location.pathname === subItem.path ? 'active' : ''}
                      onClick={() => handleNavigation(subItem.path, false)}
                    >
                      {subItem.title}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default LeftContent;