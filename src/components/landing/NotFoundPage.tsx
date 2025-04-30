import { Link } from 'react-router-dom';
import PageTransition from '../common/PageTransition';
import Button from '../common/Button';

const NotFoundPage = () => {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-serif text-primary-300 mb-6">404</h1>
          <h2 className="text-2xl md:text-3xl font-serif mb-4">Page Not Found</h2>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            The spiritual path you're seeking hasn't manifested here. Let's guide you back to a known path.
          </p>
          <Button
            as={Link}
            to="/"
            variant="primary"
            aria-label="Return to Home"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;