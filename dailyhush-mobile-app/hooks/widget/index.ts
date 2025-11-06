/**
 * Mood Widget Hooks
 *
 * Centralized export for all widget-related hooks
 *
 * @module hooks/widget
 */

export { useCardExpansion } from './useCardExpansion';
export { useMoodSelection } from './useMoodSelection';
export { useIntensitySlider } from './useIntensitySlider';
export { useSuccessAnimation } from './useSuccessAnimation';
export { useWidgetStateMachine } from './useWidgetStateMachine';

export type { UseCardExpansionReturn } from '@/types/widget.types';
export type { UseMoodSelectionReturn } from '@/types/widget.types';
export type { UseIntensitySliderReturn } from '@/types/widget.types';
export type { UseSuccessAnimationReturn } from '@/types/widget.types';
export type { UseWidgetStateMachineReturn } from '@/types/widget.types';
