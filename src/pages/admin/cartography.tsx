import React, { useState } from 'react'
import { AdminLayout } from '@/components/admin'
import { AdminGuard } from '@/components/auth'
import { Mermaid } from '@/components/admin/Mermaid'

const funnelCareer = `flowchart TB
  A["Visiteur - careeraddict.com"] --> B{"Opt-in"}
  B -->|Popup FREE Worksheet| C["Inscription THE DOSE (Beehiiv)"]
  B -->|Hero email field| C
  C --> D["Reco autres newsletters (Beehiiv)"]
  D --> E["Thank You page"]
  E --> F["Email bienvenue + lead magnet (J0 - immediat)"]
  F --> G["Email sponsorise + weekly goody (J0 + heures)"]
  G --> H["Nurturing hebdo : editions, sponsors, recos, CTAs -> store/tests"]

  classDef site fill:#0f1830,stroke:#3b4f8e,stroke-width:1.2,color:#eaf1ff;
  classDef news fill:#2b1f47,stroke:#7a63c7,stroke-width:1.2,color:#f3eefe;
  class A,E site
  class C,D,F,G,H news`

const funnelHR = `flowchart TB
  A2["Visiteur - hraddict.com"] --> B2{"Opt-in"}
  B2 --> C2["Inscription HRAddict (Beehiiv)"]
  C2 --> D2["Reco autres newsletters (Beehiiv)"]
  D2 --> E2["Thank You page"]
  E2 --> F2["Email bienvenue + lead magnet (J0)"]
  F2 --> G2["Email sponsorise/edition (J0 + heures)"]
  G2 --> H2["Nurturing B2B RH (hebdo)"]

  classDef site fill:#0f1830,stroke:#3b4f8e,stroke-width:1.2,color:#eaf1ff;
  classDef news fill:#2b1f47,stroke:#7a63c7,stroke-width:1.2,color:#f3eefe;
  class A2,E2 site
  class C2,D2,F2,G2,H2 news`

const mapDiagram = `flowchart LR
  RP["Robert Pilyugin (founder)"]:::core --> DQ["DeltaQuest Media"]:::core

  %% Pile CareerAddict
  DQ --> CA["careeraddict.com<br/>(Site principal: SEO, Store, Services)"]:::site
  DQ --> DOSEHUB["dose.careeraddict.com<br/>(Beehiiv hub: Posts, Newsletters, Archives)"]:::site
  DOSEHUB --> DOSE["THE DOSE (newsletter)"]:::news
  CA <-->|opt-in / CTAs| DOSEHUB

  %% Pile HRAddict
  DQ --> HRSITE["hraddict.com<br/>(Site: contenus RH)"]:::site
  DQ --> HRHUB["newsletter.hraddict.com<br/>(Beehiiv hub: Archives & opt-in)"]:::site
  HRHUB --> HRN["HRAddict newsletter"]:::news
  HRSITE <-->|opt-in / CTAs| HRHUB

  %% Autres actifs
  DQ --> CH["CareerHunter.io"]:::site
  DQ --> CX["Customer Experience Show"]:::site

  %% Produits & services
  CA --> DLD["Digital downloads (ebooks, planners, bundles)"]:::prod
  CA --> CVS["CV / resume services"]:::prod
  CH --> TST["Psychometric tests (6 tests, full access, schools)"]:::prod

  %% Monétisation
  DOSE --> SPN["Sponsoring / placements (newsletter)"]:::rev
  DOSE --> AFF["Affiliation / paid recommendations (CPL)"]:::rev
  HRN  --> SPN2["Sponsoring / placements (newsletter)"]:::rev
  CA --> ADS["Display / programmatic ads"]:::rev
  CVS --> R1["Services revenue"]:::rev
  DLD --> R2["One-off sales"]:::rev
  TST --> R3["Paid tests / licences (B2C/B2B/Schools)"]:::rev

  %% Réseaux
  CA -.-> IG["Instagram"]:::soc
  CA -.-> YT["YouTube"]:::soc
  CA -.-> LI["LinkedIn"]:::soc
  CA -.-> TW["X (Twitter)"]:::soc

  classDef core fill:#17325e,stroke:#6aa9ff,stroke-width:1.6,color:#eaf1ff;
  classDef site fill:#1b3058,stroke:#89c8ff,stroke-width:1.2,color:#eaf1ff;
  classDef news fill:#3a285f,stroke:#bda4ff,stroke-width:1.2,color:#fff;
  classDef prod fill:#153d2a,stroke:#4bb673,stroke-width:1.2,color:#eafff1;
  classDef rev  fill:#3f320e,stroke:#e3c76a,stroke-width:1.2,color:#fff1b3;
  classDef soc  fill:#5a2a1f,stroke:#ffa98b,stroke-width:1.1,color:#ffe6de;`

const fluxDiagram = `flowchart LR
  CA["careeraddict.com"]:::site -->|subscribe| DOSEHUB["dose.careeraddict.com<br/>(Beehiiv)"]:::site
  DOSEHUB -->|editions / CTAs| CA
  HRSITE["hraddict.com"]:::site -->|subscribe| HRHUB["newsletter.hraddict.com<br/>(Beehiiv)"]:::site
  HRHUB -->|editions / CTAs| HRSITE

  classDef site fill:#1b3058,stroke:#89c8ff,stroke-width:1.2,color:#eaf1ff;`

const Card: React.FC<{ title: string; children: React.ReactNode; hint?: string }> = ({ title, children, hint }) => (
  <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-4 md:p-6">
    <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
    {children}
    {hint && <div className="text-xs text-white/60 mt-4">{hint}</div>}
  </div>
)

const AdminCartography: React.FC = () => {
  const [tab, setTab] = useState<'funnel' | 'map' | 'sites'>('funnel')

  return (
    <AdminGuard>
      <AdminLayout currentPage="/admin/cartography">
        <div className="flex items-center gap-2 mb-4">
          {['funnel', 'map', 'sites'].map((t) => (
            <button
              key={t}
              className={
                'px-3 py-1.5 rounded-[10px] border text-sm transition-all duration-200 backdrop-blur-[12px] ' +
                (tab === t
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-300 shadow-[0_2px_4px_rgba(245,158,11,0.1)]'
                  : 'bg-[hsla(200,14%,78%,0.18)] border-white/20 text-white/80 hover:bg-[hsla(200,14%,78%,0.28)] hover:border-white/30 hover:text-white')
              }
              onClick={() => setTab(t as any)}
            >
              {t === 'funnel' ? 'Funnel' : t === 'map' ? 'Cartographie' : 'Sites'}
            </button>
          ))}
        </div>

        {tab === 'funnel' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Funnel — CareerAddict" hint="Cadence observée : Welcome instant + 2e email sponsorisé le même jour, puis nurturing hebdo (goodies, sponsors, recos).">
              <div className="rounded-xl border border-gray-200 p-3 bg-[#0b1220]">
                <Mermaid code={funnelCareer} />
              </div>
            </Card>
            <Card title="Funnel — HRAddict">
              <div className="rounded-xl border border-gray-200 p-3 bg-[#0b1220]">
                <Mermaid code={funnelHR} />
              </div>
            </Card>
          </div>
        )}

        {tab === 'map' && (
          <Card title="Cartographie du business">
            <div className="rounded-xl border border-gray-200 p-3 bg-[#0b1220]">
              <Mermaid code={mapDiagram} />
            </div>
          </Card>
        )}

        {tab === 'sites' && (
          <Card title="Flux entre les domaines (x2)" hint="Chaque marque a son hub Beehiiv dédié pour l’opt-in, les archives et la monétisation newsletter.">
            <div className="rounded-xl border border-gray-200 p-3 bg-[#0b1220]">
              <Mermaid code={fluxDiagram} />
            </div>
          </Card>
        )}

        {/* Competitor workspace placeholder */}
        <div className="mt-6">
          <Card title="Competitor Workspace">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-white/70">Centralize notes, funnels, cadences and assets for each competitor.</p>
              <button className="px-3 py-2 text-sm rounded-[10px] bg-amber-500/20 backdrop-blur-[8px] border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 hover:text-amber-200 transition-all duration-200 shadow-[0_2px_4px_rgba(245,158,11,0.1)]">New competitor</button>
            </div>
            <div className="text-sm text-white/60">Coming next: Supabase tables (competitors, funnels, touchpoints) and editable Mermaid blocks per entry.</div>
          </Card>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

export default AdminCartography
