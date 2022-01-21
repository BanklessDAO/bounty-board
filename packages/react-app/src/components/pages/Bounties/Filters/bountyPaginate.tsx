import { useColorMode } from '@chakra-ui/color-mode';
import { Stack, Button } from '@chakra-ui/react';

type BountyPaginateProps = {
  page: number;
  setPage(page: number): void;
  maxPages: number;
}

function BountyPaginate({ page, setPage, maxPages }: BountyPaginateProps) {

	const { colorMode } = useColorMode();

	const incrementPage = (): void => {
		// pages are 0 indexed
		setPage(Math.min(page + 1, maxPages - 1));
		window.scrollTo(0, 0);
	};

	const decrementPage = (): void => {
		setPage(Math.max(page - 1, 0));
		window.scrollTo(0, 0);
	};

	return (
		<Stack justify="space-between" direction="row" mt={3}>
			<Button
				p={5}
				disabled={page === 0}
				size="sm"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={decrementPage}
			>
      &larr; Previous Page
			</Button>
			<Button
				p={5}
				disabled={page === maxPages - 1 || maxPages === 0}
				size="sm"
				bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
				onClick={incrementPage}
			>
      Next Page &rarr;
			</Button>
		</Stack>
	);
}

export default BountyPaginate;