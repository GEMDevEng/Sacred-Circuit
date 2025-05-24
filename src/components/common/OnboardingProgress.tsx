import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  optional?: boolean;
}

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  currentStep?: string;
  className?: string;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  const getStepIcon = (step: OnboardingStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <Clock className="w-6 h-6 text-primary-500" />;
      case 'pending':
        return <Circle className="w-6 h-6 text-neutral-300" />;
      default:
        return <Circle className="w-6 h-6 text-neutral-300" />;
    }
  };

  const getStepLineColor = (index: number) => {
    if (index === steps.length - 1) return ''; // No line after last step
    
    const currentStepIndex = steps.findIndex(step => step.status === 'current');
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    
    if (index < completedSteps) {
      return 'bg-green-500';
    } else if (index === currentStepIndex) {
      return 'bg-gradient-to-r from-green-500 to-primary-500';
    } else {
      return 'bg-neutral-200';
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-serif text-neutral-800">Your Sacred Journey Progress</h3>
          <span className="text-sm text-neutral-600">
            {completedSteps} of {totalSteps} steps completed
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="mt-2 text-sm text-neutral-600">
          {progressPercentage === 100 ? (
            <span className="text-green-600 font-medium">🎉 Journey setup complete!</span>
          ) : (
            <span>{Math.round(progressPercentage)}% complete</span>
          )}
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className="flex items-start space-x-4">
              {/* Step Icon */}
              <div className="flex-shrink-0 relative">
                {getStepIcon(step)}
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-8 left-3 w-0.5 h-8 ${getStepLineColor(index)} transition-colors duration-300`}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center space-x-2">
                  <h4
                    className={`font-medium ${
                      step.status === 'completed'
                        ? 'text-green-700'
                        : step.status === 'current'
                        ? 'text-primary-700'
                        : 'text-neutral-500'
                    }`}
                  >
                    {step.title}
                  </h4>
                  
                  {step.optional && (
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                      Optional
                    </span>
                  )}
                  
                  {step.status === 'current' && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                
                <p
                  className={`text-sm mt-1 ${
                    step.status === 'completed'
                      ? 'text-green-600'
                      : step.status === 'current'
                      ? 'text-primary-600'
                      : 'text-neutral-500'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Encouragement Message */}
      {progressPercentage < 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-100">
          <p className="text-sm text-primary-700">
            <span className="font-medium">Keep going!</span> Each step brings you closer to your healing journey. 
            Take your time and honor your own pace.
          </p>
        </div>
      )}

      {/* Completion Celebration */}
      {progressPercentage === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-accent-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            <span className="font-medium">Congratulations!</span> You've completed your onboarding. 
            Your sacred healing journey is ready to begin. 🌟
          </p>
        </div>
      )}
    </div>
  );
};

export default OnboardingProgress;
