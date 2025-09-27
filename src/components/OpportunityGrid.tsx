import { useState } from 'react';
import { OpportunityCard, type Opportunity } from './OpportunityCard';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';
import React from 'react';


interface OpportunityGridProps {
  opportunities: Opportunity[];
  onShowMap: () => void;
  onSubmitOpportunity: () => void;
  onLearnMore: (id: string) => void;
  onApply: (id: string) => void;
}

export function OpportunityGrid({ 
  opportunities, 
  onShowMap, 
  onSubmitOpportunity, 
  onLearnMore, 
  onApply 
}: OpportunityGridProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl text-primary font-['Roboto_Slab'] font-semibold mb-2">
              Available Opportunities
            </h2>
            <p className="text-muted-foreground">
              {opportunities.length} opportunities found
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              onClick={onShowMap}
              className="border-primary text-primary hover:bg-primary/10"
            >
              🗺️ Map View
            </Button>
            <Button
              onClick={onSubmitOpportunity}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              + Submit Opportunity
            </Button>
          </div>
        </div>

        {/* Opportunity Grid */}
        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onLearnMore={onLearnMore}
                onApply={onApply}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl text-primary font-['Roboto_Slab'] font-semibold mb-2">
              No opportunities found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search filters or check back later for new opportunities.
            </p>
            <Button
              onClick={onSubmitOpportunity}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Submit an Opportunity
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}