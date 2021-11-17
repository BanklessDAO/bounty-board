export interface DiscordGuild {
  /**
   * Discord-api-types doesn't match api response from postman
   * so we define the types here from the discord @users/me/guilds
   **/
  features: string[];
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}