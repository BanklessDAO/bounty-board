import { Button, ButtonGroup, useColorMode } from '@chakra-ui/react';
import { RiMoonFill, RiSunLine } from 'react-icons/ri';

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
				{colorMode === 'light' ? <RiMoonFill /> : <RiSunLine size={20} />}
			</Button>
		</>
	);

	return <ButtonGroup>{actions}</ButtonGroup>;
};

export default ThemeToggle;
