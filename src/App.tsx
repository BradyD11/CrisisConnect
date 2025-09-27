import { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection, type SearchFilters } from './components/HeroSection.tsx';
import { OpportunityGrid } from './components/OpportunityGrid.tsx';
import { InlineMapView } from './components/InlineMapView.tsx';
import { MapView } from './components/MapView.tsx';
import { SubmissionForm, type OpportunityFormData } from './components/SubmissionForm.tsx';
import { Footer } from './components/Footer.tsx';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner.tsx';
import { type Opportunity } from './components/OpportunityCard';
import { useVolunteerConnector } from './hooks/useVolunteerConnector.ts';
import { SearchFilters as APISearchFilters } from './types';
import React from 'react';

// Transform your SearchFilters to API SearchFilters
const transformFiltersToAPI = (filters: SearchFilters): APISearchFilters => {
  return {
    countryCode: '64', // Default to Canada - you can make this dynamic
    areaCode: '5',     // Default to Alberta - you can make this dynamic
    keyword: filters.query,
    // Add more mappings as needed
  };
};

// Transform API opportunities to your existing Opportunity type
const transformAPIOpportunityToLocal = (apiOpportunity: any): Opportunity => {
  return {
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
};

// Keep mock data as fallback
const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Emergency Food Distribution',
    organization: 'Community Food Bank',
    location: 'Downtown',
    description: 'Help distribute emergency food supplies to families affected by recent flooding. We need volunteers to help sort, pack, and distribute food packages.',
    type: 'volunteer',
    urgency: 'high',
    timeCommitment: '4-6 hours',
    participantsNeeded: 15,
  },
  {
    id: '2',
    title: 'Winter Clothing Drive',
    organization: 'Warmth for All',
    location: 'North Side',
    description: 'Donate warm clothing items including coats, blankets, gloves, and hats for homeless individuals this winter season.',
    type: 'donation',
    urgency: 'high',
    timeCommitment: undefined,
    participantsNeeded: undefined,
  },
  {
    id: '3',
    title: 'Youth Mentorship Program',
    organization: 'Future Leaders Initiative',
    location: 'East Side',
    description: 'Mentor at-risk youth in our community. Help provide guidance, support, and educational assistance to teenagers.',
    type: 'volunteer',
    urgency: 'medium',
    timeCommitment: '2 hours/week',
    participantsNeeded: 8,
  },
  {
    id: '4',
    title: 'School Supply Collection',
    organization: 'Education First',
    location: 'West Side',
    description: 'Help provide essential school supplies to students from low-income families. Notebooks, pencils, backpacks, and calculators needed.',
    type: 'donation',
    urgency: 'medium',
    timeCommitment: undefined,
    participantsNeeded: undefined,
  },
  {
    id: '5',
    title: 'Elderly Care Assistance',
    organization: 'Senior Support Network',
    location: 'South Side',
    description: 'Provide companionship and assistance with daily tasks for elderly community members who live alone.',
    type: 'volunteer',
    urgency: 'low',
    timeCommitment: '3 hours/week',
    participantsNeeded: 12,
  },
  {
    id: '6',
    title: 'Medical Equipment Donations',
    organization: 'Health Access Coalition',
    location: 'Suburbs',
    description: 'Donate medical equipment such as wheelchairs, walkers, canes, and other mobility aids for community members in need.',
    type: 'donation',
    urgency: 'low',
    timeCommitment: undefined,
    participantsNeeded: undefined,
  },
];

export default function App() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: 'all',
    location: '',
    query: '',
  });
  
  // Use the API hook
  const { 
    opportunities: apiOpportunities, 
    loading, 
    error, 
    searchOpportunities,
    hasMore,
    loadMore 
  } = useVolunteerConnector({
    countryCode: '64', // Canada
    areaCode: '5',     // Alberta
  });

  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  // Transform API opportunities to local format and apply local filters
  useEffect(() => {
    let opportunities: Opportunity[];
    
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

    // Filter by search query (already handled by API, but apply locally too)
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
        
        {/* Show error message if API failed but we have fallback data */}
        {error && (
          <div className="container mx-auto px-4 py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">
                ⚠️ Unable to load live opportunities. Showing sample data.
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                {error}
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
        
        <InlineMapView opportunities={filteredOpportunities} />
      </main>

      <Footer />

      {/* Modals */}
      <MapView
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />
      
      <SubmissionForm
        isOpen={isSubmissionFormOpen}
        onClose={() => setIsSubmissionFormOpen(false)}
        onSubmit={handleSubmitOpportunity}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}