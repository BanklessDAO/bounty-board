import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
} from '@chakra-ui/accordion';
import { FormLabel } from '@chakra-ui/form-control';
import { Box } from '@chakra-ui/layout';

const ExpansionField = ({
	label,
	children,
	value,
	onChange,
}: {
  label: string;
  children: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
}): JSX.Element => {
	return (
		<Accordion w="full" allowToggle>
			<AccordionItem>
				<AccordionButton
					onClick={() => {
						onChange((value = !value));
					}}
					display="flex"
					justifyContent="space-between">
					<FormLabel htmlFor="multiclaimant" mb="0">
						{label}
					</FormLabel>
					<Box
						borderRadius="50%"
						bg={value ? 'green' : ''}
						border="2px solid"
						borderColor={value ? 'green' : 'lightBlue'}
						width="12px"
						height="12px" />
				</AccordionButton>
				<AccordionPanel pb={4}>{children}</AccordionPanel>
			</AccordionItem>
		</Accordion>
	);
};

export default ExpansionField;
