import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Modal from './Modal';
import FeedbackForm from './FeedbackForm';

/**
 * Feedback button component that opens a modal with the feedback form
 */
const FeedbackButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-10"
        aria-label="Provide feedback"
      >
        <MessageSquare size={24} />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Share Your Feedback"
        size="md"
      >
        <FeedbackForm onClose={closeModal} />
      </Modal>
    </>
  );
};

export default FeedbackButton;
