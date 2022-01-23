import { Session } from 'next-auth';

/**
 * Default session object does not include the accessToken as a property
 */
export type SessionWithToken = Session & {
  accessToken: string;
}