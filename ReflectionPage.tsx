import { useState, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';

const ReflectionPage = () => {
  const [healingName, setHealingName] = useState('');
  const [reflection, setReflection] = useState('');
  const [milestone, setMilestone] = useState('Day 7');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    // Retrieve healing name from localStorage
    const storedName = localStorage.getItem('healingName');
    if (storedName) {
      setHealingName(storedName);
    }
  }, []);

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
      // Simulated API call - In a real implementation, this would be an actual API call
      // const response = await axios.post('/api/reflection', {
      //   healingName,
      //   reflection,
      //   milestone,
      // });
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      setReflection('');
      toast.success('Your reflection has been submitted successfully');
      
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
            <p className="text-center text-neutral-600 mb-8">
              Record your insights and growth as you progress on your healing journey.
            </p>
            
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
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                <div className="mb-6">
                  <label htmlFor="healingName" className="block text-sm font-medium text-neutral-700 mb-1">
                    Healing Name
                  </label>
                  <input
                    type="text"
                    id="healingName"
                    value={healingName}
                    onChange={(e) => setHealingName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your healing name"
                    maxLength={50}
                    aria-required="true"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="milestone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Milestone
                  </label>
                  <select
                    id="milestone"
                    value={milestone}
                    onChange={(e) => setMilestone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-required="true"
                  >
                    <option value="Day 7">Day 7</option>
                    <option value="Day 14">Day 14</option>
                    <option value="Day 21">Day 21</option>
                    <option value="Day 30">Day 30</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="reflection" className="block text-sm font-medium text-neutral-700 mb-1">
                    Your Reflection
                  </label>
                  <textarea
                    id="reflection"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Share your thoughts, feelings, and insights from your healing journey so far..."
                    rows={8}
                    maxLength={5000}
                    aria-required="true"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    {reflection.length}/5000 characters
                  </p>
                </div>
                
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    icon={isSubmitting ? undefined : <Send size={18} />}
                    aria-label="Submit Reflection"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Submitting</span>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      'Submit Reflection'
                    )}
                  </Button>
                </div>
                
                <p className="mt-6 text-xs text-neutral-500 text-center">
                  Your reflection will be stored using only your healing name to preserve your privacy.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ReflectionPage;