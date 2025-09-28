import { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection, type SearchFilters } from './components/HeroSection.tsx';
import { OpportunityGrid } from './components/OpportunityGrid.tsx';
import { GoogleMapView, InlineGoogleMap } from './components/map/GoogleMapView.tsx';
import { SubmissionForm, type OpportunityFormData } from './components/SubmissionForm.tsx';
import { Footer } from './components/Footer.tsx';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner.tsx';
import { type Opportunity } from './components/OpportunityCard';

// Extended opportunity type that includes coordinates
interface OpportunityWithCoords extends Opportunity {
  latitude?: number;
  longitude?: number;
}
import { useVolunteerConnector } from './hooks/useVolunteerConnector.ts';
import { SearchFilters as APISearchFilters, VolunteerOpportunity } from './types';
import React from 'react';

// Transform your SearchFilters to API SearchFilters
const transformFiltersToAPI = (filters: SearchFilters): APISearchFilters => {
  return {
    countryCode: '1', // USA
    keyword: filters.query,
  };
};

// Transform API opportunities to your existing Opportunity type
const transformAPIOpportunityToLocal = (apiOpportunity: any): Opportunity => {
  const baseOpportunity: Opportunity = {
    id: apiOpportunity.id,
    title: apiOpportunity.title,
    organization: apiOpportunity.organization,
    location: apiOpportunity.location,
    description: apiOpportunity.description,
    type: apiOpportunity.type,
    urgency: apiOpportunity.urgency,
    timeCommitment: apiOpportunity.timeCommitment,
    participantsNeeded: apiOpportunity.participantsNeeded,
  };

  // Add latitude/longitude if they exist in the API response
  if (apiOpportunity.latitude && apiOpportunity.longitude) {
    (baseOpportunity as any).latitude = apiOpportunity.latitude;
    (baseOpportunity as any).longitude = apiOpportunity.longitude;
  }

  return baseOpportunity;
};

// Keep mock data as fallback - Updated for Tempe
const mockOpportunities: OpportunityWithCoords[] = [
  {
    id: '1',
    title: 'Emergency Heat Relief Distribution',
    organization: 'Tempe Community Action',
    location: 'Downtown Tempe',
    description: 'Help distribute cooling supplies and water during extreme heat events in the Tempe area. Critical summer volunteer opportunity.',
    type: 'volunteer',
    urgency: 'high',
    timeCommitment: '4-6 hours',
    participantsNeeded: 15,
    latitude: 33.4255,
    longitude: -111.9400,
  },
  {
    id: '2',
    title: 'ASU Student Food Pantry',
    organization: 'Arizona State University',
    location: 'ASU Campus',
    description: 'Support food security for ASU students by helping sort and distribute food at the campus pantry. Ongoing volunteer opportunity.',
    type: 'volunteer',
    urgency: 'medium',
    timeCommitment: '3 hours/week',
    participantsNeeded: 12,
    latitude: 33.4242,
    longitude: -111.9281,
  },
  {
    id: '3',
    title: 'Tempe Town Lake Cleanup',
    organization: 'Keep Tempe Beautiful',
    location: 'Tempe Town Lake',
    description: 'Join monthly cleanup events at Tempe Town Lake to keep our community spaces clean and beautiful for everyone to enjoy.',
    type: 'volunteer',
    urgency: 'low',
    timeCommitment: '2-3 hours',
    participantsNeeded: 8,
    latitude: 33.4297,
    longitude: -111.9398,
  },
  {
    id: '4',
    title: 'School Supply Collection',
    organization: 'Tempe Elementary District',
    location: 'South Tempe',
    description: 'Donate essential school supplies to students from low-income families. Notebooks, pencils, backpacks, and calculators needed.',
    type: 'donation',
    urgency: 'medium',
    timeCommitment: undefined,
    participantsNeeded: undefined,
    latitude: 33.3950,
    longitude: -111.9400,
  },
  {
    id: '5',
    title: 'Senior Technology Support',
    organization: 'Tempe Senior Services',
    location: 'North Tempe',
    description: 'Help seniors learn to use smartphones and computers to stay connected with family and access important services.',
    type: 'volunteer',
    urgency: 'medium',
    timeCommitment: '2 hours/week',
    participantsNeeded: 10,
    latitude: 33.4550,
    longitude: -111.9400,
  },
  {
    id: '6',
    title: 'Desert Medical Equipment Drive',
    organization: 'Phoenix Healthcare Coalition',
    location: 'Mesa',
    description: 'Donate medical equipment such as wheelchairs, walkers, and mobility aids for East Valley community members in need.',
    type: 'donation',
    urgency: 'low',
    timeCommitment: undefined,
    participantsNeeded: undefined,
    latitude: 33.4152,
    longitude: -111.8315,
  },
];

export default function App() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: 'all',
    location: '',
    query: '',
  });
  
  const { 
    opportunities: apiOpportunities, 
    loading, 
    error, 
    searchOpportunities,
    loadMore,
    hasMore
  } = useVolunteerConnector({
    countryCode: '1',  // USA
  });

  const [filteredOpportunities, setFilteredOpportunities] = useState<OpportunityWithCoords[]>([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  // Transform API opportunities to local format and apply local filters
  useEffect(() => {
    let opportunities: OpportunityWithCoords[];
    
    if (error || apiOpportunities.length === 0) {
      // Fallback to mock data if API fails or no data
      opportunities = mockOpportunities;
      console.log('Using fallback mock data due to:', error || 'No API data');
    } else {
      // Transform API opportunities to local format
      opportunities = apiOpportunities.map(transformAPIOpportunityToLocal);
    }

    // Apply local filters
    let filtered = [...opportunities];

    // Filter by type
    if (searchFilters.type !== 'all') {
      filtered = filtered.filter(opp => opp.type === searchFilters.type);
    }

    // Filter by location
    if (searchFilters.location) {
      filtered = filtered.filter(opp => 
        opp.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    // Filter by search query
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.organization.toLowerCase().includes(query)
      );
    }

    setFilteredOpportunities(filtered);
  }, [apiOpportunities, searchFilters, error]);

  const handleSearch = async (filters: SearchFilters) => {
    setSearchFilters(filters);
    
    // If there's a search query, make a new API call
    if (filters.query) {
      const apiFilters = transformFiltersToAPI(filters);
      await searchOpportunities(apiFilters);
    }
    
    // Scroll to results
    const resultsSection = document.querySelector('.opportunity-grid');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMore = (opportunityId: string) => {
    // Find the opportunity (first check API data, then mock data)
    const opportunity = apiOpportunities.find(opp => opp.id === opportunityId) ||
                      mockOpportunities.find(opp => opp.id === opportunityId);
    
    if (opportunity && 'contactUrl' in opportunity) {
      // If it's an API opportunity with a contact URL, open it
      window.open(opportunity.contactUrl, '_blank');
    } else {
      toast.info(`Learn more about opportunity ${opportunityId}`, {
        description: 'Feature coming soon - detailed opportunity view',
      });
    }
  };

  const handleApply = (opportunityId: string) => {
    // Find the opportunity
    const opportunity = apiOpportunities.find(opp => opp.id === opportunityId);
    
    if (opportunity && 'contactUrl' in opportunity) {
      // If it's an API opportunity, redirect to their application
      window.open(opportunity.contactUrl, '_blank');
      toast.success('Redirecting to application!', {
        description: 'Opening the organization\'s application page...',
      });
    } else {
      toast.success('Application started!', {
        description: 'Redirecting to application form...',
      });
    }
  };

  const handleSubmitOpportunity = (data: OpportunityFormData) => {
    toast.success('Opportunity submitted successfully!', {
      description: 'Your opportunity will be reviewed and published soon.',
    });
    console.log('Submitted opportunity:', data);
  };

  // Show loading state
  if (loading && filteredOpportunities.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading volunteer opportunities...</p>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection onSearch={handleSearch} />
        
        {/* Show info message if using fallback data */}
        {error && (
          <div className="container mx-auto px-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800">
                ℹ️ Currently showing sample volunteer opportunities for the Tempe area.
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Live volunteer data integration is being updated. Sample data reflects typical opportunities in the Phoenix metro area.
              </p>
            </div>
          </div>
        )}
        
        <div className="opportunity-grid">
          <OpportunityGrid
            opportunities={filteredOpportunities}
            onShowMap={() => setIsMapOpen(true)}
            onSubmitOpportunity={() => setIsSubmissionFormOpen(true)}
            onLearnMore={handleLearnMore}
            onApply={handleApply}
          />
        </div>
        
        {/* Show load more button if there are more opportunities */}
        {hasMore && !loading && (
          <div className="container mx-auto px-4 py-8 text-center">
            <button
              onClick={loadMore}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
            >
              Load More Opportunities
            </button>
          </div>
        )}
        
        {/* INLINE MAP SECTION - Only show if we have opportunities */}
        {filteredOpportunities.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl text-primary font-['Roboto_Slab'] font-semibold mb-2">
                  Opportunities Near You
                </h2>
                <p className="text-muted-foreground">
                  Interactive map showing volunteer and donation opportunities in the Tempe area
                </p>
              </div>

              {/* Use InlineGoogleMap for the inline display */}
              <InlineGoogleMap 
                opportunities={addCoordinatesToOpportunities(filteredOpportunities)}
                center={{ lat: 33.4255, lng: -111.9400 }}
                zoom={12}
              />
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* MODAL MAP - Only for full-screen view */}
      <GoogleMapView
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        opportunities={addCoordinatesToOpportunities(filteredOpportunities)}
        center={{ lat: 33.4255, lng: -111.9400 }}
        zoom={12}
      />
      
      <SubmissionForm
        isOpen={isSubmissionFormOpen}
        onClose={() => setIsSubmissionFormOpen(false)}
        onSubmit={handleSubmitOpportunity}
      />

      <Toaster />
    </div>
  );
}

// Helper function to add coordinates to opportunities for map display
function addCoordinatesToOpportunities(opportunities: Opportunity[]): VolunteerOpportunity[] {
  return opportunities.map(opp => {
    // If the opportunity already has coordinates, use them
    const oppWithCoords = opp as OpportunityWithCoords;
    if (oppWithCoords.latitude && oppWithCoords.longitude) {
      return {
        id: opp.id,
        title: opp.title,
        organization: opp.organization,
        organizationLogo: undefined,
        location: opp.location,
        description: opp.description,
        type: opp.type,
        urgency: opp.urgency,
        participantsNeeded: opp.participantsNeeded,
        latitude: oppWithCoords.latitude,
        longitude: oppWithCoords.longitude,
        contactUrl: 'https://example.com/volunteer',
        website: 'https://example.com',
        isRemote: opp.location.toLowerCase().includes('remote') || opp.location.toLowerCase().includes('online'),
        categories: [opp.type === 'volunteer' ? 'Volunteer Work' : 'Donation Drive'],
        dateRange: 'Ongoing',
        scope: 'local' as const,
      };
    }
    
    // Otherwise, assign coordinates based on location
    const coords = getTempeCoordinates(opp.location);
    return {
      id: opp.id,
      title: opp.title,
      organization: opp.organization,
      organizationLogo: undefined,
      location: opp.location,
      description: opp.description,
      type: opp.type,
      urgency: opp.urgency,
      timeCommitment: opp.timeCommitment || 'Not specified',
      participantsNeeded: opp.participantsNeeded,
      latitude: coords.lat,
      longitude: coords.lng,
      contactUrl: 'https://example.com/volunteer',
      website: 'https://example.com',
      isRemote: opp.location.toLowerCase().includes('remote') || opp.location.toLowerCase().includes('online'),
      categories: [opp.type === 'volunteer' ? 'Volunteer Work' : 'Donation Drive'],
      dateRange: 'Ongoing',
      scope: 'local' as const,
    };
  });
}

// Helper function to assign coordinates to Tempe locations
function getTempeCoordinates(location: string): { lat: number; lng: number } {
  const locationMap: Record<string, { lat: number; lng: number }> = {
    'Downtown Tempe': { lat: 33.4255, lng: -111.9400 },
    'ASU Campus': { lat: 33.4242, lng: -111.9281 },
    'Mill Avenue District': { lat: 33.4254, lng: -111.9408 },
    'Tempe Town Lake': { lat: 33.4297, lng: -111.9398 },
    'South Tempe': { lat: 33.3950, lng: -111.9400 },
    'North Tempe': { lat: 33.4550, lng: -111.9400 },
    'East Tempe': { lat: 33.4255, lng: -111.9100 },
    'West Tempe': { lat: 33.4255, lng: -111.9700 },
    'Mesa': { lat: 33.4152, lng: -111.8315 },
    'Chandler': { lat: 33.3062, lng: -111.8413 },
    'Scottsdale': { lat: 33.4942, lng: -111.9261 },
    'Phoenix': { lat: 33.4484, lng: -112.0740 },
    'Remote/Online': { lat: 33.4255, lng: -111.9400 },
    // Default mappings
    'Downtown': { lat: 33.4255, lng: -111.9400 },
    'North Side': { lat: 33.4550, lng: -111.9400 },
    'South Side': { lat: 33.3950, lng: -111.9400 },
    'East Side': { lat: 33.4255, lng: -111.9100 },
    'West Side': { lat: 33.4255, lng: -111.9700 },
    'Suburbs': { lat: 33.4100, lng: -111.9300 },
    'Tempe': { lat: 33.4255, lng: -111.9400 },
  };

  const lowerLocation = location.toLowerCase();
  
  // Try exact match first
  for (const [key, coords] of Object.entries(locationMap)) {
    if (key.toLowerCase() === lowerLocation) {
      return coords;
    }
  }
  
  // Try partial match
  for (const [key, coords] of Object.entries(locationMap)) {
    if (lowerLocation.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerLocation)) {
      return coords;
    }
  }
  
  // Default to Tempe center
  return { lat: 33.4255, lng: -111.9400 };
}