import { SavedUserQueryProps, SaveQueryType } from '../models/SavedUserQuery';
import SavedUserQuery from '@app/models/SavedUserQuery';
import { NextApiQuery } from '@app/types/Queries';

export const addQuery = async (data: SaveQueryType): Promise<SavedUserQueryProps> => {
	return await SavedUserQuery.create(data);
};

export const deleteSingleQuery = async (id: string): Promise<{ ok?: number, n?: number, deletedCount?: number }> => {
	if (typeof id !== 'string') throw new Error('id must be a string');
	return await SavedUserQuery.deleteOne({ _id: id });
};

export const getQueriesByDiscordId = async (query: NextApiQuery): Promise<SavedUserQueryProps[]> => {
	const discordId = query.discordId as string;
	const data = await SavedUserQuery.find({ discordId });
	return data;
};