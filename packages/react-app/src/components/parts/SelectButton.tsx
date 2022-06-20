import { Box, useCheckbox, UseRadioProps, Text, useColorMode } from '@chakra-ui/react';

export function CheckboxCard(props: UseRadioProps): JSX.Element {
	const { colorMode } = useColorMode();
	const { getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props);
	const input = getInputProps();
	const checkbox = getCheckboxProps();
	return (
		<Box as='label' {...htmlProps}>
			<input {...input} />
			<Box
				{...checkbox}
				cursor='pointer'
				borderWidth='1px'
				boxShadow='md'
				_checked={{
					bg: colorMode === 'light' ? 'primary.300' : 'primary.700',
					color: 'white',
					borderColor: 'teal.600',
				}}
				fontSize={12}
				px={3}
				py={'10px'}>
				<input {...getInputProps()} hidden />
				<Text {...getLabelProps()} align="center">
					{props.value}
				</Text>
			</Box>
	  </Box>
	);
}
