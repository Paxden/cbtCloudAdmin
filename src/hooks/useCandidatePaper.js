/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */


/**
 * Candidate Paper Hook
 * 
 * Hook responsibilities:
 * - State management for candidate papers
 * - Data fetching with React hooks
 * - Loading state management
 * - Error state management
 * - Paper operations (validate, archive, export)
 * 
 * Location: src/hooks/useCandidatePaper.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as candidatePaperService from '../services/package/candidatePaperService.js';

export const useCandidatePapers = () => {
  // State
  const [papers, setPapers] = useState([]);
  const [totalPapers, setTotalPapers] = useState(0);
  const [statistics, setStatistics] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [randomizationData, setRandomizationData] = useState(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  
  // Dialog State
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [randomizationDialogOpen, setRandomizationDialogOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    page: 0,
    limit: 10,
    search: '',
    status: '',
    instanceId: '',
    centreId: '',
    candidateId: '',
    sort: 'createdAt',
    sortOrder: -1,
  });

  // Fetch papers with filters
  const fetchPapers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: filters.page + 1,
        limit: filters.limit,
        search: filters.search || undefined,
        status: filters.status || undefined,
        instanceId: filters.instanceId || undefined,
        centreId: filters.centreId || undefined,
        candidateId: filters.candidateId || undefined,
        sort: filters.sort,
        sortOrder: filters.sortOrder,
      };
      
      const result = await candidatePaperService.getPapers(params);
      
      // Handle both array and object response formats
      const dataArray = Array.isArray(result) ? result : (result.data || []);
      const total = result.meta?.total || result.total || dataArray.length;
      
      setPapers(dataArray);
      setTotalPapers(total);
    } catch (error) {
      console.error('Failed to load papers:', error);
      setPapers([]);
      setTotalPapers(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    setLoadingStatistics(true);
    try {
      // For now, calculate from papers or use a separate endpoint
      // You can add a statistics endpoint if needed
      const stats = {
        total: totalPapers,
        generated: papers.filter(p => p.status === 'GENERATED' || p.status === 'GENERATING').length,
        encrypted: papers.filter(p => p.status === 'ENCRYPTED').length,
        packaged: papers.filter(p => p.status === 'PACKAGED').length,
        activated: papers.filter(p => p.status === 'ACTIVATED').length,
        archived: papers.filter(p => p.status === 'ARCHIVED').length,
        failed: papers.filter(p => p.status === 'FAILED').length,
      };
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      setStatistics({
        total: 0,
        generated: 0,
        encrypted: 0,
        packaged: 0,
        activated: 0,
        archived: 0,
        failed: 0,
      });
    } finally {
      setLoadingStatistics(false);
    }
  }, [papers, totalPapers]);

  // Load data on mount and filter changes
  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  // Update statistics when papers change
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Refresh all data
  const refresh = useCallback(() => {
    fetchPapers();
  }, [fetchPapers]);

  // Filter handlers
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 0,
      limit: 10,
      search: '',
      status: '',
      instanceId: '',
      centreId: '',
      candidateId: '',
      sort: 'createdAt',
      sortOrder: -1,
    });
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((event, newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setFilters(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 0,
    }));
  }, []);

  // Dialog handlers
  const openDetails = useCallback(async (paperId) => {
    setDetailsDrawerOpen(true);
    setLoadingDetails(true);
    try {
      const paper = await candidatePaperService.getPaperById(paperId);
      setSelectedPaper(paper);
    } catch (error) {
      console.error('Failed to load paper details:', error);
      setDetailsDrawerOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsDrawerOpen(false);
    setSelectedPaper(null);
  }, []);

  const openPreview = useCallback(async (paperId) => {
    setPreviewDialogOpen(true);
    try {
      const paper = await candidatePaperService.getPaperById(paperId);
      setPreviewData(paper);
    } catch (error) {
      console.error('Failed to load preview:', error);
      setPreviewDialogOpen(false);
    }
  }, []);

  const closePreview = useCallback(() => {
    setPreviewDialogOpen(false);
    setPreviewData(null);
  }, []);

  const openRandomization = useCallback(async (paperId) => {
    setRandomizationDialogOpen(true);
    try {
      const paper = await candidatePaperService.getPaperById(paperId);
      setRandomizationData(paper);
    } catch (error) {
      console.error('Failed to load randomization data:', error);
      setRandomizationDialogOpen(false);
    }
  }, []);

  const closeRandomization = useCallback(() => {
    setRandomizationDialogOpen(false);
    setRandomizationData(null);
  }, []);

  // Paper operations
  const validatePaper = useCallback(async (paperId) => {
    // Validate paper - update status or perform validation
    // This would call a specific endpoint if available
    const paper = await candidatePaperService.getPaperById(paperId);
    // For now, just refresh the list
    refresh();
    return paper;
  }, [refresh]);

  const archivePaper = useCallback(async (paperId, reason = '') => {
    const result = await candidatePaperService.archivePaper(paperId, reason);
    refresh();
    return result;
  }, [refresh]);

  const exportPapers = useCallback(async () => {
    // Export papers to CSV
    const data = papers.map(paper => ({
      code: paper.paperCode,
      candidate: paper.candidateNumber,
      centre: paper.centreCode,
      questions: paper.questionCount,
      marks: paper.totalMarks,
      status: paper.status,
      created: new Date(paper.createdAt).toLocaleDateString(),
    }));

    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `papers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [papers]);

  return {
    // Data
    papers,
    totalPapers,
    statistics,
    selectedPaper,
    previewData,
    randomizationData,
    
    // UI State
    isLoading,
    loadingDetails,
    loadingStatistics,
    filters,
    detailsDrawerOpen,
    previewDialogOpen,
    randomizationDialogOpen,
    
    // Filter Actions
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    
    // Dialog Actions
    openDetails,
    closeDetails,
    openPreview,
    closePreview,
    openRandomization,
    closeRandomization,
    
    // Operations
    validatePaper,
    archivePaper,
    exportPapers,
    
    // Utility
    refresh,
  };
};

export default useCandidatePapers;