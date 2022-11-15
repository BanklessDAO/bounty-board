import type { AcceptedSortOutputs } from './Filter';

export type NextApiQuery = Record<string, string | string[]>;

export type Status =
  | 'Open'
  | 'Draft'
  | 'Completed'
  | 'In-Review'
  | 'In-Progress'
  | 'Deleted'
  | 'Done'
  | 'Deleted';

export type OutputSortQueryParameters = {
  /**
   * Mapped type allowing $gte and $lte as optional
   * params to all possible values of AcceptedSortOutputs
   */
  [SortBy in AcceptedSortOutputs]+?: {
    $gte?: number;
    $lte?: number;
  };
};
