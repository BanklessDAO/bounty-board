import { required } from '@app/utils/formUtils';
import {
	FormControl,
	FormControlProps,
	FormErrorMessage,
	FormLabel,
} from '@chakra-ui/form-control';
import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import ExpansionField from './ExpansionField';

type AdvancedProps = {
  formControlProps: FormControlProps;
  control: Control<any, any>;
};

export const MultiClaim = ({
	formControlProps,
	control,
}: AdvancedProps): JSX.Element => {
	return (
		<FormControl bg="rgba(0,0,0,0.2)" {...formControlProps}>
			<Controller
				name="multiClaim"
				control={control}
				render={({ field }) => (
					<ExpansionField
						onChange={field.onChange}
						value={field.value}
						label="Allow Multiple Claimants?">
						<FormControl>
							<Flex mb="3" alignItems="center">
								<InfoIcon mr="3" />
								<Text p="0" m="0" fontSize="12" fontStyle="italic">
                                  Multiple People will be able to claim the bounty
								</Text>
							</Flex>
						</FormControl>
					</ExpansionField>
				)}
			/>
		</FormControl>
	);
};

export const Evergreen = ({
	formControlProps,
	control,
}: AdvancedProps): JSX.Element => {
	return (
		<FormControl bg="rgba(0,0,0,0.2)" {...formControlProps}>
			<Controller
				name="evergreen"
				control={control}
				render={({ field }) => (
					<ExpansionField
						value={field.value}
						onChange={field.onChange}
						label="Recurring Bounty?">
						<FormLabel htmlFor="evergreen"></FormLabel>
						<Flex
							// justifyContent="space-evenly"
						>
							<InfoIcon mr="3" />
							<Text p="0" m="0" fontSize="12" fontStyle="italic">
                              A recurring bounty will automatically re-list once claimed
							</Text>
						</Flex>
					</ExpansionField>
				)}
			/>
		</FormControl>
	);
};

type GatedProps = {
  formControlProps: FormControlProps;
  errors: any;
  gated: boolean;
  setGated: (g: boolean) => void;
  register: UseFormRegister<any>;
};
export const Gated = ({
	formControlProps,
	errors,
	gated,
	setGated,
	register,
}: GatedProps): JSX.Element => {
	return (
		<FormControl
			isInvalid={!!errors.gatedTo}
			bg="rgba(0,0,0,0.2)"
			{...formControlProps}
		>
			<ExpansionField
				value={gated}
				onChange={setGated}
				label="Restrict Claimants?"
			>
				<FormLabel htmlFor="gatedTo">
					<Flex alignItems="start">
						<InfoIcon mr="3" />
						<Text
							p="0"
							m="0"
							fontSize="12"
							fontStyle="italic"
							overflowWrap="break-word">
                            Restrict the bounty to allow claiming only by
							certain users or roles
						</Text>
					</Flex>
				</FormLabel>
				<Select
					id="gatedTo"
					{...register('gatedTo', {
						validate: (v) => {
							if (gated) {
								return v && gated ? true : required;
							} else {
								return true;
							}
						},
					})} >
					{['Level-1', 'Level-2'].map((c) => (
						<option key={c}>{c.toUpperCase()}</option>
					))}
				</Select>
				<FormErrorMessage>{errors.gatedTo?.message}</FormErrorMessage>
			</ExpansionField>
		</FormControl>
	);
};

const CreateFormAdvancedOptions = (
	props: AdvancedProps & GatedProps
): JSX.Element => {
	const { formControlProps, control } = props;
	return (
		<>
			<Gated
				errors={props.errors}
				formControlProps={formControlProps}
				gated={props.gated}
				setGated={props.setGated}
				register={props.register} />
			<MultiClaim formControlProps={formControlProps} control={control} />
			<Evergreen formControlProps={formControlProps} control={control} />
		</>
	);
};

export default CreateFormAdvancedOptions;
