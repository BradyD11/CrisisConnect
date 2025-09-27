import { useState } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';
import { Badge } from './ui/badge.tsx';
import React from 'react';


interface MapViewProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock map data
const mapOpportunities = [
  {
    id: '1',
    title: 'Emergency Food Distribution',
    organization: 'Community Food Bank',
    type: 'volunteer',
    urgency: 'high',
    coordinates: { x: 45, y: 30 },
  },
  {
    id: '2',
    title: 'Winter Clothing Drive',
    organization: 'Warmth for All',
    type: 'donation',
    urgency: 'high',
    coordinates: { x: 25, y: 20 },
  },
  {
    id: '3',
    title: 'Youth Mentorship Program',
    organization: 'Future Leaders Initiative',
    type: 'volunteer',
    urgency: 'medium',
    coordinates: { x: 70, y: 50 },
  },
  {
    id: '4',
    title: 'School Supply Collection',
    organization: 'Education First',
    type: 'donation',
    urgency: 'medium',
    coordinates: { x: 60, y: 75 },
  },
  {
    id: '5',
    title: 'Elderly Care Assistance',
    organization: 'Senior Support Network',
    type: 'volunteer',
    urgency: 'low',
    coordinates: { x: 30, y: 65 },
  },
];

export function MapView({ isOpen, onClose }: MapViewProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedOpp = mapOpportunities.find(opp => opp.id === selectedOpportunity);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl text-primary font-['Roboto_Slab'] font-semibold">
            Opportunity Map
          </h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 relative bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
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
                onClick={() => setSelectedOpportunity(opportunity.id)}
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
          <div className="w-80 border-l border-gray-200 bg-gray-50">
            {selectedOpp ? (
              <div className="p-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-primary font-['Roboto_Slab']">
                        {selectedOpp.title}
                      </CardTitle>
                      <Badge 
                        className={selectedOpp.urgency === 'high' ? 'bg-primary text-white' : 'bg-accent text-accent-foreground'}
                      >
                        {selectedOpp.urgency === 'high' ? 'High Need' : 'Medium Need'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedOpp.organization}
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
                      <div className="space-y-2">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                          {selectedOpp.type === 'volunteer' ? 'Volunteer Now' : 'Donate Now'}
                        </Button>
                        <Button variant="outline" className="w-full border-primary text-primary">
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click on a pin to view opportunity details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}