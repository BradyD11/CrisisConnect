import { useState, useEffect } from 'react';
import { volunteerApi } from '../services/volunteerApi.ts';
import { VolunteerOpportunity, SearchFilters } from '../types';
import { toast } from 'sonner';

export function useVolunteerConnector(initialFilters: SearchFilters = {}) {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | undefined>();
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);

  const fetchOpportunities = async (filters: SearchFilters = currentFilters, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await volunteerApi.getOpportunities(filters);
      
      if (append) {
        setOpportunities(prev => [...prev, ...result.opportunities]);
      } else {
        setOpportunities(result.opportunities);
      }
      
      setTotalCount(result.totalCount);
      setNextPage(result.nextPage);
      setCurrentFilters(filters);
      
      toast.success(`Found ${result.opportunities.length} opportunities`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch opportunities';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (nextPage && !loading) {
      const nextPageNum = new URL(nextPage).searchParams.get('page');
      if (nextPageNum) {
        await fetchOpportunities(
          { ...currentFilters, page: parseInt(nextPageNum) },
          true
        );
      }
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
    hasMore: !!nextPage,
    searchOpportunities,
    loadMore,
    refresh: () => fetchOpportunities(currentFilters),
  };
}