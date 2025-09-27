export * from './volunteerConnector';

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
  latitude?: number;
  longitude?: number;
  contactUrl?: string;
  website?: string;
  isRemote: boolean;
  categories: string[];
  dateRange: string;
  scope: 'local' | 'regional' | 'national';
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