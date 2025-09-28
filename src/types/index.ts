export * from './volunteerConnector';

// Update this interface to be compatible with both APIs
export interface VolunteerOpportunity {
  id: string;
  title: string;
  organization: string;
  organizationLogo?: string;
  location: string;
  description: string;
  type: 'volunteer' | 'donation';
  urgency: 'high' | 'medium' | 'low';
  timeCommitment?: string;
  participantsNeeded?: number;
  latitude?: number;  // Make sure these are optional for compatibility
  longitude?: number; // Make sure these are optional for compatibility
  contactUrl?: string;
  website?: string;
  isRemote: boolean;
  categories: string[];
  dateRange: string;
  scope: 'local' | 'regional' | 'national';
}

// Your existing local Opportunity type
export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  description: string;
  type: 'volunteer' | 'donation';
  urgency: 'high' | 'medium' | 'low';
  timeCommitment?: string;
  participantsNeeded?: number;
  latitude?: number;  // Add these to your local type too
  longitude?: number; // Add these to your local type too
}

export interface SearchFilters {
  location?: string;
  countryCode?: string;
  areaCode?: string;
  type?: string;
  urgency?: string;
  keyword?: string;
  page?: number;
}