/**
 * useEmailCampaign Hook
 * Custom hook for fetching and managing email campaign data
 */

import { useState, useEffect, useCallback } from 'react'
import type {
  Campaign,
  EmailCampaignData,
  DateRange,
} from '../lib/types/emailCampaigns'
import {
  getCampaignList,
  getEmailCampaignData,
} from '../lib/services/emailCampaigns'

interface UseEmailCampaignReturn {
  campaigns: Campaign[]
  selectedCampaign: string | null
  campaignData: EmailCampaignData | null
  isLoading: boolean
  isLoadingCampaigns: boolean
  isLoadingData: boolean
  error: string | null
  selectCampaign: (campaignName: string) => void
  refresh: () => Promise<void>
}

export function useEmailCampaign(
  dateRange?: DateRange
): UseEmailCampaignReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [campaignData, setCampaignData] = useState<EmailCampaignData | null>(null)
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch campaigns list
  const fetchCampaigns = useCallback(async () => {
    try {
      setIsLoadingCampaigns(true)
      setError(null)

      const data = await getCampaignList(dateRange)
      setCampaigns(data)

      // Auto-select first campaign if none selected
      if (data.length > 0 && !selectedCampaign) {
        setSelectedCampaign(data[0].campaignName)
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err)
      setError('Failed to load campaigns')
    } finally {
      setIsLoadingCampaigns(false)
    }
  }, [dateRange, selectedCampaign])

  // Fetch selected campaign data
  const fetchCampaignData = useCallback(async (campaignName: string) => {
    try {
      setIsLoadingData(true)
      setError(null)

      const data = await getEmailCampaignData(campaignName, dateRange)
      setCampaignData(data)

      if (!data) {
        setError(`No data found for campaign: ${campaignName}`)
      }
    } catch (err) {
      console.error('Error fetching campaign data:', err)
      setError('Failed to load campaign data')
      setCampaignData(null)
    } finally {
      setIsLoadingData(false)
    }
  }, [dateRange])

  // Select campaign handler
  const selectCampaign = useCallback((campaignName: string) => {
    setSelectedCampaign(campaignName)
  }, [])

  // Refresh all data
  const refresh = useCallback(async () => {
    await fetchCampaigns()
    if (selectedCampaign) {
      await fetchCampaignData(selectedCampaign)
    }
  }, [fetchCampaigns, fetchCampaignData, selectedCampaign])

  // Initial load: Fetch campaigns
  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  // Load campaign data when selection changes
  useEffect(() => {
    if (selectedCampaign) {
      fetchCampaignData(selectedCampaign)
    }
  }, [selectedCampaign, fetchCampaignData])

  return {
    campaigns,
    selectedCampaign,
    campaignData,
    isLoading: isLoadingCampaigns || isLoadingData,
    isLoadingCampaigns,
    isLoadingData,
    error,
    selectCampaign,
    refresh,
  }
}
