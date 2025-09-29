/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_BEEHIIV_API: string
  readonly VITE_BEEHIIV_PUBLICATION_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
