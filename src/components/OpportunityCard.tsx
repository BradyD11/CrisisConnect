import React from 'react';
import { MapPin, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  description: string;
  type: 'volunteer' | 'donation';
  urgency: 'high' | 'medium' | 'low';
  timeCommitment?: string;
  participantsNeeded?: number;
  imageUrl?: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onLearnMore: (id: string) => void;
  onApply: (id: string) => void;
}

export function OpportunityCard({ opportunity, onLearnMore, onApply }: OpportunityCardProps) {
  const getTypeIcon = (type: string) => {
    return type === 'volunteer' ? '🤝' : '💝';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-primary text-white';
      case 'medium':
        return 'bg-accent text-accent-foreground';
      case 'low':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'High Need';
      case 'medium':
        return 'Medium Need';
      case 'low':
        return 'Low Need';
      default:
        return 'Low Need';
    }
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 rounded-xl border border-gray-100">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getTypeIcon(opportunity.type)}</div>
            <div className="flex-1">
              <h3 className="text-primary font-['Roboto_Slab'] font-semibold text-lg line-clamp-2">
                {opportunity.title}
              </h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <span className="font-medium">{opportunity.organization}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-3 w-3 mr-1" />
                <span>{opportunity.location}</span>
              </div>
            </div>
          </div>
          <Badge className={`${getUrgencyColor(opportunity.urgency)} text-xs font-medium`}>
            {getUrgencyText(opportunity.urgency)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-foreground text-sm leading-relaxed line-clamp-3 mb-4">
          {opportunity.description}
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {opportunity.timeCommitment && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{opportunity.timeCommitment}</span>
            </div>
          )}
          {opportunity.participantsNeeded && (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{opportunity.participantsNeeded} needed</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            onClick={() => onLearnMore(opportunity.id)}
            className="flex-1 border-primary text-primary hover:bg-primary/10 transition-colors duration-200"
          >
            Learn More
          </Button>
          <Button
            onClick={() => onApply(opportunity.id)}
            className="flex-1 bg-primary hover:bg-primary/90 text-white transition-all duration-200"
          >
            {opportunity.type === 'volunteer' ? 'Volunteer' : 'Donate'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}