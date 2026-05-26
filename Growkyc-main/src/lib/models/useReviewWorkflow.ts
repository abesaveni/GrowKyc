import {
  getReviewWorkflowService,
  type ReviewWorkflowService,
  type ReviewWorkflowServiceDependencies,
} from './reviewWorkflowService';

export function useReviewWorkflow(
  dependencies: ReviewWorkflowServiceDependencies,
): ReviewWorkflowService {
  return getReviewWorkflowService(dependencies);
}
