import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { Box, BoxProps } from '@chakra-ui/react';

import 'react-datepicker/dist/react-datepicker.css';

function DatePicker(props: ReactDatePickerProps & BoxProps): JSX.Element {
	const {
		isClearable = false,
		showPopperArrow = false,
		borderColor,
		...rest
	} = props;

	return (
		<Box className="dark-theme" borderColor={borderColor}>
			<ReactDatePicker
				isClearable={isClearable}
				showPopperArrow={showPopperArrow}
				className="react-datapicker__input-text"
				{...rest} />
		</Box>
	);
}

export default DatePicker;
