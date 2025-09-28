import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { VolunteerOpportunity } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { X, ExternalLink, MapPin, Clock, Users } from 'lucide-react';

interface GoogleMapViewProps {
  opportunities: VolunteerOpportunity[];
  center?: { lat: number; lng: number };
  zoom?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

// Default center - Tempe, Arizona
const DEFAULT_CENTER = {
  lat: 33.4255,
  lng: -111.9400
};

const MapComponent: React.FC<{
  center: google.maps.LatLngLiteral;
  zoom: number;
  opportunities: VolunteerOpportunity[];
  onMarkerClick: (opportunity: VolunteerOpportunity) => void;
}> = ({ center, zoom, opportunities, onMarkerClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          // Custom map styling for better appearance
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && opportunities.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers: google.maps.Marker[] = [];
      const bounds = new window.google.maps.LatLngBounds();

      opportunities.forEach((opportunity) => {
        if (opportunity.latitude && opportunity.longitude) {
          const position = {
            lat: opportunity.latitude,
            lng: opportunity.longitude
          };

          const marker = new window.google.maps.Marker({
            position,
            map,
            title: opportunity.title,
            icon: {
              url: opportunity.type === 'volunteer' 
                ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                    <path fill="#dc2626" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                    <text x="12" y="13" text-anchor="middle" fill="white" font-size="8">🤝</text>
                  </svg>
                `)
                : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                    <path fill="#ea580c" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                    <text x="12" y="13" text-anchor="middle" fill="white" font-size="8">💝</text>
                  </svg>
                `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 32)
            }
          });

          marker.addListener('click', () => {
            onMarkerClick(opportunity);
          });

          newMarkers.push(marker);
          bounds.extend(position);
        }
      });

      setMarkers(newMarkers);
      
      // Fit map to show all markers
      if (newMarkers.length > 1) {
        map.fitBounds(bounds);
      } else if (newMarkers.length === 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(14);
      }
    }
  }, [map, opportunities, onMarkerClick]);

  return <div ref={ref} className="w-full h-full" />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center text-red-600">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Unable to load map</p>
            <p className="text-sm">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

export function GoogleMapView({ 
  opportunities, 
  center = DEFAULT_CENTER, 
  zoom = 12,
  isOpen = false,
  onClose 
}: GoogleMapViewProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);

  const handleMarkerClick = (opportunity: VolunteerOpportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleApply = (opportunity: VolunteerOpportunity) => {
    if (opportunity.contactUrl) {
      window.open(opportunity.contactUrl, '_blank');
    }
  };

  const filteredOpportunities = opportunities.filter(opp => 
    opp.latitude && opp.longitude
  );

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Tempe Area Volunteer Map</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Map Content */}
          <div className="flex-1 flex">
            <div className="flex-1">
              <Wrapper
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
                render={render}
              >
                <MapComponent
                  center={center}
                  zoom={zoom}
                  opportunities={filteredOpportunities}
                  onMarkerClick={handleMarkerClick}
                />
              </Wrapper>
            </div>

            {/* Sidebar */}
            {selectedOpportunity && (
              <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight">
                        {selectedOpportunity.title}
                      </CardTitle>
                      <Badge 
                        className={
                          selectedOpportunity.urgency === 'high' 
                            ? 'bg-red-600 text-white' 
                            : selectedOpportunity.urgency === 'medium'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-400 text-white'
                        }
                      >
                        {selectedOpportunity.urgency === 'high' ? 'Urgent' : 
                         selectedOpportunity.urgency === 'medium' ? 'Moderate' : 'Ongoing'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {selectedOpportunity.organization}
                    </CardDescription>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedOpportunity.location}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{selectedOpportunity.description}</p>
                    
                    {selectedOpportunity.timeCommitment && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        {selectedOpportunity.timeCommitment}
                      </div>
                    )}
                    
                    {selectedOpportunity.participantsNeeded && (
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2" />
                        {selectedOpportunity.participantsNeeded} volunteers needed
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => handleApply(selectedOpportunity)}
                        className="w-full"
                      >
                        {selectedOpportunity.type === 'volunteer' ? 'Volunteer' : 'Donate'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedOpportunity.latitude},${selectedOpportunity.longitude}`;
                          window.open(url, '_blank');
                        }}
                      >
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filteredOpportunities.length} opportunities on map</span>
              <span>Click markers for details</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline map view
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border">
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
        render={render}
      >
        <MapComponent
          center={center}
          zoom={zoom}
          opportunities={filteredOpportunities}
          onMarkerClick={handleMarkerClick}
        />
      </Wrapper>
    </div>
  );
}

interface InlineGoogleMapProps {
  opportunities: VolunteerOpportunity[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const InlineMapComponent: React.FC<{
  center: google.maps.LatLngLiteral;
  zoom: number;
  opportunities: VolunteerOpportunity[];
}> = ({ center, zoom, opportunities }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && opportunities.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();

      opportunities.forEach((opportunity) => {
        if (opportunity.latitude && opportunity.longitude) {
          const position = {
            lat: opportunity.latitude,
            lng: opportunity.longitude
          };

          const marker = new window.google.maps.Marker({
            position,
            map,
            title: opportunity.title,
            icon: {
              url: opportunity.type === 'volunteer' 
                ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="#dc2626" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                  </svg>
                `)
                : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="#ea580c" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                  </svg>
                `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 24)
            }
          });

          bounds.extend(position);
        }
      });

      if (opportunities.length > 1) {
        map.fitBounds(bounds);
      }
    }
  }, [map, opportunities]);

  return <div ref={ref} className="w-full h-full" />;
};

const inlineRender = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center text-red-600">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Unable to load map</p>
            <p className="text-sm">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

export function InlineGoogleMap({ 
  opportunities, 
  center = { lat: 33.4255, lng: -111.9400 }, 
  zoom = 12
}: InlineGoogleMapProps) {
  const filteredOpportunities = opportunities.filter(opp => 
    opp.latitude && opp.longitude
  );

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border shadow-lg">
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
        render={inlineRender}
      >
        <InlineMapComponent
          center={center}
          zoom={zoom}
          opportunities={filteredOpportunities}
        />
      </Wrapper>
    </div>
  );
}