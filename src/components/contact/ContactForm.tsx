import React, { useState } from 'react'
import { ContactField } from './ContactField'
import { ContactSubmitButton } from './ContactSubmitButton'
import { createContactSubmission } from '@/lib/services/contact'
import type { ContactSubmissionResponse } from '@/lib/types/contact'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<ContactSubmissionResponse>
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ContactSubmissionResponse | null>(null)

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      let result: ContactSubmissionResponse
      
      if (onSubmit) {
        result = await onSubmit(formData)
      } else {
        // Default behavior - use the contact submission service
        result = await createContactSubmission(formData)
      }
      
      setResponse(result)
      
      if (result.success) {
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setResponse({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show success state
  if (response && response.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Message Sent!</h3>
        <p className="text-green-700 mb-4">
          {response.message}
        </p>
        <button
          onClick={() => setResponse(null)}
          className="text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContactField
          id="name"
          label="Full Name"
          value={formData.name}
          onChange={(value) => updateField('name', value)}
          placeholder="John Doe"
          required
          error={errors.name}
        />
        
        <ContactField
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          placeholder="john@example.com"
          required
          error={errors.email}
        />
      </div>
      
      <ContactField
        id="subject"
        label="Subject"
        value={formData.subject}
        onChange={(value) => updateField('subject', value)}
        placeholder="How can we help you?"
        required
        error={errors.subject}
      />
      
      <ContactField
        id="message"
        label="Message"
        type="textarea"
        value={formData.message}
        onChange={(value) => updateField('message', value)}
        placeholder="Tell us more about your inquiry..."
        required
        error={errors.message}
        rows={5}
      />
      
      <ContactSubmitButton isLoading={isLoading}>
        Send Message
      </ContactSubmitButton>
      
      {/* Error display */}
      {response && !response.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-900">Error sending message</h4>
              <p className="text-sm text-red-700 mt-1">{response.message}</p>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}