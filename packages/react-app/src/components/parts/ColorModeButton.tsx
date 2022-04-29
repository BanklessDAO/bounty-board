import { Button, ButtonProps, useColorMode } from '@chakra-ui/react';

const ColorModeButton = (props: ButtonProps & {
  children?: React.ReactNode
}): JSX.Element => {
	const { colorMode } = useColorMode();
	return (
		<Button
			transition="background 100ms linear"
			bg={colorMode === 'light' ? 'primary.300' : 'primary.700'}
			{...props}
		>
			{props.children}
		</Button>
	);
};

export default ColorModeButton;
