import { useState } from 'react';
import { X, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import React from 'react';


interface SubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OpportunityFormData) => void;
}

export interface OpportunityFormData {
  title: string;
  organization: string;
  type: 'volunteer' | 'donation';
  urgency: 'high' | 'medium' | 'low';
  location: string;
  description: string;
  timeCommitment?: string;
  participantsNeeded?: number;
  contactEmail: string;
  contactPhone?: string;
  deadline?: string;
}

export function SubmissionForm({ isOpen, onClose, onSubmit }: SubmissionFormProps) {
  const [formData, setFormData] = useState<OpportunityFormData>({
    title: '',
    organization: '',
    type: 'volunteer',
    urgency: 'medium',
    location: '',
    description: '',
    timeCommitment: '',
    participantsNeeded: undefined,
    contactEmail: '',
    contactPhone: '',
    deadline: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(formData);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      title: '',
      organization: '',
      type: 'volunteer',
      urgency: 'medium',
      location: '',
      description: '',
      timeCommitment: '',
      participantsNeeded: undefined,
      contactEmail: '',
      contactPhone: '',
      deadline: '',
    });
    
    onClose();
  };

  const handleInputChange = (field: keyof OpportunityFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl text-primary font-['Roboto_Slab'] font-semibold">
            Submit New Opportunity
          </h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg text-primary font-['Roboto_Slab'] font-medium">
                Basic Information
              </h3>
              
              <div>
                <Label htmlFor="title">Opportunity Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Emergency Food Distribution"
                  className="border-primary/30 focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="organization">Organization Name *</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  placeholder="e.g., Community Food Bank"
                  className="border-primary/30 focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label>Opportunity Type *</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="volunteer" id="volunteer" />
                    <Label htmlFor="volunteer">🤝 Volunteer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donation" id="donation" />
                    <Label htmlFor="donation">💝 Donation</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger className="border-primary/30 focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Need</SelectItem>
                    <SelectItem value="medium">Medium Need</SelectItem>
                    <SelectItem value="low">Low Need</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location & Details */}
            <div className="space-y-4">
              <h3 className="text-lg text-primary font-['Roboto_Slab'] font-medium">
                Location & Details
              </h3>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Downtown Community Center"
                    className="pl-10 border-primary/30 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the opportunity..."
                  className="border-primary/30 focus:border-primary min-h-[100px]"
                  required
                />
              </div>

              {formData.type === 'volunteer' && (
                <>
                  <div>
                    <Label htmlFor="timeCommitment">Time Commitment</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="timeCommitment"
                        value={formData.timeCommitment}
                        onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                        placeholder="e.g., 4-6 hours or 2 hours/week"
                        className="pl-10 border-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="participantsNeeded">Participants Needed</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="participantsNeeded"
                        type="number"
                        value={formData.participantsNeeded || ''}
                        onChange={(e) => handleInputChange('participantsNeeded', parseInt(e.target.value) || undefined)}
                        placeholder="Number of volunteers needed"
                        className="pl-10 border-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="pl-10 border-primary/30 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg text-primary font-['Roboto_Slab'] font-medium">
                Contact Information
              </h3>

              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="contact@organization.org"
                  className="border-primary/30 focus:border-primary"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="border-primary/30 focus:border-primary"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title || !formData.organization || !formData.location || !formData.description || !formData.contactEmail}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Opportunity'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}