export interface VolunteerConnectorActivity {
  name: string;
  category: string;
}

export interface VolunteerConnectorOrganization {
  name: string;
  logo: string;
  url: string;
}

export interface VolunteerConnectorAudience {
  scope: 'local' | 'regional' | 'national';
  regions?: string[];
  longitude?: number;
  latitude?: number;
}

export interface VolunteerConnectorOpportunity {
  id: number;
  url: string;
  title: string;
  description: string;
  remote_or_online: boolean;
  organization: VolunteerConnectorOrganization;
  activities: VolunteerConnectorActivity[];
  dates: string;
  duration: string | null;
  audience: VolunteerConnectorAudience;
}

export interface VolunteerConnectorApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VolunteerConnectorOpportunity[];
}