import React from 'react';
import { Flame } from 'lucide-react';
import ShopifyBuyButton from './ShopifyBuyButton';

interface StickyCheckoutBarProps {
  show: boolean;
  spotsRemaining: number;
  totalSpots: number;
  isCritical: boolean;
  isSoldOut: boolean;
  productId: string;
  domain: string;
  storefrontAccessToken: string;
  buttonText: string;
  buttonColor?: string;
  buttonHoverColor?: string;
}

export const StickyCheckoutBar: React.FC<StickyCheckoutBarProps> = ({
  show,
  isCritical,
  isSoldOut,
  productId,
  domain,
  storefrontAccessToken,
  buttonText,
  buttonColor = '#16a34a',
  buttonHoverColor = '#15803d',
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-300 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 transition-transform duration-500 ease-out ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="px-4 pt-2">
        <div className="max-w-md mx-auto space-y-1.5">
          {/* Button */}
          <ShopifyBuyButton
            productId={productId}
            domain={domain}
            storefrontAccessToken={storefrontAccessToken}
            buttonText={buttonText}
            buttonColor={buttonColor}
            buttonHoverColor={buttonHoverColor}
            className="w-full"
          />

          {/* Inventory Status - Below Button */}
          {!isSoldOut && (
            <div className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-slate-700">
              <Flame
                className={`h-3.5 w-3.5 flex-shrink-0 ${
                  isCritical ? 'text-rose-500' : 'text-amber-500'
                }`}
                strokeWidth={2.5}
              />
              <span>Due to order surge, inventory running low</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
