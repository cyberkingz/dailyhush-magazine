import React, { useState } from 'react';
import { Progress, Steps } from './Progress';

export const ProgressDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState('personal-info');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Basic details and contact info'
    },
    {
      id: 'verification',
      title: 'Verification',
      description: 'Email and phone verification'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Set your account preferences'
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Finalize your account setup'
    }
  ];

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleReset = () => {
    setCurrentStep('personal-info');
    setCompletedSteps([]);
  };


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Premium Progress Components
        </h1>
        <p className="text-lg text-gray-600">
          Beautiful, minimal, and responsive progress tracking
        </p>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">
            Live Demo
          </span>
        </div>
      </div>

      {/* Demo Container */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
        
        {/* Overall Progress */}
        <div className="mb-8">
          <Progress 
            value={completedSteps.length} 
            max={steps.length} 
            showPercentage={true}
          />
        </div>

        {/* Subtle Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="px-4">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>

        {/* Step-by-Step Progress */}
        <div className="mb-8">
          <Steps
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h3>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleStepComplete}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              disabled={completedSteps.length === steps.length}
            >
              Complete Current Step
            </button>
            
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Reset Demo
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <strong>Current Step:</strong> {steps.find(s => s.id === currentStep)?.title}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <strong>Completed:</strong> {completedSteps.length}/{steps.length} steps
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {[
          {
            icon: '🎨',
            title: 'Premium Design',
            description: 'Beautiful gradients and shadows'
          },
          {
            icon: '📱',
            title: 'Mobile First',
            description: 'Responsive and touch-friendly'
          },
          {
            icon: '♿',
            title: 'Accessible',
            description: 'ARIA labels and keyboard support'
          },
          {
            icon: '⚡',
            title: 'Smooth Animations',
            description: 'Buttery smooth transitions'
          }
        ].map((feature, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Usage Example */}
      <div className="bg-gray-900 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
        <pre className="text-sm overflow-x-auto">
          <code>{`import { Progress, Steps } from '@/components/auth/Progress';

// Progress Bar
<Progress value={75} max={100} showPercentage={true} />

// Step Indicator
<Steps
  steps={steps}
  currentStep="verification"
  completedSteps={["personal-info"]}
/>`}</code>
        </pre>
      </div>
    </div>
  );
};

export default ProgressDemo;