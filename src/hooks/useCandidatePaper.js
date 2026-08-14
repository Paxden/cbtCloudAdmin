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
 * - Paper operations (validate, archive, export, generate)
 * 
 * Location: src/hooks/useCandidatePaper.js
 */

import { useState, useEffect, useCallback } from 'react';
import * as candidatePaperService from '../services/package/candidatePaperService.js';
import * as examInstanceService from '../services/instances/instanceService.js';
import * as centreService from '../services/centres/centreService.js';

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
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);

  // Generation State
  const [generating, setGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState(null);
  const [availableInstances, setAvailableInstances] = useState([]);
  const [availableCentres, setAvailableCentres] = useState([]);
  const [availableCandidates, setAvailableCandidates] = useState([]);

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

  // Fetch available data for generation
  const fetchAvailableData = useCallback(async () => {
    try {
      // Fetch locked instances
      const instancesResult = await examInstanceService.getInstances({
        status: 'LOCKED',
        limit: 100,
      });
      
      // Handle both array and object response formats
      let instances = [];
      if (instancesResult) {
        if (Array.isArray(instancesResult)) {
          instances = instancesResult;
        } else if (instancesResult.data) {
          instances = Array.isArray(instancesResult.data) 
            ? instancesResult.data 
            : (instancesResult.data.data || []);
        }
      }
      setAvailableInstances(instances);

      // Fetch active centres
      const centresResult = await centreService.getCentres({
        status: 'ACTIVE',
        limit: 100,
      });
      
      let centres = [];
      if (centresResult?.data) {
        if (Array.isArray(centresResult.data)) {
          centres = centresResult.data;
        } else if (centresResult.data.data) {
          centres = centresResult.data.data;
        } else if (centresResult.data.centres) {
          centres = centresResult.data.centres;
        }
      }
      setAvailableCentres(centres);

      // TODO: Fetch candidates based on selected instance/centre
      // This can be implemented when a specific instance is selected
      
    } catch (error) {
      console.error('Failed to fetch available data:', error);
    }
  }, []);

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

  // Generate dialog handlers
  const openGenerateDialog = useCallback(() => {
    setGenerateDialogOpen(true);
    fetchAvailableData();
  }, [fetchAvailableData]);

  const closeGenerateDialog = useCallback(() => {
    setGenerateDialogOpen(false);
    setGenerateResult(null);
  }, []);

  // Paper operations
  const validatePaper = useCallback(async (paperId) => {
    // Validate paper - update status or perform validation
    const paper = await candidatePaperService.getPaperById(paperId);
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

  // ============================================================
  // GENERATION FUNCTIONS
  // ============================================================

  /**
   * Generate a single candidate paper
   */
  const generatePaper = useCallback(async (data) => {
    setGenerating(true);
    setGenerateResult(null);
    try {
      const result = await candidatePaperService.generatePaper(data);
      setGenerateResult(result);
      return result;
    } catch (error) {
      console.error('Failed to generate paper:', error);
      throw error;
    } finally {
      setGenerating(false);
    }
  }, []);

  /**
   * Generate papers for all candidates in a centre
   */
  const generateCentrePapers = useCallback(async (data) => {
    setGenerating(true);
    setGenerateResult(null);
    try {
      const result = await candidatePaperService.generateCentrePapers(data);
      setGenerateResult(result);
      return result;
    } catch (error) {
      console.error('Failed to generate centre papers:', error);
      throw error;
    } finally {
      setGenerating(false);
    }
  }, []);

  /**
   * Generate papers for all candidates in all centres
   */
  const generateAllPapers = useCallback(async (data) => {
    setGenerating(true);
    setGenerateResult(null);
    try {
      const result = await candidatePaperService.generateAllPapers(data);
      setGenerateResult(result);
      return result;
    } catch (error) {
      console.error('Failed to generate all papers:', error);
      throw error;
    } finally {
      setGenerating(false);
    }
  }, []);

  // ============================================================
  // RETURN VALUES
  // ============================================================

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
    generateDialogOpen,
    
    // Generation State
    generating,
    generateResult,
    availableInstances,
    availableCentres,
    availableCandidates,
    
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
    openGenerateDialog,
    closeGenerateDialog,
    
    // Operations
    validatePaper,
    archivePaper,
    exportPapers,
    
    // Generation Functions
    generatePaper,
    generateCentrePapers,
    generateAllPapers,
    
    // Utility
    refresh,
  };
};

export default useCandidatePapers;