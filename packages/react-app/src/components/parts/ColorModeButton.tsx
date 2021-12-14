import { Button } from '@chakra-ui/react';

const ColorModeButton = ({
	children,
}: {
	children?: React.ReactNode;
}): JSX.Element => {
	return (
		<Button
			bg="transparent"
			borderRadius={100}
			borderWidth={2}
			fontFamily="Calibre"
			transition="background 100ms linear"
		>
			{children}
		</Button>
	);
};

export default ColorModeButton;
