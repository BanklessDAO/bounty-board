import { useUser } from '@app/hooks/useUser';
import { Heading, Link, Stack } from '@chakra-ui/react';
import { BsTrash } from 'react-icons/bs';
import React from 'react';
import { SavedQuery } from '@app/types/SavedQuery';
import DeleteSearchModal from './DeleteSearchModal';
import { useRouter } from 'next/router';

const SavedQueriesMenu = (): JSX.Element => {
	const { user, loadingQueries, savedQueries } = useUser();
	const router = useRouter();
	const [queryToDelete, setQueryToDelete] = React.useState<SavedQuery | undefined>(undefined);

	if (!user || loadingQueries || !(savedQueries && savedQueries.length)) return <></>;

	const routeQueryTo = (url: string | undefined) => {
		if (url) router.push(url, undefined, { shallow: true });
	};

	return (
		<Stack width={{ base: '100%', lg: '20%' }}>
			<Stack borderWidth={3} borderRadius={10} px={3} py={5} mb={3} direction={{ base: 'column' }}>
				<Heading size="md" m={0}>Saved Queries</Heading>
				<br/>
				<Stack gap={1}>
					{savedQueries.map((query) => (
						<Stack direction={'row'} key={query._id} justifyContent="space-between">
							<Link onClick={() => routeQueryTo(query.savedQuery)} key={query.discordId}>{query.name}</Link>
							<BsTrash onClick={() => setQueryToDelete(query)} cursor="pointer"/>
						</Stack>
					))}
				</Stack>
			</Stack>
			<DeleteSearchModal
				showModal={queryToDelete !== undefined}
				onClick={() => setQueryToDelete(undefined)}
				queryToDelete={queryToDelete}
			/>
		</Stack>
	);
};

export default SavedQueriesMenu;