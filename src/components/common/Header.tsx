import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Public links available to all users
  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
  ];

  // Protected links only available to authenticated users
  const protectedLinks = [
    { to: '/chatbot', label: 'Chatbot' },
    { to: '/reflection', label: 'Reflection' },
  ];

  // Determine which links to show based on authentication status
  const links = isAuthenticated
    ? [...publicLinks, ...protectedLinks]
    : publicLinks;

  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm">
      <div className="container-custom py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl md:text-2xl font-serif text-primary-600 font-semibold flex items-center gap-2"
          onClick={closeMenu}
          aria-label="Sacred Healing Hub - Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          Sacred Healing Hub
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary-700 font-medium border-b-2 border-primary'
                  : 'text-neutral-800 hover:text-primary-600 transition-colors'
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Authentication Links */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center space-x-1 ${
                    isActive
                      ? 'text-primary-700 font-medium border-b-2 border-primary'
                      : 'text-neutral-800 hover:text-primary-600 transition-colors'
                  }`
                }
              >
                <User size={18} />
                <span>{user?.healingName || 'Profile'}</span>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center space-x-1 text-neutral-800 hover:text-primary-600 transition-colors"
                aria-label="Log out"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center space-x-1 ${
                    isActive
                      ? 'text-primary-700 font-medium border-b-2 border-primary'
                      : 'text-neutral-800 hover:text-primary-600 transition-colors'
                  }`
                }
              >
                <LogIn size={18} />
                <span>Login</span>
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `flex items-center space-x-1 ${
                    isActive
                      ? 'text-primary-700 font-medium border-b-2 border-primary'
                      : 'text-neutral-800 hover:text-primary-600 transition-colors'
                  }`
                }
              >
                <span>Register</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden text-neutral-800 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-0 top-16 bg-white shadow-md md:hidden z-50"
            >
              <nav className="flex flex-col py-4">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `px-6 py-3 ${
                        isActive
                          ? 'text-primary-700 font-medium bg-primary-50'
                          : 'text-neutral-800 hover:bg-gray-50'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {/* Mobile Authentication Links */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  {isAuthenticated ? (
                    <>
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `px-6 py-3 flex items-center space-x-2 ${
                            isActive
                              ? 'text-primary-700 font-medium bg-primary-50'
                              : 'text-neutral-800 hover:bg-gray-50'
                          }`
                        }
                        onClick={closeMenu}
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </NavLink>

                      <button
                        type="button"
                        onClick={() => {
                          closeMenu();
                          handleLogout();
                        }}
                        className="w-full text-left px-6 py-3 flex items-center space-x-2 text-neutral-800 hover:bg-gray-50"
                        aria-label="Log out"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          `px-6 py-3 flex items-center space-x-2 ${
                            isActive
                              ? 'text-primary-700 font-medium bg-primary-50'
                              : 'text-neutral-800 hover:bg-gray-50'
                          }`
                        }
                        onClick={closeMenu}
                      >
                        <LogIn size={18} />
                        <span>Login</span>
                      </NavLink>

                      <NavLink
                        to="/register"
                        className={({ isActive }) =>
                          `px-6 py-3 flex items-center space-x-2 ${
                            isActive
                              ? 'text-primary-700 font-medium bg-primary-50'
                              : 'text-neutral-800 hover:bg-gray-50'
                          }`
                        }
                        onClick={closeMenu}
                      >
                        <span>Register</span>
                      </NavLink>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;