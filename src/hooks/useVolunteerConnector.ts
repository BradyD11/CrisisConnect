import { useState, useEffect } from 'react';
import { volunteerApi } from '../services/volunteerApi.ts';
import { VolunteerOpportunity, SearchFilters } from '../types';
import { toast } from 'sonner';

export function useVolunteerConnector(initialFilters: SearchFilters = {}) {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const fetchOpportunities = async (filters: SearchFilters = currentFilters, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching opportunities with filters:', filters);
      
      const result = await volunteerApi.getOpportunities({
        ...filters,
        page: append ? (currentPage + 1) : 1
      });
      
      // Check if we're getting mock data by looking for specific mock IDs
      const mockIds = ['tempe-1', 'lake-1', 'asu-1', 'senior-1'];
      const usingMock = result.opportunities.some(opp => mockIds.includes(opp.id));
      setIsUsingMockData(usingMock);
      
      if (append) {
        setOpportunities(prev => [...prev, ...result.opportunities]);
        setCurrentPage(prev => prev + 1);
      } else {
        setOpportunities(result.opportunities);
        setCurrentPage(1);
      }
      
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setCurrentFilters(filters);
      
      // Show different messages based on data source
      if (result.opportunities.length > 0) {
        if (usingMock) {
          toast.info(`Showing ${result.opportunities.length} local Tempe opportunities`, {
            description: 'Live API data temporarily unavailable'
          });
        } else {
          toast.success(`Found ${result.opportunities.length} live opportunities`, {
            description: `${result.totalCount} total opportunities available`
          });
        }
      } else {
        toast.info('No opportunities found', {
          description: 'Try adjusting your search filters'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load opportunities';
      setError(errorMessage);
      setIsUsingMockData(true);
      console.error('API Error:', err);
      
      toast.error('Unable to load live data', {
        description: 'Check console for detailed error information'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (hasMore && !loading) {
      await fetchOpportunities(currentFilters, true);
    }
  };

  const searchOpportunities = async (filters: SearchFilters) => {
    await fetchOpportunities(filters, false);
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return {
    opportunities,
    loading,
    error,
    totalCount,
    currentPage,
    hasMore,
    isUsingMockData,
    searchOpportunities,
    loadMore,
    refresh: () => fetchOpportunities(currentFilters),
  };
}