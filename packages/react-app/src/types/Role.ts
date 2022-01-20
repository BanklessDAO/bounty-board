const roles = ['create-bounty', 'edit-bounty', 'all'] as const;
export type Role = typeof roles[number];