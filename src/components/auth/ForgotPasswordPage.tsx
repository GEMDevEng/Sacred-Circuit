import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ForgotPasswordForm from './ForgotPasswordForm';
import PageTransition from '../common/PageTransition';

/**
 * Forgot password page component
 */
const ForgotPasswordPage = () => {
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
                  Reset Your Password
                </h1>
                <p className="text-neutral-600 mb-6">
                  Don't worry, it happens to the best of us. Enter your email address and we'll send you instructions to reset your password.
                </p>
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <h3 className="text-lg font-medium text-primary-700 mb-2">Secure Reset Process</h3>
                  <p className="text-neutral-600 text-sm">
                    We'll send a secure link to your email that will allow you to create a new password.
                    The link will expire after 24 hours for your security.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ForgotPasswordForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ForgotPasswordPage;
