import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { Box } from '@chakra-ui/react';

import 'react-datepicker/dist/react-datepicker.css';

function DatePicker(props: ReactDatePickerProps): JSX.Element {
	const {
		isClearable = false,
		showPopperArrow = false,
		...rest
	} = props;

	return (
		<Box className="dark-theme">
			<ReactDatePicker
				isClearable={isClearable}
				showPopperArrow={showPopperArrow}
				className="react-datapicker__input-text"
				{...rest}
			/>
		</Box>
	);
}

export default DatePicker;