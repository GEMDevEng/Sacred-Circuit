import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/common/Layout';
import LandingPage from './components/landing/LandingPage';
import ChatbotPage from './components/chatbot/ChatbotPage';
import ReflectionPage from './components/landing/ReflectionPage';
import AboutPage from './components/landing/AboutPage';
import PrivacyPage from './components/landing/PrivacyPage';
import NotFoundPage from './components/landing/NotFoundPage';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="reflection" element={<ReflectionPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;