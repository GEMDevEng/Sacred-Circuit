import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-50 border-t border-gray-200 py-8 mt-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link to="/" className="text-xl font-serif text-primary-600 font-semibold flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
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
            <p className="mt-4 text-neutral-600 max-w-md">
              A sanctuary for your spiritual wellness journey, providing guidance, reflection, and support.
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-neutral-600 hover:text-primary-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:contact@sacredhealinghub.com" 
                    className="text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-neutral-600">
          <p>© {new Date().getFullYear()} Sacred Healing Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;