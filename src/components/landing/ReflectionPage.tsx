import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Lock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import PageTransition from '../common/PageTransition';
import Button from '../common/Button';
import { Checkbox, FormInput, FormTextarea, FormSelect } from '../common/form';
import { submitReflection, ReflectionRequest } from '../../utils/api';
import SentryErrorBoundary from '../common/SentryErrorBoundary';
import { useAuth } from '../../contexts/AuthContext';

const ReflectionPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [healingName, setHealingName] = useState('');
  const [reflection, setReflection] = useState('');
  const [milestone, setMilestone] = useState('Day 7');
  const [emailConsent, setEmailConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Use user's healing name if authenticated, otherwise use from localStorage
    if (user?.healingName) {
      setHealingName(user.healingName);
    } else {
      // Retrieve healing name from localStorage
      const storedName = localStorage.getItem('healingName');
      if (storedName) {
        setHealingName(storedName);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!healingName.trim()) {
      toast.error('Please enter your healing name');
      return;
    }

    if (!reflection.trim()) {
      toast.error('Please share your reflection');
      return;
    }

    if (reflection.length > 5000) {
      toast.error('Reflection is too long (maximum 5000 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create reflection request
      const reflectionRequest: ReflectionRequest = {
        healingName: healingName.trim(),
        reflectionText: reflection.trim(),
        journeyDay: milestone,
        emailConsent: emailConsent
      };

      // Submit reflection to API - use secure endpoint if authenticated
      await submitReflection(reflectionRequest, isAuthenticated);

      // Update UI
      setShowSuccess(true);
      setReflection('');

      // Store the healing name in localStorage
      localStorage.setItem('healingName', healingName);

    } catch (error) {
      console.error('Error submitting reflection:', error);
      toast.error('Failed to submit reflection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="py-8">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Link
                to="/chatbot"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft size={18} className="mr-1" />
                Back to Chatbot
              </Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif mb-2 text-center">Reflection Milestone</h1>
            <p className="text-center text-neutral-600 mb-4">
              Record your insights and growth as you progress on your healing journey.
            </p>
            <div className="text-center mb-6">
              <Link
                to="/reflection/history"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              >
                View Your Reflection History
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            {isAuthenticated && (
              <div className="flex justify-center mb-6">
                <div className="flex items-center text-sm text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                  <Lock size={14} className="mr-1" />
                  <span>Secure Connection</span>
                </div>
              </div>
            )}

            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent-50 border border-accent-200 text-accent-800 rounded-lg p-6 text-center"
              >
                <h2 className="text-xl font-serif mb-4">Thank you for sharing!</h2>
                <p className="mb-6">
                  Your reflection has been recorded as a sacred milestone in your journey.
                  These insights will help illuminate your path forward.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowSuccess(false)}
                    aria-label="Submit another reflection"
                  >
                    Submit Another
                  </Button>
                  <Button
                    variant="accent"
                    onClick={() => window.location.href = '/chatbot'}
                    aria-label="Return to chatbot"
                  >
                    Return to Chatbot
                  </Button>
                </div>
              </motion.div>
            ) : (
              <SentryErrorBoundary>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                  <FormInput
                    label="Healing Name"
                    id="healingName"
                    value={healingName}
                    onChange={(e) => setHealingName(e.target.value)}
                    placeholder="Enter your healing name"
                    maxLength={50}
                    required
                    helperText="This is the name you use throughout your healing journey"
                  />

                  <FormSelect
                    label="Milestone"
                    id="milestone"
                    value={milestone}
                    onChange={(value) => setMilestone(value)}
                    required
                    options={[
                      { value: 'Day 7', label: 'Day 7' },
                      { value: 'Day 14', label: 'Day 14' },
                      { value: 'Day 21', label: 'Day 21' },
                      { value: 'Day 30', label: 'Day 30' },
                      { value: 'Other', label: 'Other' }
                    ]}
                  />

                  <FormTextarea
                    label="Your Reflection"
                    id="reflection"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Share your thoughts, feelings, and insights from your healing journey so far..."
                    rows={8}
                    maxLength={5000}
                    required
                    showCount
                  />

                  <Checkbox
                    label="I consent to receive occasional emails with guidance and reflection prompts"
                    id="emailConsent"
                    checked={emailConsent}
                    onChange={(e) => setEmailConsent(e.target.checked)}
                    containerClassName="mb-8"
                  />

                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    icon={!isSubmitting ? <Send size={18} /> : undefined}
                    iconPosition="right"
                    aria-label="Submit Reflection"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Reflection'}
                  </Button>
                </div>

                <p className="mt-8 text-xs text-neutral-500 dark:text-neutral-400 text-center">
                  {isAuthenticated
                    ? "Your reflection is securely stored and linked to your account."
                    : "Your reflection will be stored using only your healing name to preserve your privacy."}
                </p>

                {!isAuthenticated && (
                  <p className="mt-2 text-xs text-primary-600 text-center">
                    <Link to="/login" className="hover:underline">
                      Log in or create an account
                    </Link> for enhanced security and to track your journey.
                  </p>
                )}
              </form>
              </SentryErrorBoundary>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ReflectionPage;