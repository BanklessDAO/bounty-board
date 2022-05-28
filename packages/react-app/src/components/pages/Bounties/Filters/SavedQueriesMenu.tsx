import { useUser } from '@app/hooks/useUser';
import { Heading, Link, Stack } from '@chakra-ui/react';
import React from 'react';

const SavedQueriesMenu: React.FC = () => {
	const { user, loadingQueries, savedQueries } = useUser();

	if (!user || loadingQueries || !(savedQueries && savedQueries.length)) return <></>;

	return (
		<Stack width={{ base: '100%', lg: '20%' }}>
			<Stack borderWidth={3} borderRadius={10} px={3} py={5} mb={3} direction={{ base: 'column' }}>
				<Heading size="md" m={0}>Saved Queries</Heading>
				{savedQueries.map((query) => (
					<Link href={query.savedQuery} key={query.discordId}>{query.name}</Link>
				))}
			</Stack>
		</Stack>
	);
};

export default SavedQueriesMenu;