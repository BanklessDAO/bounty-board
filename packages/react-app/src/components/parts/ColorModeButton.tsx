import { Button, useColorMode } from '@chakra-ui/react';

const ColorModeButton = ({
	children,
}: {
  children?: React.ReactNode
}): JSX.Element => {
	const { colorMode } = useColorMode();
	return (
		<Button transition="background 100ms linear"
		bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
		>
			{children}
		</Button>
	);
};

export default ColorModeButton;
