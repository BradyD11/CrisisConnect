import { 
  VolunteerConnectorApiResponse, 
  VolunteerConnectorOpportunity,
  VolunteerOpportunity,
  SearchFilters
} from '../types';

const API_BASE_URL = process.env.REACT_APP_VOLUNTEER_CONNECTOR_API_URL || 'https://www.volunteerconnector.org/api/search/';

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
      
      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: VolunteerConnectorApiResponse = await response.json();
      
      return {
        opportunities: this.transformApiResponse(data.results),
        totalCount: data.count,
        nextPage: data.next ?? undefined,
        previousPage: data.previous ?? undefined,
      };
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      throw error;
    }
  }

  async getOpportunityById(id: string): Promise<VolunteerOpportunity | null> {
    try {
      // Since the API doesn't seem to have a single opportunity endpoint,
      // we'll search and filter by ID
      const { opportunities } = await this.getOpportunities();
      return opportunities.find(opp => opp.id === id) || null;
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      throw error;
    }
  }

  private transformApiResponse(apiData: VolunteerConnectorOpportunity[]): VolunteerOpportunity[] {
    return apiData.map(item => ({
      id: item.id.toString(),
      title: item.title,
      organization: item.organization.name,
      organizationLogo: this.formatLogoUrl(item.organization.logo),
      location: this.formatLocation(item),
      description: this.cleanDescription(item.description),
      type: 'volunteer', // All seem to be volunteer opportunities
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
    // Handle relative URLs
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
    // Remove excessive whitespace and line breaks
    return description
      .replace(/\r\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 300) + (description.length > 300 ? '...' : '');
  }

  private determineUrgency(item: VolunteerConnectorOpportunity): 'high' | 'medium' | 'low' {
    const desc = item.description.toLowerCase();
    const title = item.title.toLowerCase();
    
    // Check for urgent keywords
    if (desc.includes('urgent') || desc.includes('crisis') || 
        desc.includes('emergency') || title.includes('urgent')) {
      return 'high';
    }
    
    // Check for ongoing vs time-sensitive
    if (item.dates.toLowerCase().includes('ongoing')) {
      return 'low';
    }
    
    return 'medium';
  }

  // Helper method to get location-specific opportunities
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