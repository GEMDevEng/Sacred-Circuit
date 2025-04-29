import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SkipToContent from './SkipToContent';

/**
 * Main layout component that wraps all pages
 * Includes skip to content link for accessibility
 * and sets up the main content area with proper ID for screen readers
 */
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SkipToContent />
      <Header />
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;