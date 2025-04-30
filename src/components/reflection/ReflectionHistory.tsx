import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import PageTransition from '../common/PageTransition';
import Button from '../common/Button';
import { getReflections, getAuthenticatedUserReflections } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import SentryErrorBoundary from '../common/SentryErrorBoundary';

interface Reflection {
  id: string;
  content: string;
  journeyDay: string;
  createdAt: string;
}

const ReflectionHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        // If user is authenticated, use the secure endpoint without specifying healing name
        if (isAuthenticated) {
          const response = await getAuthenticatedUserReflections();
          setReflections(response.reflections);
        } else {
          // For unauthenticated users, get healing name from localStorage
          const healingName = localStorage.getItem('healingName');

          if (!healingName) {
            toast.error('Please enter your healing name first');
            setIsLoading(false);
            return;
          }

          // Fetch reflections using healing name
          const response = await getReflections(healingName, false);
          setReflections(response.reflections);
        }
      } catch (error) {
        console.error('Error fetching reflections:', error);
        toast.error('Failed to load reflections. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReflections();
  }, [isAuthenticated]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <PageTransition>
      <section className="py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                to="/reflection"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft size={18} className="mr-1" />
                Back to Reflection Form
              </Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif mb-2 text-center">Your Reflection Journey</h1>
            <p className="text-center text-neutral-600 mb-8">
              Review your past reflections and witness your growth over time.
            </p>

            <SentryErrorBoundary>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : reflections.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                  <h2 className="text-xl font-serif mb-4">No Reflections Yet</h2>
                  <p className="mb-6 text-neutral-600">
                    You haven't submitted any reflections yet. Start your reflection journey today.
                  </p>
                  <Button
                    variant="primary"
                    as={Link}
                    to="/reflection"
                    aria-label="Create your first reflection"
                  >
                    Create Your First Reflection
                  </Button>
                </div>
              ) : selectedReflection ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-serif">{selectedReflection.journeyDay} Reflection</h2>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedReflection(null)}
                      aria-label="Back to reflection list"
                    >
                      Back to List
                    </Button>
                  </div>

                  <div className="flex items-center text-sm text-neutral-500 mb-4">
                    <Calendar size={16} className="mr-1" />
                    <span className="mr-4">{formatDate(selectedReflection.createdAt)}</span>
                    <Clock size={16} className="mr-1" />
                    <span>{formatTime(selectedReflection.createdAt)}</span>
                  </div>

                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{selectedReflection.content}</p>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                  <h2 className="text-xl font-serif mb-4">Your Reflections</h2>

                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reflections.map((reflection) => (
                      <div
                        key={reflection.id}
                        className="py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 rounded-md transition-colors"
                        onClick={() => setSelectedReflection(reflection)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{reflection.journeyDay} Reflection</h3>
                            <div className="flex items-center text-sm text-neutral-500 mt-1">
                              <Calendar size={16} className="mr-1" />
                              <span>{formatDate(reflection.createdAt)}</span>
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-neutral-400" />
                        </div>
                        <p className="mt-2 text-neutral-600 line-clamp-2">
                          {reflection.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      as={Link}
                      to="/reflection"
                      aria-label="Add new reflection"
                    >
                      Add New Reflection
                    </Button>
                  </div>
                </div>
              )}
            </SentryErrorBoundary>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ReflectionHistory;
