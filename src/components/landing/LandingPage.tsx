import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../common/PageTransition';
import Button from '../common/Button';
import Modal from '../common/Modal';
import SacredIntakeForm from '../forms/SacredIntakeForm';
import { useABTest, getVariantContent, trackConversion } from '../../utils/abTesting';

const LandingPage = () => {
  // State for form modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formSubmissionSuccess, setFormSubmissionSuccess] = useState(false);

  // A/B Testing hooks
  const ctaTest = useABTest('landing_page_cta');
  const formIntroTest = useABTest('form_introduction');

  // Handle form button click with tracking
  const handleFormClick = () => {
    ctaTest.trackEvent('form_click');
    setIsFormModalOpen(true);
  };

  // Handle form submission success
  const handleFormSuccess = (formData: any) => {
    setFormSubmissionSuccess(true);
    ctaTest.trackEvent('form_complete');

    // Close modal after a delay
    setTimeout(() => {
      setIsFormModalOpen(false);
      setFormSubmissionSuccess(false);
    }, 3000);
  };

  // Handle modal close
  const handleModalClose = () => {
    if (!formSubmissionSuccess) {
      ctaTest.trackEvent('form_abandon');
    }
    setIsFormModalOpen(false);
  };

  // Get variant content for CTA
  const ctaContent = getVariantContent('landing_page_cta', {
    original: {
      title: 'Begin Your Healing Journey',
      subtitle: 'A sacred space for self-discovery, spiritual growth, and healing. Connect with guidance tailored to your personal journey.',
      buttonText: 'Start Your Healing Journey'
    },
    spiritual_focus: {
      title: 'Awaken Your Sacred Healing Path',
      subtitle: 'Step into a mystical realm of transformation where ancient wisdom meets modern guidance. Your soul\'s journey awaits.',
      buttonText: 'Enter Your Sacred Space'
    },
    urgency_focus: {
      title: 'Transform Your Life Today',
      subtitle: 'Join thousands who have already begun their healing transformation. Your journey to wellness starts now.',
      buttonText: 'Start Healing Now'
    }
  });

  // Get variant content for form introduction
  const formIntroContent = getVariantContent('form_introduction', {
    standard: {
      title: 'Your Sacred Intake Form',
      description: 'A gentle, thoughtful form designed to understand your unique healing journey and goals.'
    },
    personal: {
      title: 'Tell Us About Your Healing Story',
      description: 'Share your personal journey with us so we can create a truly customized healing experience just for you.'
    },
    mystical: {
      title: 'The Gateway to Your Transformation',
      description: 'This sacred portal gathers the essence of your being to weave a personalized tapestry of healing wisdom.'
    }
  });

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        <div className="container-custom py-16 md:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              {ctaContent.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              {ctaContent.subtitle}
            </p>
            <Button
              variant="accent"
              size="lg"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
              onClick={handleFormClick}
              aria-label={ctaContent.buttonText}
            >
              {ctaContent.buttonText}
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Your Spiritual Companion</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We provide the tools and guidance you need on your healing journey, with privacy and compassion at the core of our approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Guided Chatbot */}
            <div className="bg-neutral-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-primary-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-serif mb-3">Guided Chatbot</h3>
              <p className="text-neutral-600">
                Engage with our spiritually-attuned companion for guidance, reflection prompts, and meditative practices tailored to your journey.
              </p>
            </div>

            {/* Private Reflections */}
            <div className="bg-neutral-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-accent-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3v12"></path>
                  <path d="m8 11 4 4 4-4"></path>
                  <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-serif mb-3">Private Reflections</h3>
              <p className="text-neutral-600">
                Document your spiritual insights at key milestones, creating a sacred record of your growth and transformation.
              </p>
            </div>

            {/* Email Support */}
            <div className="bg-neutral-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-secondary-800 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-serif mb-3">Email Support</h3>
              <p className="text-neutral-600">
                Receive gentle guidance through email journeys, offering regular prompts and wisdom to support your ongoing practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary-200">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Ready to Begin?</h2>
            <p className="text-neutral-700 mb-8">
              Your healing journey awaits. Take the first step toward spiritual wellness and self-discovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => window.location.href = '/chatbot'}
                aria-label="Explore the Chatbot"
              >
                Explore the Chatbot
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/about'}
                aria-label="Learn More About Us"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Form Preview Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{formIntroContent.title}</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              {formIntroContent.description}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <h3 className="text-2xl font-serif mb-8 text-center text-primary-600">What We'll Ask You</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border-l-4 border-primary-400 pl-4">
                    <h4 className="font-semibold text-lg mb-2">Your Healing Name</h4>
                    <p className="text-neutral-600">A sacred name that represents your healing journey - this can be your given name or a name that feels meaningful to you.</p>
                  </div>

                  <div className="border-l-4 border-accent-400 pl-4">
                    <h4 className="font-semibold text-lg mb-2">Healing Goals</h4>
                    <p className="text-neutral-600">Share what you hope to achieve through your healing journey - physical, emotional, or spiritual aspirations.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-l-4 border-secondary-400 pl-4">
                    <h4 className="font-semibold text-lg mb-2">Fasting Experience</h4>
                    <p className="text-neutral-600">Tell us about your experience with fasting or cleansing practices to personalize your guidance.</p>
                  </div>

                  <div className="border-l-4 border-primary-400 pl-4">
                    <h4 className="font-semibold text-lg mb-2">Email Preferences</h4>
                    <p className="text-neutral-600">Choose whether you'd like to receive our gentle email guidance and milestone reminders.</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-10">
                <p className="text-neutral-600 mb-6">The form takes just 2-3 minutes to complete and helps us create a personalized experience for you.</p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    formIntroTest.trackEvent('form_preview_click');
                    handleFormClick();
                  }}
                  aria-label="Complete Your Sacred Intake Form"
                >
                  Complete Your Sacred Intake Form
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonial Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Sacred Healing Experiences</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Stories from souls who have walked the path of healing with our spiritual companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-primary-500 mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <p className="text-neutral-600 mb-6 italic">
                "This healing journey has been transformative. The guidance I received helped me connect with my inner wisdom in ways I never thought possible. The personalized approach made all the difference."
              </p>
              <div className="border-t border-primary-200 pt-4">
                <p className="font-medium text-primary-700">— Healing Name: Serene Oak</p>
                <p className="text-sm text-neutral-500">30-day journey completed</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-accent-600 mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <p className="text-neutral-600 mb-6 italic">
                "Having a private space to reflect on my spiritual growth has been invaluable. I feel supported and guided at every step of my journey. The email reminders came at perfect moments."
              </p>
              <div className="border-t border-accent-200 pt-4">
                <p className="font-medium text-accent-700">— Healing Name: Gentle River</p>
                <p className="text-sm text-neutral-500">60-day journey completed</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-secondary-700 mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <p className="text-neutral-600 mb-6 italic">
                "The combination of AI guidance and human wisdom created something truly special. I discovered parts of myself I didn't know existed. This isn't just a program—it's a sacred experience."
              </p>
              <div className="border-t border-secondary-200 pt-4">
                <p className="font-medium text-secondary-800">— Healing Name: Rising Phoenix</p>
                <p className="text-sm text-neutral-500">90-day journey completed</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-neutral-600 mb-6">Join thousands of souls on their healing journey</p>
            <div className="flex justify-center items-center space-x-8 text-sm text-neutral-500">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🌟</span>
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">👥</span>
                <span>5,000+ Healing Journeys</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🔒</span>
                <span>100% Private & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Intake Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleModalClose}
        title=""
        size="lg"
        closeOnOverlayClick={!formSubmissionSuccess}
        showCloseButton={!formSubmissionSuccess}
      >
        <SacredIntakeForm
          onSuccess={handleFormSuccess}
          onClose={handleModalClose}
          variant={ctaTest.variant}
        />
      </Modal>
    </PageTransition>
  );
};

export default LandingPage;