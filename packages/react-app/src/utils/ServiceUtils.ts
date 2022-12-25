import BOUNTY_STATUS from '@app/constants/bountyStatus';
import PAID_STATUS from '@app/constants/paidStatus';
import { BountyCollection } from '@app/models/Bounty';

export default {
	formatDisplayDate(dateIso: string): string {
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		};
		return new Date(dateIso).toLocaleString('en-US', options);
	},
	getMongoURI(): string {
		const uri = process.env.MONGODB_URI;
		return uri || '';
	},
	canBeEdited({
		bounty,
	}: {
	  bounty: BountyCollection;
	}): boolean {
		/**
	   * We allow edits to the bounty only if the status is currently `draft` or `open`
	   */
		const bountyOpenForEdits = [BOUNTY_STATUS.DRAFT, BOUNTY_STATUS.OPEN].includes(
			bounty.status
		);
		return bountyOpenForEdits;
	},
	canBePaid({
		bounty,
	}: {
	  bounty: BountyCollection;
	}): boolean {
		const bountyOpenForPaying = [BOUNTY_STATUS.IN_PROGRESS, BOUNTY_STATUS.IN_REVIEW, BOUNTY_STATUS.COMPLETED].includes(
			bounty.status) && (bounty.paidStatus !== PAID_STATUS.PAID);
		return bountyOpenForPaying;
	},
	
};
