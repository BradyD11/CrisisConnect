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
import React from 'react';


// Mock data for opportunities
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
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  // Filter opportunities based on search criteria
  useEffect(() => {
    let filtered = [...mockOpportunities];

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
  }, [searchFilters]);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    // Scroll to results
    const resultsSection = document.querySelector('.opportunity-grid');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMore = (opportunityId: string) => {
    toast.info(`Learn more about opportunity ${opportunityId}`, {
      description: 'Feature coming soon - detailed opportunity view',
    });
  };

  const handleApply = (opportunityId: string) => {
    toast.success('Application started!', {
      description: 'Redirecting to application form...',
    });
  };

  const handleSubmitOpportunity = (data: OpportunityFormData) => {
    toast.success('Opportunity submitted successfully!', {
      description: 'Your opportunity will be reviewed and published soon.',
    });
    console.log('Submitted opportunity:', data);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection onSearch={handleSearch} />
        
        <div className="opportunity-grid">
          <OpportunityGrid
            opportunities={filteredOpportunities}
            onShowMap={() => setIsMapOpen(true)}
            onSubmitOpportunity={() => setIsSubmissionFormOpen(true)}
            onLearnMore={handleLearnMore}
            onApply={handleApply}
          />
        </div>
        
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