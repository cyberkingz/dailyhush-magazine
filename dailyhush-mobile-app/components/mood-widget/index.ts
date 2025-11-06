/**
 * Mood Widget Components
 *
 * Centralized export for all mood widget components
 *
 * @module components/mood-widget
 */

// Main widget (default export)
export { EmotionalWeatherWidget } from './EmotionalWeatherWidget';

// Child components (named exports)
export { EmptyState } from './EmptyState';
export { MoodSelector } from './MoodSelector';
export { IntensitySlider } from './IntensitySlider';
export { QuickNotesInput } from './QuickNotesInput';
export { SuccessCheckmark } from './SuccessCheckmark';
export { WeatherDisplay } from './WeatherDisplay';

// Utility components
export { CloseButton } from './CloseButton';
export { ProgressIndicator } from './ProgressIndicator';
export { LoadingOverlay } from './LoadingOverlay';
export { ErrorDisplay } from './ErrorDisplay';
export { Backdrop } from './Backdrop';

// Re-export types
export type {
  EmotionalWeatherWidgetProps,
  EmptyStateProps,
  MoodSelectorProps,
  IntensitySliderProps,
  QuickNotesInputProps,
  SuccessCheckmarkProps,
  WeatherDisplayProps,
  WidgetConfig,
  WidgetState,
  MoodChoice,
  IntensityValue,
  MoodSubmitData,
} from '@/types/widget.types';
