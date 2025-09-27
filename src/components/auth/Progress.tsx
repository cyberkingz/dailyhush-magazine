import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
}

interface StepProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  currentStep: string;
  completedSteps: string[];
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  showPercentage = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('bg-white p-6 rounded-xl border border-gray-100', className)}>
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          {showPercentage && (
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-emerald-600">
                {Math.round(percentage)}%
              </div>
              <div className="text-sm text-gray-500">complete</div>
            </div>
          )}
        </div>
        
        {/* Progress Status */}
        <div className="text-sm text-gray-600">
          {percentage === 100 ? (
            <span className="flex items-center gap-2 text-emerald-600 font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed successfully!
            </span>
          ) : percentage > 0 ? (
            <span className="text-amber-600 font-medium">In progress...</span>
          ) : (
            <span className="text-gray-500">Not started</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="auth-progress">
        <div
          className="auth-progress-bar"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`Progress: ${Math.round(percentage)}%`}
        />
      </div>

      {/* Progress Metrics */}
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>{value} of {max} completed</span>
        <span>{max - value} remaining</span>
      </div>
    </div>
  );
};

export const Steps: React.FC<StepProps> = ({
  steps,
  currentStep,
  completedSteps,
  className,
}) => {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  // Emoji icons for different states
  const getStepIcon = (isCompleted: boolean, isCurrent: boolean, index: number) => {
    if (isCompleted) {
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    
    if (isCurrent) {
      return <span className="text-sm font-bold">{index + 1}</span>;
    }
    
    return <span className="text-sm">{index + 1}</span>;
  };

  return (
    <div className={cn('bg-white', className)}>
      {/* Progress Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
        <div className="text-sm text-gray-600">
          Step {currentIndex + 1} of {steps.length}
        </div>
      </div>

      {/* Steps Container */}
      <div className="auth-steps" aria-label="Registration progress">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={cn('auth-step', {
                'auth-step--completed': isCompleted,
                'auth-step--active': isCurrent,
              })}
            >
              {/* Step Number/Icon */}
              <div
                className="auth-step-number"
                aria-label={
                  isCompleted
                    ? `Step ${index + 1}: ${step.title} completed`
                    : isCurrent
                    ? `Step ${index + 1}: ${step.title} current`
                    : `Step ${index + 1}: ${step.title} pending`
                }
              >
                {getStepIcon(isCompleted, isCurrent, index)}
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="auth-step-line" aria-hidden="true" />
              )}

              {/* Step Content */}
              <div className="w-full">
                <div className="auth-step-title">
                  {step.title}
                </div>
                {step.description && (
                  <div className="auth-step-description">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};