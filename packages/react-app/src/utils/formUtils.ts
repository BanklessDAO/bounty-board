import { ACTIVITY_VALUES, CLIENT } from '@app/constants/activity';
import { BOUNTY_STATUS_VALUES } from '@app/constants/bountyStatus';
import { useExternalRoles } from '@app/hooks/useExternalRoles';
import {
	ActivityHistoryItem,
	BountyCollection,
	DiscordBoardUser,
	StatusHistoryItem,
} from '@app/models/Bounty';
import { APIUser } from 'discord-api-types';

export const dateIsNotInPast = (d: string): string | boolean => {
	const dt = new Date(d).getTime();
	const today = new Date();
	const todayAtMidnight = today.setHours(0, 0, 0, 0);
	const validDate = dt - todayAtMidnight >= 0;
	return validDate ? true : 'Cannot set a date in the past';
};

export const validNonNegativeDecimal = (v: string): string | boolean => {
	/**
   * Passing decimals to form requires a conversion from a text input type to
   * a number
   */
	if (!Number(v)) return 'Not a valid reward';
	return Number(v) > 0 ? true : 'Must be > 0';
};

export const claimedBy = (user: APIUser): DiscordBoardUser => ({
	discordHandle: `${user?.username}#${user.discriminator}`,
	discordId: user?.id,
	iconUrl: '',
});

export const newActivityHistory = (
	old: ActivityHistoryItem[] | undefined | [],
	activity: ACTIVITY_VALUES
): ActivityHistoryItem[] => {
	const newActivity: ActivityHistoryItem = {
		modifiedAt: new Date().toISOString(),
		client: CLIENT.BOUNTYBOARD,
		activity,
	};
	if (!old || old.length === 0) return [newActivity];
	return [...old, newActivity];
};

export const newStatusHistory = (
	old: StatusHistoryItem[] | undefined | [],
	status: BOUNTY_STATUS_VALUES
): StatusHistoryItem[] => {
	const newStatus: StatusHistoryItem = {
		modifiedAt: new Date().toISOString(),
		status,
	};
	if (!old || old.length === 0) return [newStatus];
	return [...old, newStatus];
};

export const required = 'This field is required';

export const createRewardObject = (
	reward: string,
	currency: string
): BountyCollection['reward'] => {
	const amount = Number(reward);
	const decimalSplit = reward.split('.');
	const hasDecimals = decimalSplit.length > 1;
	const amountWithoutScale = hasDecimals
		? Number(decimalSplit.join(''))
		: amount;
	const scale = hasDecimals ? decimalSplit[1].length : 0;
	return {
		amount,
		currency: currency.toUpperCase(),
		amountWithoutScale,
		scale,
	};
};

export const isClaimableByUser = (
	bounty: BountyCollection,
	user: APIUser | undefined
): { isClaimable: boolean; reason: string } => {
	let isClaimable = true;
	let reason = '';
	if (bounty.evergreen) {
		isClaimable = false;
		reason =
      'Cannot claim multi-claimant bounties on the web, claim in Discord instead.';
	}
	if (bounty.requireApplication) {
		isClaimable = false;
		reason =
      'Cannot claim multi-applicant bounties on the web, claim in Discord instead.';
	}
	if (bounty.assign) {
		if (!user || user.id != bounty.assign) {
			isClaimable = false;
			reason = 'This bounty is assigned to another user for claiming';
		}
	}
	if (bounty.assignTo) {
		if (!user || user.id != bounty.assignTo.discordId) {
			isClaimable = false;
			reason = 'This bounty is assigned to another user for claiming';
		}
	}
	if (bounty.gate || bounty.gateTo) {
		const externalRoles = useExternalRoles();
		if (bounty.gate) {
			if (bounty.gate[0] && !externalRoles.includes(bounty.gate[0])) {
				isClaimable = false;
				reason = 'You do not have a role that can claim this bounty';
			}
		}
		if (bounty.gateTo) {
			if (
				bounty.gateTo[0] &&
        !externalRoles.includes(bounty.gateTo[0].discordId)
			) {
				isClaimable = false;
				reason = 'You do not have a role that can claim this bounty';
			}
		}
	}
	return { isClaimable: isClaimable, reason: reason };
};
