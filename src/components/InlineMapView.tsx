import React from 'react';
import { GoogleMapView } from './map/GoogleMapView.tsx';
import { VolunteerOpportunity } from '../types';

interface InlineMapViewProps {
  opportunities: VolunteerOpportunity[];
}

export function InlineMapView({ opportunities }: InlineMapViewProps) {
  if (opportunities.length === 0) {
    return null;
  }

  // Add coordinates to opportunities that don't have them
  const opportunitiesWithCoords = opportunities.map(opp => {
    if (!opp.latitude || !opp.longitude) {
      // Default coordinates for different Tempe areas
      const tempeCoords = getTempeCoordinates(opp.location);
      return {
        ...opp,
        latitude: tempeCoords.lat,
        longitude: tempeCoords.lng
      };
    }
    return opp;
  });

  return (
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

        <GoogleMapView 
          opportunities={opportunitiesWithCoords}
          center={{ lat: 33.4255, lng: -111.9400 }} // Tempe center
          zoom={12}
        />
      </div>
    </section>
  );
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
    'Remote/Online': { lat: 33.4255, lng: -111.9400 }, // Default to Tempe center
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