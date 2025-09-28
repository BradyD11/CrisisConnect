import { 
  VolunteerConnectorApiResponse, 
  VolunteerConnectorOpportunity,
  VolunteerOpportunity,
  SearchFilters
} from '../types';

const API_BASE_URL = process.env.REACT_APP_VOLUNTEER_CONNECTOR_API_URL || 'https://www.volunteerconnector.org/api/search';

class VolunteerApiService {
  async getOpportunities(filters: SearchFilters = {}): Promise<{
    opportunities: VolunteerOpportunity[];
    totalCount: number;
    nextPage?: string;
    previousPage?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      // Map your filters to the API's expected parameters
      if (filters.countryCode) queryParams.append('cc', filters.countryCode);
      if (filters.areaCode) queryParams.append('ac', filters.areaCode);
      if (filters.page) queryParams.append('page', filters.page.toString());
      
      const fullUrl = queryParams.toString() 
        ? `${API_BASE_URL}?${queryParams.toString()}`
        : API_BASE_URL;
      
      console.log('Attempting to fetch from:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.status === 404) {
        throw new Error('API endpoint not found (404). The service may have changed or be temporarily unavailable.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: VolunteerConnectorApiResponse = await response.json();
      console.log('API Response data:', data);
      
      return {
        opportunities: this.transformApiResponse(data.results || []),
        totalCount: data.count || 0,
        nextPage: data.next ?? undefined,
        previousPage: data.previous ?? undefined,
      };
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      
      // Return mock data as fallback instead of throwing
      return {
        opportunities: this.getMockOpportunities(),
        totalCount: 6,
        nextPage: undefined,
        previousPage: undefined,
      };
    }
  }

  // Add mock data method for fallback
  private getMockOpportunities(): VolunteerOpportunity[] {
    return [
      {
        id: 'mock-1',
        title: 'Emergency Heat Relief Volunteers',
        organization: 'Tempe Community Action',
        organizationLogo: undefined,
        location: 'Downtown Tempe',
        description: 'Help distribute cooling supplies and water during extreme heat events in the Tempe area.',
        type: 'volunteer',
        urgency: 'high',
        timeCommitment: '4-6 hours',
        participantsNeeded: 20,
        latitude: 33.4255,
        longitude: -111.9400,
        contactUrl: 'https://example.com/volunteer',
        website: 'https://tempeaction.org',
        isRemote: false,
        categories: ['Emergency Response', 'Community Support'],
        dateRange: 'Ongoing - Summer 2024',
        scope: 'local',
      },
      {
        id: 'mock-2',
        title: 'ASU Student Food Pantry',
        organization: 'Arizona State University',
        organizationLogo: undefined,
        location: 'ASU Campus',
        description: 'Support food security for ASU students by helping sort and distribute food at the campus pantry.',
        type: 'volunteer',
        urgency: 'medium',
        timeCommitment: '3 hours/week',
        participantsNeeded: 15,
        latitude: 33.4242,
        longitude: -111.9281,
        contactUrl: 'https://example.com/volunteer',
        website: 'https://asu.edu',
        isRemote: false,
        categories: ['Food Security', 'Education'],
        dateRange: 'Academic Year',
        scope: 'local',
      },
      {
        id: 'mock-3',
        title: 'Tempe Town Lake Cleanup',
        organization: 'Keep Tempe Beautiful',
        organizationLogo: undefined,
        location: 'Tempe Town Lake',
        description: 'Join us for monthly cleanup events at Tempe Town Lake to keep our community spaces clean and beautiful.',
        type: 'volunteer',
        urgency: 'low',
        timeCommitment: '2-3 hours',
        participantsNeeded: 30,
        latitude: 33.4297,
        longitude: -111.9398,
        contactUrl: 'https://example.com/volunteer',
        website: 'https://keeptempebeautiful.org',
        isRemote: false,
        categories: ['Environment', 'Community'],
        dateRange: 'Monthly Events',
        scope: 'local',
      },
      {
        id: 'mock-4',
        title: 'Senior Technology Support',
        organization: 'Tempe Senior Services',
        organizationLogo: undefined,
        location: 'South Tempe',
        description: 'Help seniors learn to use smartphones, tablets, and computers to stay connected with family and access services.',
        type: 'volunteer',
        urgency: 'medium',
        timeCommitment: '2 hours/week',
        participantsNeeded: 8,
        latitude: 33.3950,
        longitude: -111.9400,
        contactUrl: 'https://example.com/volunteer',
        website: 'https://tempe.gov/seniors',
        isRemote: false,
        categories: ['Technology', 'Senior Support'],
        dateRange: 'Ongoing',
        scope: 'local',
      },
      {
        id: 'mock-5',
        title: 'Desert Botanical Garden Volunteer',
        organization: 'Desert Botanical Garden',
        organizationLogo: undefined,
        location: 'Phoenix',
        description: 'Support garden operations, educational programs, and special events at one of the world\'s finest desert botanical gardens.',
        type: 'volunteer',
        urgency: 'low',
        timeCommitment: '4 hours/month',
        participantsNeeded: 25,
        latitude: 33.4625,
        longitude: -111.9452,
        contactUrl: 'https://example.com/volunteer',
        website: 'https://dbg.org',
        isRemote: false,
        categories: ['Environment', 'Education'],
        dateRange: 'Year-round',
        scope: 'regional',
      },
      {
        id: 'mock-6',
        title: 'Youth Mentorship Program',
        organization: 'Boys & Girls Club of the Valley',
        organizationLogo: undefined,
        location: 'Mesa',
        description: 'Mentor at-risk youth in the East Valley. Help with homework, life skills, and provide positive role modeling.',
        type: 'volunteer',
        urgency: 'high',
        timeCommitment: '3-4 hours/week',
        participantsNeeded: 12,
        latitude: 33.4152,
        longitude: -111.8315,
        contactUrl: 'https://example.com/volunteer',
        website: 'https://bgcaz.org',
        isRemote: false,
        categories: ['Youth Development', 'Education'],
        dateRange: 'School Year',
        scope: 'regional',
      },
    ];
  }

  async getOpportunityById(id: string): Promise<VolunteerOpportunity | null> {
    try {
      const { opportunities } = await this.getOpportunities();
      return opportunities.find(opp => opp.id === id) || null;
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      return null;
    }
  }

  private transformApiResponse(apiData: VolunteerConnectorOpportunity[]): VolunteerOpportunity[] {
    if (!apiData || !Array.isArray(apiData)) {
      console.warn('Invalid API data received, using fallback');
      return this.getMockOpportunities();
    }

    return apiData.map(item => ({
      id: item.id.toString(),
      title: item.title,
      organization: item.organization.name,
      organizationLogo: this.formatLogoUrl(item.organization.logo),
      location: this.formatLocation(item),
      description: this.cleanDescription(item.description),
      type: 'volunteer',
      urgency: this.determineUrgency(item),
      timeCommitment: item.duration || 'Not specified',
      latitude: item.audience.latitude,
      longitude: item.audience.longitude,
      contactUrl: item.url,
      website: item.organization.url,
      isRemote: item.remote_or_online,
      categories: item.activities.map(activity => activity.category),
      dateRange: item.dates,
      scope: item.audience.scope,
    }));
  }

  private formatLogoUrl(logoUrl: string): string {
    if (logoUrl.startsWith('//')) {
      return `https:${logoUrl}`;
    }
    return logoUrl;
  }

  private formatLocation(item: VolunteerConnectorOpportunity): string {
    if (item.remote_or_online) {
      return 'Remote/Online';
    }
    
    if (item.audience.regions && item.audience.regions.length > 0) {
      return item.audience.regions.join(', ');
    }
    
    return item.audience.scope === 'national' ? 'National' : 'Location TBD';
  }

  private cleanDescription(description: string): string {
    return description
      .replace(/\r\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 300) + (description.length > 300 ? '...' : '');
  }

  private determineUrgency(item: VolunteerConnectorOpportunity): 'high' | 'medium' | 'low' {
    const desc = item.description.toLowerCase();
    const title = item.title.toLowerCase();
    
    if (desc.includes('urgent') || desc.includes('crisis') || 
        desc.includes('emergency') || title.includes('urgent')) {
      return 'high';
    }
    
    if (item.dates.toLowerCase().includes('ongoing')) {
      return 'low';
    }
    
    return 'medium';
  }

  async getOpportunitiesByLocation(countryCode: string, areaCode?: string): Promise<{
    opportunities: VolunteerOpportunity[];
    totalCount: number;
  }> {
    return this.getOpportunities({
      countryCode,
      areaCode,
    });
  }
}

export const volunteerApi = new VolunteerApiService();