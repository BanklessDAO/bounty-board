import { Button, ButtonGroup, useColorMode } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';

const ThemeToggle = (): JSX.Element => {
	const { colorMode, toggleColorMode } = useColorMode();

	const actions = (
		<>
			{/* Default to dark mode*/}
			<Button
				bg="rgba(0,0,0,0)"
				borderRadius={100}
				w={10}
				borderWidth={1}
				onClick={toggleColorMode}
			>
				{colorMode === 'light' ? (
					<Icon as={MoonIcon} w={4} h={4} />
				) : (
					<Icon as={SunIcon} w="1.15rem" h="1.15rem" />
				)}
			</Button>
		</>
	);

	return <ButtonGroup>{actions}</ButtonGroup>;
};

export default ThemeToggle;
