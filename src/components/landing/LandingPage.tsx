import { ArrowRight } from 'lucide-react';
import PageTransition from '../common/PageTransition';
import Button from '../common/Button';

const LandingPage = () => {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        <div className="container-custom py-16 md:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Begin Your Healing Journey
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              A sacred space for self-discovery, spiritual growth, and healing. Connect with guidance tailored to your personal journey.
            </p>
            <Button
              variant="accent"
              size="lg"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
              onClick={() => window.open('https://example.typeform.com', '_blank')}
              aria-label="Start Your Healing Journey"
            >
              Start Your Healing Journey
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

      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Healing Experiences</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Stories from those who have walked the path of healing with our spiritual companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-50 p-8 rounded-xl shadow-sm">
              <p className="text-neutral-600 mb-6 italic">
                "This healing journey has been transformative. The guidance I received helped me connect with my inner wisdom in ways I never thought possible."
              </p>
              <p className="font-medium">— Healing Name: Serene Oak</p>
            </div>
            <div className="bg-neutral-50 p-8 rounded-xl shadow-sm">
              <p className="text-neutral-600 mb-6 italic">
                "Having a private space to reflect on my spiritual growth has been invaluable. I feel supported and guided at every step of my journey."
              </p>
              <p className="font-medium">— Healing Name: Gentle River</p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default LandingPage;