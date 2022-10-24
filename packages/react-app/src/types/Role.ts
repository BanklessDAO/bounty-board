// list of roles in the application
export type Role =
  | 'admin'
  | 'create-bounty'
  | 'edit-own-bounty'
  | 'delete-own-bounty'
  | 'edit-bounties'
  | 'claim-bounties'
  | 'delete-bounties'
  | 'create-customer'
  | 'edit-customer'
  | 'delete-customer';

export type SupportedHTTPMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Now, you can define a set of roles (for each handler), that are required before serving
 * the request for a given HTTP verb.
 *
 * Example:
 * /customers
 *  - POST: ['create-customer']
 *  - PATCH: ['edit-customer', 'admin']
 *
 * If you omit GET, PUT and DELETE, they won't be checked, whereas POST and PATCH will be checked
 * for each role
 */
export type RoleRestrictions = {
  // Every method in RoleRestrictions is optional (`+?`)
  // but if you do pass a method, it must be one of the supported HTTP methods above
  // Also, the roles must be one of the `roles` above
  [Method in SupportedHTTPMethods]+?: Role[];
};
