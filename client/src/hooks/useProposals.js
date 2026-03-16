import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllProposals,
  getMyProposals,
  submitReview,
  createProposal,
  updateProposalStatus,
  getMyReviews
} from '../services/api';

// Query keys for caching
export const proposalKeys = {
  all: ['proposals'],
  lists: () => [...proposalKeys.all, 'list'],
  list: (filters, page) => [...proposalKeys.lists(), filters, page],
  my: (page) => [...proposalKeys.all, 'my', page],
  details: () => [...proposalKeys.all, 'detail'],
  detail: (id) => [...proposalKeys.details(), id],
};

export const reviewKeys = {
  all: ['reviews'],
  my: () => [...reviewKeys.all, 'my'],
};

export const useProposals = (filters = {}, page = 1, limit = 5) => {
  return useQuery({
    queryKey: proposalKeys.list(filters, page),
    queryFn: async () => {
      const response = await getAllProposals({
        ...filters,
        page,
        limit
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export const useMyProposals = (filters = {}, page = 1, limit = 5) => {
  return useQuery({
    queryKey: [...proposalKeys.my(), filters, page],
    queryFn: async () => {
      const response = await getMyProposals({
        ...filters,
        page,
        limit
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export const useMyReviews = () => {
  return useQuery({
    queryKey: reviewKeys.my(),
    queryFn: async () => {
      const response = await getMyReviews();
      return response.data;
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ proposalId, reviewData }) => {
      const response = await submitReview(proposalId, reviewData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.my() });
    },
  });
};

export const useCreateProposal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const response = await createProposal(formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.my() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
};

export const useUpdateProposalStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await updateProposalStatus(id, status);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(proposalKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
};