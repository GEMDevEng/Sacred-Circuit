import React from 'react';

interface SentryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
  showDialog?: boolean;
}

const SentryErrorBoundary: React.FC<SentryErrorBoundaryProps> = ({ children }) => {
  return <>{children}</>;
};

export default SentryErrorBoundary;
