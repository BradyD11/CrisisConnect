import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
import React from 'react';

interface HeroSectionProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  type: 'volunteer' | 'donation' | 'all';
  location: string;
  query: string;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'volunteer' | 'donation' | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const handleSearch = () => {
    onSearch({
      type: selectedType,
      location: selectedLocation === 'all' ? '' : selectedLocation,
      query: searchQuery,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-primary mb-6 font-['Roboto_Slab'] font-bold">
            Volunteer & Donate in Tempe
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with Arizona State University and local Tempe organizations to make a difference in our desert community during times of crisis and beyond.
          </p>
          <div className="mt-4 flex justify-center items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Serving Tempe, Mesa, Chandler, and Greater Phoenix Area</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 md:p-8">
            {/* Type Toggle */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                className={`transition-all duration-200 ${
                  selectedType === 'all'
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'border-primary text-primary hover:bg-primary/10'
                }`}
              >
                All Opportunities
              </Button>
              <Button
                variant={selectedType === 'volunteer' ? 'default' : 'outline'}
                onClick={() => setSelectedType('volunteer')}
                className={`transition-all duration-200 ${
                  selectedType === 'volunteer'
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'border-primary text-primary hover:bg-primary/10'
                }`}
              >
                🤝 Volunteer
              </Button>
              <Button
                variant={selectedType === 'donation' ? 'default' : 'outline'}
                onClick={() => setSelectedType('donation')}
                className={`transition-all duration-200 ${
                  selectedType === 'donation'
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'border-primary text-primary hover:bg-primary/10'
                }`}
              >
                💝 Donation
              </Button>
            </div>

            {/* Search and Filter Row */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 border-primary/30 focus:border-primary"
                />
              </div>

              {/* Location Dropdown */}
              <div className="md:w-64">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="border-primary/30 focus:border-primary">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="downtown">Downtown</SelectItem>
                    <SelectItem value="north-side">North Side</SelectItem>
                    <SelectItem value="south-side">South Side</SelectItem>
                    <SelectItem value="east-side">East Side</SelectItem>
                    <SelectItem value="west-side">West Side</SelectItem>
                    <SelectItem value="suburbs">Suburbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-2 transition-all duration-200"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}