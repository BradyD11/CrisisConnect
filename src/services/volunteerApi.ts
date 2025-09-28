import { 
  VolunteerConnectorApiResponse, 
  VolunteerConnectorOpportunity,
  VolunteerOpportunity,
  SearchFilters
} from '../types';

const API_BASE_URL = 'https://www.volunteerconnector.org/api/search/';

class VolunteerApiService {
  private apiAvailable: boolean | null = null;
  private lastApiCheck: number = 0;
  private readonly API_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  async getOpportunities(filters: SearchFilters = {}): Promise<{
    opportunities: VolunteerOpportunity[];
    totalCount: number;
    nextPage?: string;
    previousPage?: string;
    hasMore: boolean;
    currentPage: number;
    totalPages?: number;
    isUsingMockData: boolean;
  }> {
    // Check if we should try the API (not more than once every 5 minutes)
    const now = Date.now();
    const shouldTryApi = this.apiAvailable !== false || (now - this.lastApiCheck) > this.API_CHECK_INTERVAL;

    if (shouldTryApi) {
      try {
        console.log('🔍 Attempting API request...');
        return await this.tryApiRequest(filters);
      } catch (error) {
        console.log('🔄 API unavailable, using enhanced local data');
        this.apiAvailable = false;
        this.lastApiCheck = now;
        
        // Fall through to mock data
      }
    } else {
      console.log('⚡ Using cached local data (API check skipped)');
    }

    return this.getEnhancedMockData(filters);
  }

  private async tryApiRequest(filters: SearchFilters): Promise<{
    opportunities: VolunteerOpportunity[];
    totalCount: number;
    nextPage?: string;
    previousPage?: string;
    hasMore: boolean;
    currentPage: number;
    totalPages?: number;
    isUsingMockData: boolean;
  }> {
    const queryParams = new URLSearchParams();
    
    // // Try different parameter combinations based on the documentation
    // if (filters.countryCode) queryParams.append('cc', filters.countryCode);
    // if (filters.areaCode) queryParams.append('ac', filters.areaCode);
    // if (filters.keyword) queryParams.append('q', filters.keyword);
    
    // If no specific filters, try the exact documented example
    if (!filters.countryCode && !filters.areaCode && !filters.keyword) {
      console.log('🔄 Using exact documented example parameters');
      queryParams.append('cc', '64');  // Canada
      queryParams.append('ac', '5');   // Alberta
      queryParams.append('ac', '131'); // Additional area code
      queryParams.append('ac', '59');  // Additional area code
    }
    
    // Add pagination if supported
    const page = filters.page || 1;
    if (page > 1) {
      queryParams.append('page', page.toString());
    }
    
    const fullUrl = `${API_BASE_URL}?${queryParams.toString()}`;
    
    console.log('🌐 API Request URL:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; CrisisConnect/1.0)',
      },
      signal: AbortSignal.timeout(10000), // Reduced timeout
    });

    console.log('📡 API Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('📄 Raw API Response Length:', responseText.length);
    
    const data: VolunteerConnectorApiResponse = JSON.parse(responseText);
    
    if (!data.results || data.results.length === 0) {
      throw new Error('API returned no results');
    }

    // If we get here, the API worked!
    console.log('✅ API Success! Found', data.results.length, 'opportunities');
    this.apiAvailable = true;
    this.lastApiCheck = Date.now();
    
    const totalCount = data.count || 0;
    const currentPage = page;
    const pageSize = data.results?.length || 20;
    const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;
    
    return {
      opportunities: this.transformApiResponse(data.results),
      totalCount,
      nextPage: data.next || undefined,
      previousPage: data.previous || undefined,
      hasMore: !!data.next,
      currentPage,
      totalPages,
      isUsingMockData: false,
    };
  }

  private getEnhancedMockData(filters: SearchFilters): {
    opportunities: VolunteerOpportunity[];
    totalCount: number;
    nextPage?: string;
    previousPage?: string;
    hasMore: boolean;
    currentPage: number;
    totalPages?: number;
    isUsingMockData: boolean;
  } {
    let mockData = this.getMockOpportunities();
    
    // Apply filters to mock data
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      mockData = mockData.filter(opp => 
        opp.title.toLowerCase().includes(keyword) ||
        opp.description.toLowerCase().includes(keyword) ||
        opp.organization.toLowerCase().includes(keyword) ||
        opp.categories.some(cat => cat.toLowerCase().includes(keyword))
      );
    }

    // Apply location-based filtering
    if (filters.countryCode === '1' || filters.location?.includes('US') || filters.location?.includes('Arizona')) {
      // Keep all data since our mock data is Arizona-based
    } else if (filters.countryCode && filters.countryCode !== '1') {
      // For non-US requests, return empty but indicate we're using mock data
      mockData = [];
    }
    
    const page = filters.page || 1;
    const pageSize = 6;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = mockData.slice(startIndex, endIndex);
    
    return {
      opportunities: paginatedData,
      totalCount: mockData.length,
      nextPage: endIndex < mockData.length ? `page=${page + 1}` : undefined,
      previousPage: page > 1 ? `page=${page - 1}` : undefined,
      hasMore: endIndex < mockData.length,
      currentPage: page,
      totalPages: Math.ceil(mockData.length / pageSize),
      isUsingMockData: true,
    };
  }

  private transformApiResponse(apiData: VolunteerConnectorOpportunity[]): VolunteerOpportunity[] {
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
      latitude: item.audience.latitude || 33.4255,
      longitude: item.audience.longitude || -111.9400,
      contactUrl: item.url,
      website: item.organization.url,
      isRemote: item.remote_or_online,
      categories: item.activities?.map(activity => activity.category) || ['Community Service'],
      dateRange: item.dates || 'Ongoing',
      scope: item.audience.scope || 'local',
    }));
  }

  private formatLogoUrl(logoUrl?: string): string | undefined {
    if (!logoUrl) return undefined;
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
    
    return item.audience.scope === 'national' ? 'National' : 'Local Area';
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
    
    if (item.dates?.toLowerCase().includes('ongoing')) {
      return 'low';
    }
    
    return 'medium';
  }

  // Enhanced mock data with more realistic Arizona/Tempe opportunities
  private getMockOpportunities(): VolunteerOpportunity[] {
    return [
      {
        id: 'tempe-heat-relief',
        title: 'Emergency Heat Relief Distribution',
        organization: 'Tempe Community Action',
        organizationLogo: undefined,
        location: 'Downtown Tempe, AZ',
        description: 'Help distribute cooling supplies, water, and provide air-conditioned shelter during extreme heat events. Critical summer volunteer opportunity to protect vulnerable community members.',
        type: 'volunteer',
        urgency: 'high',
        timeCommitment: '4-6 hours',
        participantsNeeded: 25,
        latitude: 33.4255,
        longitude: -111.9400,
        contactUrl: 'mailto:volunteer@tempeaction.org',
        website: 'https://tempeaction.org',
        isRemote: false,
        categories: ['Emergency Response', 'Community Health', 'Crisis Support'],
        dateRange: 'June - September 2024',
        scope: 'local',
      },
      {
        id: 'asu-food-security',
        title: 'ASU Student Food Pantry Support',
        organization: 'Arizona State University',
        organizationLogo: undefined,
        location: 'ASU Tempe Campus',
        description: 'Support food security for ASU students by helping sort, stock, and distribute food at the campus pantry. Make a direct impact on student success and wellbeing.',
        type: 'volunteer',
        urgency: 'medium',
        timeCommitment: '3-4 hours/week',
        participantsNeeded: 15,
        latitude: 33.4242,
        longitude: -111.9281,
        contactUrl: 'mailto:foodpantry@asu.edu',
        website: 'https://eoss.asu.edu/basicneeds',
        isRemote: false,
        categories: ['Food Security', 'Education Support', 'Student Services'],
        dateRange: 'Academic Year 2024-25',
        scope: 'local',
      },
      {
        id: 'tempe-lake-cleanup',
        title: 'Tempe Town Lake Environmental Cleanup',
        organization: 'Keep Tempe Beautiful',
        organizationLogo: undefined,
        location: 'Tempe Town Lake',
        description: 'Join monthly cleanup events at Tempe Town Lake. Help remove litter, invasive plants, and maintain trails. Keep our community spaces clean and beautiful for everyone.',
        type: 'volunteer',
        urgency: 'low',
        timeCommitment: '2-3 hours',
        participantsNeeded: 35,
        latitude: 33.4297,
        longitude: -111.9398,
        contactUrl: 'mailto:cleanup@keeptempebeautiful.org',
        website: 'https://keeptempebeautiful.org',
        isRemote: false,
        categories: ['Environment', 'Community Beautification', 'Outdoor Service'],
        dateRange: 'First Saturday monthly',
        scope: 'local',
      },
      {
        id: 'senior-tech-support',
        title: 'Senior Technology Support Program',
        organization: 'Tempe Senior Services',
        organizationLogo: undefined,
        location: 'Tempe Senior Center',
        description: 'Help seniors learn smartphones, tablets, and computers to stay connected with family and access important services. Bridge the digital divide in our community.',
        type: 'volunteer',
        urgency: 'medium',
        timeCommitment: '2 hours/week',
        participantsNeeded: 12,
        latitude: 33.4550,
        longitude: -111.9400,
        contactUrl: 'mailto:techhelp@tempe.gov',
        website: 'https://www.tempe.gov/seniors',
        isRemote: false,
        categories: ['Technology Education', 'Senior Support', 'Digital Literacy'],
        dateRange: 'Ongoing program',
        scope: 'local',
      },
      {
        id: 'homeless-outreach',
        title: 'Street Outreach and Resource Connection',
        organization: 'Central Arizona Shelter Services',
        organizationLogo: undefined,
        location: 'Phoenix Metro Area',
        description: 'Join outreach teams providing resources, meals, and connection to services for individuals experiencing homelessness. Help connect people to housing and support services.',
        type: 'volunteer',
        urgency: 'high',
        timeCommitment: '4-5 hours',
        participantsNeeded: 20,
        latitude: 33.4484,
        longitude: -112.0740,
        contactUrl: 'mailto:outreach@cassaz.org',
        website: 'https://www.cassaz.org',
        isRemote: false,
        categories: ['Homelessness', 'Social Services', 'Community Outreach'],
        dateRange: 'Weekly opportunities',
        scope: 'regional',
      },
      {
        id: 'disaster-prep-training',
        title: 'Community Emergency Preparedness Training',
        organization: 'Arizona Red Cross',
        organizationLogo: undefined,
        location: 'Multiple Valley Locations',
        description: 'Help teach community members emergency preparedness skills including first aid, disaster response, and family emergency planning. Build community resilience.',
        type: 'volunteer',
        urgency: 'medium',
        timeCommitment: '6 hours (training + event)',
        participantsNeeded: 8,
        latitude: 33.4734,
        longitude: -112.0268,
        contactUrl: 'mailto:volunteer@redcross.org',
        website: 'https://www.redcross.org/local/arizona',
        isRemote: false,
        categories: ['Emergency Preparedness', 'Education', 'Community Resilience'],
        dateRange: 'Monthly workshops',
        scope: 'regional',
      },
      {
        id: 'youth-mentoring',
        title: 'Crisis Support Youth Mentoring',
        organization: 'Boys & Girls Clubs of Metro Phoenix',
        organizationLogo: undefined,
        location: 'East Valley Clubs',
        description: 'Mentor at-risk youth in academic and life skills. Provide positive role modeling and support for young people facing challenging circumstances.',
        type: 'volunteer',
        urgency: 'medium',
        timeCommitment: '2-3 hours/week',
        participantsNeeded: 10,
        latitude: 33.4152,
        longitude: -111.8315,
        contactUrl: 'mailto:mentor@bgcmp.org',
        website: 'https://www.bgcmp.org',
        isRemote: false,
        categories: ['Youth Development', 'Mentoring', 'Education Support'],
        dateRange: '6-month commitment',
        scope: 'local',
      },
      {
        id: 'food-bank-sorting',
        title: 'Food Bank Warehouse Operations',
        organization: 'St. Mary\'s Food Bank',
        organizationLogo: undefined,
        location: 'Phoenix Warehouse',
        description: 'Help sort, pack, and organize food donations at Arizona\'s largest food bank. Essential work to support food distribution across the state.',
        type: 'volunteer',
        urgency: 'high',
        timeCommitment: '3-4 hours',
        participantsNeeded: 40,
        latitude: 33.4625,
        longitude: -112.1129,
        contactUrl: 'mailto:volunteer@stmarysfoodbank.org',
        website: 'https://www.stmarysfoodbank.org',
        isRemote: false,
        categories: ['Food Security', 'Warehouse Operations', 'Community Support'],
        dateRange: 'Daily opportunities',
        scope: 'regional',
      }
    ];
  }

  async getOpportunityById(id: string): Promise<VolunteerOpportunity | null> {
    try {
      const result = await this.getOpportunities();
      return result.opportunities.find(opp => opp.id === id) || null;
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      return null;
    }
  }

  async getOpportunitiesByLocation(countryCode: string, areaCode?: string): Promise<{
    opportunities: VolunteerOpportunity[];
    totalCount: number;
  }> {
    const result = await this.getOpportunities({
      countryCode,
      areaCode,
    });
    
    return {
      opportunities: result.opportunities,
      totalCount: result.totalCount,
    };
  }

  // Method to manually check if API becomes available
  async checkApiStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}?cc=64&ac=5`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });
      
      this.apiAvailable = response.ok;
      this.lastApiCheck = Date.now();
      return response.ok;
    } catch {
      this.apiAvailable = false;
      this.lastApiCheck = Date.now();
      return false;
    }
  }
}

export const volunteerApi = new VolunteerApiService();