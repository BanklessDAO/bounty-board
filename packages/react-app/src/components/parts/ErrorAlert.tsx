import { Alert, AlertIcon, AlertTitle, CloseButton } from '@chakra-ui/react';

export const ErrorAlert = ({
	error,
	setError,
}: {
  error: string;
  setError: (e: string) => void;
}): JSX.Element => (
	<>
		{error && (
			<Alert mb="5" status="error">
				<AlertIcon />
				<AlertTitle>{error}</AlertTitle>
				<CloseButton
					onClick={() => setError('')}
					position="absolute"
					right="8px"
					top="8px" />
			</Alert>
		)}
	</>
);

export default ErrorAlert;
