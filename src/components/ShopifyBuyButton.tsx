import { useEffect, useRef, useState } from 'react'

interface ShopifyBuyButtonProps {
  productId: string
  domain: string
  storefrontAccessToken: string
  buttonText?: string
  buttonColor?: string
  buttonHoverColor?: string
  onClick?: () => void
  onCheckoutComplete?: () => void
  className?: string
}

/**
 * Reusable Shopify Buy Button component
 * Integrates Shopify's Buy Button SDK for seamless checkout
 */
export default function ShopifyBuyButton({
  productId,
  domain,
  storefrontAccessToken,
  buttonText = 'Buy now',
  buttonColor = '#079250',
  buttonHoverColor = '#068348',
  onClick,
  onCheckoutComplete,
  className = ''
}: ShopifyBuyButtonProps) {
  const [containerId] = useState(() => `shopify-buy-${Math.random().toString(36).substr(2, 9)}`)
  const initAttempted = useRef(false)
  const onClickRef = useRef(onClick)
  const onCheckoutCompleteRef = useRef(onCheckoutComplete)

  // Update refs when callbacks change (doesn't trigger re-initialization)
  useEffect(() => {
    onClickRef.current = onClick
    onCheckoutCompleteRef.current = onCheckoutComplete
  }, [onClick, onCheckoutComplete])

  useEffect(() => {
    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'

    function initializeShopifyBuy() {
      // Prevent multiple initialization attempts
      if (initAttempted.current) return
      initAttempted.current = true

      const container = document.getElementById(containerId)
      if (!container || !window.ShopifyBuy) {
        console.warn('Shopify Buy Button: Container or SDK not ready')
        initAttempted.current = false
        return
      }

      // Clear any existing content in the container
      container.innerHTML = ''

      try {
        const client = window.ShopifyBuy.buildClient({
          domain,
          storefrontAccessToken,
        })

        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          ui.createComponent('product', {
            id: productId,
            node: container,
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              product: {
                styles: {
                  product: {
                    'max-width': '100% !important',
                    'text-align': 'center',
                    '@media (min-width: 601px)': {
                      'max-width': '100% !important',
                      'margin-left': '0',
                      'margin-bottom': '0'
                    }
                  },
                  button: {
                    ':hover': {
                      'background-color': buttonHoverColor,
                      'transform': 'translateY(-2px)',
                      'box-shadow': '0 12px 24px rgba(6, 131, 72, 0.25)'
                    },
                    'background-color': buttonColor,
                    ':focus': {
                      'background-color': buttonHoverColor
                    },
                    'font-size': '18px',
                    'font-weight': '700',
                    'padding-top': '18px',
                    'padding-bottom': '18px',
                    'padding-left': '45px',
                    'padding-right': '45px',
                    'border-radius': '9999px',
                    'transition': 'all 0.3s ease',
                    'box-shadow': '0 4px 12px rgba(6, 131, 72, 0.15)',
                    'letter-spacing': '0.02em',
                    'display': 'block',
                    'width': '100%'
                  }
                },
                buttonDestination: 'checkout',
                contents: {
                  img: false,
                  title: false,
                  price: false
                },
                text: {
                  button: buttonText
                },
                events: {
                  afterRender: () => {
                    console.log('✅ Shopify button rendered')
                  }
                },
                DOMEvents: {
                  'click button': () => {
                    console.log('🔥 Shopify button clicked via DOMEvents')
                    if (onClickRef.current) {
                      onClickRef.current()
                    }
                  }
                }
              },
              productSet: {
                styles: {
                  products: {
                    '@media (min-width: 601px)': {
                      'margin-left': '-20px'
                    }
                  }
                }
              },
              modalProduct: {
                contents: {
                  img: false,
                  imgWithCarousel: true,
                  button: false,
                  buttonWithQuantity: true
                },
                styles: {
                  product: {
                    '@media (min-width: 601px)': {
                      'max-width': '100%',
                      'margin-left': '0px',
                      'margin-bottom': '0px'
                    }
                  },
                  button: {
                    ':hover': {
                      'background-color': buttonHoverColor,
                      'transform': 'translateY(-2px)',
                      'box-shadow': '0 12px 24px rgba(6, 131, 72, 0.25)'
                    },
                    'background-color': buttonColor,
                    ':focus': {
                      'background-color': buttonHoverColor
                    },
                    'font-weight': '700',
                    'padding-left': '45px',
                    'padding-right': '45px',
                    'border-radius': '9999px',
                    'transition': 'all 0.3s ease',
                    'box-shadow': '0 4px 12px rgba(6, 131, 72, 0.15)',
                    'letter-spacing': '0.02em'
                  }
                },
                text: {
                  button: 'Add to cart'
                }
              },
              option: {},
              cart: {
                styles: {
                  button: {
                    ':hover': {
                      'background-color': buttonHoverColor,
                      'transform': 'translateY(-2px)',
                      'box-shadow': '0 12px 24px rgba(6, 131, 72, 0.25)'
                    },
                    'background-color': buttonColor,
                    ':focus': {
                      'background-color': buttonHoverColor
                    },
                    'font-weight': '700',
                    'border-radius': '9999px',
                    'transition': 'all 0.3s ease',
                    'box-shadow': '0 4px 12px rgba(6, 131, 72, 0.15)',
                    'letter-spacing': '0.02em'
                  }
                },
                text: {
                  total: 'Subtotal',
                  button: 'Checkout'
                },
                popup: false,
                events: {
                  afterInit: () => {
                    if (onCheckoutCompleteRef.current) {
                      onCheckoutCompleteRef.current()
                    }
                  }
                }
              },
              toggle: {
                styles: {
                  toggle: {
                    'background-color': buttonColor,
                    ':hover': {
                      'background-color': buttonHoverColor
                    },
                    ':focus': {
                      'background-color': buttonHoverColor
                    }
                  }
                }
              }
            }
          })

          // Force remove max-width inline style after Shopify SDK renders
          setTimeout(() => {
            const shopifyFrame = container.querySelector('.shopify-buy-frame--product')
            if (shopifyFrame && shopifyFrame instanceof HTMLElement) {
              shopifyFrame.style.maxWidth = '100%'
            }
          }, 100)
        })
      } catch (error) {
        console.error('Shopify Buy Button initialization error:', error)
        initAttempted.current = false
      }
    }

    function loadScript() {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${scriptURL}"]`)
      if (existingScript) {
        if (window.ShopifyBuy && window.ShopifyBuy.UI) {
          // Script already loaded, initialize immediately
          setTimeout(initializeShopifyBuy, 100)
        } else {
          // Script loading, wait for it
          existingScript.addEventListener('load', () => {
            setTimeout(initializeShopifyBuy, 100)
          })
        }
        return
      }

      // Load script
      const script = document.createElement('script')
      script.async = true
      script.src = scriptURL
      script.onload = () => {
        setTimeout(initializeShopifyBuy, 100)
      }
      script.onerror = () => {
        console.error('Failed to load Shopify Buy Button SDK')
      }

      const target = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]
      target.appendChild(script)
    }

    if (window.ShopifyBuy && window.ShopifyBuy.UI) {
      // SDK already loaded
      setTimeout(initializeShopifyBuy, 100)
    } else {
      loadScript()
    }

    // Cleanup - clear container
    return () => {
      const container = document.getElementById(containerId)
      if (container) {
        container.innerHTML = ''
      }
      initAttempted.current = false
    }
  }, [productId, domain, storefrontAccessToken, containerId])

  // Separate effect to handle prop changes without reinitializing
  // (buttonColor, buttonHoverColor, buttonText, onCheckoutComplete changes won't trigger full reinitialization)

  return (
    <div
      id={containerId}
      className={className}
      style={{ minHeight: '44px', width: '100%', textAlign: 'center' }}
    />
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ShopifyBuy?: any
  }
}
