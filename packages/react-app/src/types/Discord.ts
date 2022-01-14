import { BountyCollection } from '../models/Bounty';

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

export type DiscordEmbed = {
	embeds: Embed[]
}

type Embed = {
	title: string;
	url: string;
	author: {
		name: BountyCollection['createdBy']['discordHandle'];
	}
	description: string;
	color: number;
	fields: EmbedField[];
	timestamp: string;
	footer: {
		text: string;
	}
};

type EmbedField = {
	name: string;
	value: string;
	inline?: boolean;
}
