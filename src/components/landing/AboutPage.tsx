import PageTransition from '../common/PageTransition';

const AboutPage = () => {
  return (
    <PageTransition>
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif mb-8 text-center">About Sacred Healing Hub</h1>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-serif mb-4 text-primary-700">Our Mission</h2>
              <p className="mb-6">
                Sacred Healing Hub was created to provide a serene, supportive space for young adults on their spiritual wellness journey. We believe that healing is a sacred process—unique to each individual—and our purpose is to offer gentle guidance, reflection opportunities, and compassionate support along the way.
              </p>

              <h2 className="text-2xl font-serif mb-4 text-primary-700">Our Approach</h2>
              <p className="mb-6">
                Our approach centers on three core principles:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-accent-600 mr-2">•</span>
                  <span><strong>Privacy:</strong> We believe healing requires a safe space. Your conversations and reflections remain private, with data stored only with your explicit consent.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-600 mr-2">•</span>
                  <span><strong>Personalization:</strong> Your spiritual journey is unique. Our guidance adapts to your individual path, offering personalized support through conversation and reflection.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-600 mr-2">•</span>
                  <span><strong>Presence:</strong> Healing happens in the present moment. Our platform encourages mindfulness, self-awareness, and conscious reflection.</span>
                </li>
              </ul>

              <h2 className="text-2xl font-serif mb-4 text-primary-700">How It Works</h2>
              <p className="mb-4">
                Sacred Healing Hub offers several ways to support your journey:
              </p>

              <h3 className="text-xl font-serif mb-2">1. Sacred Conversation</h3>
              <p className="mb-4">
                Our spiritually-attuned chatbot companion provides a space for exploration, offering guidance, prompts for reflection, and gentle wisdom tailored to your needs. All conversations are private by default.
              </p>

              <h3 className="text-xl font-serif mb-2">2. Milestone Reflections</h3>
              <p className="mb-4">
                At key points in your journey, you can record reflections that serve as sacred markers of your growth. These reflections help you recognize patterns, celebrate progress, and identify areas for deeper healing.
              </p>

              <h3 className="text-xl font-serif mb-2">3. Email Journeys</h3>
              <p className="mb-6">
                Sign up for guided email journeys that provide regular prompts, wisdom, and practices to support your ongoing healing process.
              </p>

              <h2 className="text-2xl font-serif mb-4 text-primary-700">Our Commitment to You</h2>
              <p className="mb-6">
                We are committed to creating a digital sanctuary that honors your healing journey. While our platform is not a substitute for professional mental health support, we strive to complement your existing practices with spiritual companionship and reflective opportunities.
              </p>

              <div className="bg-secondary-100 p-6 rounded-lg mt-8 text-center">
                <h3 className="text-xl font-serif mb-2">Begin Your Journey</h3>
                <p className="mb-0">
                  We invite you to explore our platform with an open heart, engaging with the tools and guidance in whatever way serves your highest good.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default AboutPage;