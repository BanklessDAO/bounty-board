import { Box, useCheckbox, UseRadioProps, Text, useColorMode } from '@chakra-ui/react';

export function CheckboxCard(props: UseRadioProps): JSX.Element {
	const { colorMode } = useColorMode();
	const { getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props);
	const input = getInputProps();
	const checkbox = getCheckboxProps();
  
	return (
		<Box as='label' {...htmlProps} width="20%" minW={'125px'}>
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
				px={5}
				py={'6px'}>
				<input {...getInputProps()} hidden />
				<Text {...getLabelProps()} align="center">
					{props.value}
				</Text>
			</Box>
	  </Box>
	);
}
