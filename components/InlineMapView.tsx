import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { type Opportunity } from './OpportunityCard';
import React from 'react';


interface InlineMapViewProps {
  opportunities: Opportunity[];
}

// Location mapping to coordinates for the map
const locationCoordinates: Record<string, { x: number; y: number }> = {
  'Downtown': { x: 45, y: 30 },
  'North Side': { x: 25, y: 20 },
  'East Side': { x: 70, y: 50 },
  'West Side': { x: 60, y: 75 },
  'South Side': { x: 30, y: 65 },
  'Suburbs': { x: 80, y: 40 },
};

export function InlineMapView({ opportunities }: InlineMapViewProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);

  // Map opportunities to include coordinates
  const mapOpportunities = opportunities.map(opp => ({
    ...opp,
    coordinates: locationCoordinates[opp.location] || { x: 50, y: 50 }
  }));

  const selectedOpp = mapOpportunities.find(opp => opp.id === selectedOpportunity);

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl text-primary font-['Roboto_Slab'] font-semibold mb-2">
            Opportunity Locations
          </h2>
          <p className="text-muted-foreground">
            Click on the pins to view opportunity details
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="lg:flex">
            {/* Map Container */}
            <div className="lg:flex-1 relative bg-gradient-to-br from-green-50 to-blue-50 h-96 lg:h-[500px]">
              {/* Mock Map Background */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Mock streets */}
                  <line x1="0" y1="30" x2="100" y2="30" stroke="#94a3b8" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="100" y2="60" stroke="#94a3b8" strokeWidth="0.5" />
                  <line x1="30" y1="0" x2="30" y2="100" stroke="#94a3b8" strokeWidth="0.5" />
                  <line x1="70" y1="0" x2="70" y2="100" stroke="#94a3b8" strokeWidth="0.5" />
                  {/* Mock landmarks */}
                  <rect x="20" y="20" width="20" height="15" fill="#e2e8f0" />
                  <rect x="60" y="40" width="15" height="20" fill="#e2e8f0" />
                  <circle cx="40" cy="70" r="8" fill="#bbf7d0" />
                </svg>
              </div>

              {/* Map Pins */}
              {mapOpportunities.map((opportunity) => (
                <button
                  key={opportunity.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 hover:scale-110 ${
                    selectedOpportunity === opportunity.id ? 'scale-110 z-10' : ''
                  }`}
                  style={{
                    left: `${opportunity.coordinates.x}%`,
                    top: `${opportunity.coordinates.y}%`,
                  }}
                  onClick={() => setSelectedOpportunity(
                    selectedOpportunity === opportunity.id ? null : opportunity.id
                  )}
                >
                  <div className={`relative ${opportunity.type === 'volunteer' ? 'text-primary' : 'text-accent'}`}>
                    <MapPin className="h-8 w-8 drop-shadow-lg" fill="currentColor" />
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white text-xs">
                      {opportunity.type === 'volunteer' ? '🤝' : '💝'}
                    </div>
                  </div>
                </button>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4">
                <h4 className="font-medium text-sm mb-3">Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" fill="currentColor" />
                    <span>Volunteer Opportunities</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-accent mr-2" fill="currentColor" />
                    <span>Donation Opportunities</span>
                  </div>
                </div>
              </div>

              {/* Current Location Button */}
              <Button
                className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-gray-700 shadow-md"
                size="sm"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200">
              {selectedOpp ? (
                <div className="p-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-primary font-['Roboto_Slab'] leading-tight">
                          {selectedOpp.title}
                        </CardTitle>
                        <Badge 
                          className={selectedOpp.urgency === 'high' 
                            ? 'bg-primary text-white' 
                            : selectedOpp.urgency === 'medium'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-gray-200 text-gray-700'
                          }
                        >
                          {selectedOpp.urgency === 'high' ? 'High Need' : 
                           selectedOpp.urgency === 'medium' ? 'Medium Need' : 'Low Need'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedOpp.organization}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        📍 {selectedOpp.location}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm">
                          <span className="text-lg mr-2">
                            {selectedOpp.type === 'volunteer' ? '🤝' : '💝'}
                          </span>
                          <span className="capitalize">{selectedOpp.type} Opportunity</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {selectedOpp.description}
                        </p>

                        {selectedOpp.type === 'volunteer' && (
                          <div className="text-sm space-y-1">
                            {selectedOpp.timeCommitment && (
                              <p><span className="font-medium">Time:</span> {selectedOpp.timeCommitment}</p>
                            )}
                            {selectedOpp.participantsNeeded && (
                              <p><span className="font-medium">Volunteers needed:</span> {selectedOpp.participantsNeeded}</p>
                            )}
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                            {selectedOpp.type === 'volunteer' ? 'Volunteer Now' : 'Donate Now'}
                          </Button>
                          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground h-full flex flex-col justify-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click on a pin to view opportunity details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}