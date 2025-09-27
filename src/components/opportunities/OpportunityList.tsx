import React from 'react';
import { useVolunteerConnector } from '../../hooks/useVolunteerConnector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Users, Clock, ExternalLink } from 'lucide-react';

export function OpportunityList() {
  const { 
    opportunities, 
    loading, 
    error, 
    totalCount, 
    hasMore, 
    loadMore, 
    searchOpportunities 
  } = useVolunteerConnector({
    countryCode: '64', // Canada
    areaCode: '5',     // Alberta
  });

  const handleSearchUS = async () => {
    await searchOpportunities({
      countryCode: '1', // USA
    });
  };

  if (loading && opportunities.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
          <p className="text-destructive">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Volunteer Opportunities ({totalCount})
        </h2>
        <Button onClick={handleSearchUS} variant="outline">
          Search US Opportunities
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">
                    {opportunity.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {opportunity.organization}
                  </CardDescription>
                </div>
                {opportunity.organizationLogo && (
                  <img 
                    src={opportunity.organizationLogo} 
                    alt={opportunity.organization}
                    className="w-12 h-12 rounded-lg ml-2 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {opportunity.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{opportunity.location}</span>
                  {opportunity.isRemote && (
                    <span className="ml-2 px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      Remote
                    </span>
                  )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{opportunity.timeCommitment}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="capitalize">{opportunity.scope} scope</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {opportunity.categories.slice(0, 2).map((category) => (
                  <span 
                    key={category} 
                    className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                  >
                    {category}
                  </span>
                ))}
                {opportunity.categories.length > 2 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                    +{opportunity.categories.length - 2} more
                  </span>
                )}
              </div>

              <div className="pt-2">
                <Button 
                  asChild 
                  className="w-full"
                  size="sm"
                >
                  <a 
                    href={opportunity.contactUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Learn More <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center pt-6">
          <Button 
            onClick={loadMore} 
            disabled={loading}
            variant="outline"
            size="lg"
          >
            {loading ? 'Loading...' : 'Load More Opportunities'}
          </Button>
        </div>
      )}
    </div>
  );
}