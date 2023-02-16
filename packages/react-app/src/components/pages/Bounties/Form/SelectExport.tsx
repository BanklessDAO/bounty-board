import { Stack, Button, Menu, MenuButton, MenuList, MenuItem, useDisclosure } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import React, { useState, useRef } from 'react';
import MarkPaidModal from './MarkPaidModal';
import { BountyCollection } from '@app/models/Bounty';
import { CSVLink } from 'react-csv';
import { BOUNTY_LIMITED_EXPORT_ITEMS, BOUNTY_PARCEL_EXPORT_ITEMS } from '../../../../constants/bountyExportItems';
import miscUtils from '../../../../utils/miscUtils';
import { useUser } from '@app/hooks/useUser';
import { useRoles } from '@app/hooks/useRoles';
import { ALLOWED_CURRENCIES_TYPE, ALLOWED_CURRENCY_CONTRACTS } from '@app/constants/currency';
import ServiceUtils from '@app/utils/ServiceUtils';
import PAID_STATUS from '@app/constants/paidStatus';

type SetState<T extends any> = (arg: T) => void;

export const SelectExport = ({
	bounties,
	selectedBounties,
	setSelectedBounties,
}: {
  bounties: BountyCollection[] | undefined;
  selectedBounties: string[];
  setSelectedBounties: SetState<string[]>;
}): JSX.Element => {
	const { colorMode } = useColorMode();
	const roles = useRoles();
	const { user } = useUser();
	const [getCsvData, setCsvData] = miscUtils.useStateCallback<
    Record<string, unknown>[]
  >([]);
	const [getCsvFormat, setCsvFormat] = useState<Array<{label: string; key: string}>>([]);
	const [getBountiesToMark, setBountiesToMark] = useState<string[]>([]);
	const [getMarkPaidMessage, setMarkPaidMessage] = useState<string>('');
	const csvLink = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);
	const {
		isOpen: isMarkPaidOpen,
		onOpen: onMarkPaidOpen,
		onClose: onMarkPaidClose,
	} = useDisclosure();

	const handleSelectAll = (): void => {
		if (bounties && selectedBounties.length < bounties.length) {
			setSelectedBounties(bounties.map(({ _id }) => _id));
		}
	};

	const handleClearAll = (): void => {
		setSelectedBounties([]);
	};

	const handleCSV = (exportBounties: any[]): void => {
		if (exportBounties && csvLink.current) {
			setCsvData(exportBounties, () => {
				csvLink?.current?.link.click();
			});

			if (user && roles) {
				let bountiesToMark: string[] = [];
				// If Admin, allow all to be marked, otherwise only own bounties and if correct permissions
				if (roles.some((r: string) => ['admin'].includes(r))) {
					bountiesToMark = selectedBounties.filter((_id) => {
						const bounty = bounties?.find((b) => b._id == _id);
						return bounty && ServiceUtils.canChangePaidStatus(bounty, PAID_STATUS.PAID);
					});
					setMarkPaidMessage('Export completed. Mark these exported claimed bounties as paid?');
				} else if (
					roles.some((r: string) =>
						['edit-bounties', 'edit-own-bounty'].includes(r)
					)
				) {
					bountiesToMark = selectedBounties.filter((_id) => {
						const bounty = bounties?.find((b) => b._id == _id);
						return bounty && (bounty.createdBy.discordId == user.id) && ServiceUtils.canChangePaidStatus(bounty, PAID_STATUS.PAID);
					});
					setMarkPaidMessage('Export completed. Mark these exported claimed bounties you created as paid?');
				}
				if (bountiesToMark.length > 0) {
					setBountiesToMark(bountiesToMark);
					onMarkPaidOpen();
				}
			}
		}
	};

	const handleJSON = (): void => {

		if (bounties) {

		  // create file in browser
		  const fileName = 'bounties';
		  const jsonData = bounties
		  .filter(({ _id }) => selectedBounties.includes(_id))
		  .map(miscUtils.csvEncode);

		  const json = JSON.stringify(jsonData, null, 2);
		  const blob = new Blob([json], { type: 'application/json' });
		  const href = URL.createObjectURL(blob);
		
		  // create "a" HTLM element with href to file
		  const link = document.createElement('a');
		  link.href = href;
		  link.download = fileName + '.json';
		  document.body.appendChild(link);
		  link.click();
		
		  // clean up "a" element & remove ObjectURL
		  document.body.removeChild(link);
		  URL.revokeObjectURL(href);
		}
	};


	return (
		<Stack justify="space-between" direction="row" mt={1}>
			<Button
				p={2}
				disabled={!bounties || selectedBounties.length == bounties.length}
				size="xs"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={handleSelectAll}>
                Select All
			</Button>
			<Button
				p={2}
				disabled={!bounties || selectedBounties.length == 0}
				size="xs"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={handleClearAll}>
                Clear All
			</Button>
			<Menu>
				<MenuButton
					as={Button}
					p={2}
					disabled={!bounties || selectedBounties.length == 0}
					size="xs"
					bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				>
					Export
				</MenuButton>
				<MenuList>
					<MenuItem
						onClick={ () => {
							setCsvFormat(BOUNTY_PARCEL_EXPORT_ITEMS);
							if (bounties) {
								const exportBounties = (bounties
									.filter(({ _id }) => selectedBounties.includes(_id))
									.filter(bounty => bounty.claimedBy && bounty?.payeeData?.walletAddress && ALLOWED_CURRENCY_CONTRACTS[bounty.reward.currency as ALLOWED_CURRENCIES_TYPE]) as any[])
									.map((bounty) => {
										if (bounty['claimedBy']) {
											bounty['compositeName'] = bounty['claimedBy']['discordHandle'];
										}
										if (bounty.reward) {
											bounty['tokenContract'] = ALLOWED_CURRENCY_CONTRACTS[bounty.reward.currency as ALLOWED_CURRENCIES_TYPE];
										}
										bounty['compositeName'] += ' - ' + bounty['title'];
										return miscUtils.csvEncode(bounty);
									});
								handleCSV(exportBounties);
							}
						} }
					>
						Parcel.money
					</MenuItem>
					<MenuItem
						onClick={ () => {
							setCsvFormat(BOUNTY_LIMITED_EXPORT_ITEMS);
							if (bounties) {
								const exportBounties = (bounties
									.filter(({ _id }) => selectedBounties.includes(_id)) as any[])
									.map((bounty) => {
										if (bounty.tags?.keywords) {
											bounty['tagList'] = bounty.tags.keywords.join(',');
										}
										return miscUtils.csvEncode(bounty);
									});
								handleCSV(exportBounties);
							}
						} }
					>
						CSV
					</MenuItem>
					<MenuItem
						onClick={ () => {
							handleJSON();
						} }
					>
						JSON
					</MenuItem>
				</MenuList>
			</Menu>
			<CSVLink
				data={getCsvData}
				headers={getCsvFormat}
				filename="bounties.csv"
				className="hidden"
				ref={csvLink}
				target="_blank"/>
			<MarkPaidModal
				isOpen={isMarkPaidOpen}
				onClose={onMarkPaidClose}
				bounties={
					bounties
						? bounties.filter(({ _id }) => getBountiesToMark.includes(_id))
						: undefined
				}
				markPaidMessage={getMarkPaidMessage}
				markPaidOrUnpaid={PAID_STATUS.PAID}
			/>
		</Stack>
	);
};

