/**
 * CampaignSelector Component
 * Reusable dropdown for selecting email campaigns
 */

import { useMemo } from 'react'
import type { Campaign } from '../../../lib/types/emailCampaigns'

interface CampaignSelectorProps {
  campaigns: Campaign[]
  selectedCampaign: string | null
  onSelect: (campaignName: string) => void
  isLoading?: boolean
  className?: string
}

export function CampaignSelector({
  campaigns,
  selectedCampaign,
  onSelect,
  isLoading = false,
  className = '',
}: CampaignSelectorProps) {
  // Format campaign display name
  const formatCampaignName = (campaign: Campaign): string => {
    const date = new Date(campaign.lastSend).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    return `${campaign.campaignName} (${campaign.totalSends} sends, ${date})`
  }

  // Sort campaigns by most recent
  const sortedCampaigns = useMemo(
    () =>
      [...campaigns].sort(
        (a, b) => new Date(b.lastSend).getTime() - new Date(a.lastSend).getTime()
      ),
    [campaigns]
  )

  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <select
          disabled
          className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white/50 cursor-not-allowed"
        >
          <option>Loading campaigns...</option>
        </select>
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <select
          disabled
          className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white/50 cursor-not-allowed"
        >
          <option>No campaigns found</option>
        </select>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor="campaign-selector"
        className="block text-sm font-medium text-white/70 mb-2"
      >
        Select Campaign
      </label>
      <select
        id="campaign-selector"
        value={selectedCampaign || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:bg-white/15 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        <option value="" disabled>
          Choose a campaign...
        </option>
        {sortedCampaigns.map((campaign) => (
          <option key={campaign.campaignName} value={campaign.campaignName}>
            {formatCampaignName(campaign)}
          </option>
        ))}
      </select>
    </div>
  )
}
