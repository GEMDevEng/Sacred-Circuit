import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import PageTransition from '../common/PageTransition';

/**
 * Login page component
 */
const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageTransition>
      <section className="py-12 px-4">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden md:flex flex-col justify-center"
              >
                <h1 className="text-3xl md:text-4xl font-serif text-primary-600 mb-4">
                  Welcome Back
                </h1>
                <p className="text-neutral-600 mb-6">
                  Log in to continue your sacred healing journey. Your privacy and security are our highest priorities.
                </p>
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <h3 className="text-lg font-medium text-primary-700 mb-2">Your Sacred Space</h3>
                  <p className="text-neutral-600 text-sm">
                    This platform is designed to provide a safe, private space for your healing journey.
                    All conversations and reflections are kept confidential.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <LoginForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default LoginPage;
