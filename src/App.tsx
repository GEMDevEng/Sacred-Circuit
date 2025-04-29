import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth';

import Layout from './components/common/Layout';
import LandingPage from './components/landing/LandingPage';
import ChatbotPage from './components/chatbot/ChatbotPage';
import ReflectionPage from './components/landing/ReflectionPage';
import AboutPage from './components/landing/AboutPage';
import PrivacyPage from './components/landing/PrivacyPage';
import NotFoundPage from './components/landing/NotFoundPage';

// Auth pages
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';

// Profile pages
import { ProfilePage } from './components/profile';

function App() {
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<LandingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy" element={<PrivacyPage />} />

            {/* Authentication routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected routes */}
            <Route
              path="chatbot"
              element={
                <ProtectedRoute>
                  <ChatbotPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reflection"
              element={
                <ProtectedRoute>
                  <ReflectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;