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
  showPercentage = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('space-y-2', className)}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
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

  return (
    <div className={cn('auth-steps', className)} aria-label="Registration progress">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = step.id === currentStep;
        const isPending = index > currentIndex;

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn('auth-step', {
                'auth-step--completed': isCompleted,
                'auth-step--active': isCurrent,
              })}
            >
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
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
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
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="ml-3">
                <div
                  className={cn('text-sm font-medium', {
                    'text-neutral-900': isCurrent || isCompleted,
                    'text-neutral-500': isPending,
                  })}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div
                    className={cn('text-xs', {
                      'text-neutral-600': isCurrent || isCompleted,
                      'text-neutral-400': isPending,
                    })}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn('auth-step-line', {
                  'bg-success-500': isCompleted,
                })}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};