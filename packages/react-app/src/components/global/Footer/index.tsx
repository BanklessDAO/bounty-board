import { Flex, HStack, Text } from '@chakra-ui/react';
import AccessibleLink from '../../../components/parts/AccessibleLink';
import ColorModeButton from '../../../components/parts/ColorModeButton';

import { discordSupportChannelUrl } from '../../../constants/discordInfo';
import { feedbackUrl } from '../../../constants/discordInfo';

const Footer = (): JSX.Element => {
	return (
		<Flex
			as="footer"
			px={8}
			py={10}
			width="full"
			wrap="wrap"
			alignItems="center"
			justifyContent={['center', 'space-between']}
		>
			<Flex>
				<HStack>
					<AccessibleLink href={feedbackUrl} isExternal={true}>
						<ColorModeButton>Give us Feedback</ColorModeButton>
					</AccessibleLink>
					<AccessibleLink href={discordSupportChannelUrl} isExternal={true}>
						<ColorModeButton>Need Help?</ColorModeButton>
					</AccessibleLink>
				</HStack>
			</Flex>
			<Text
				my={['5', '5', '0']}
				textAlign="center"
				w="1/2"
			>
						&copy; {new Date().getFullYear()} Bankless DAO
			</Text>
		</Flex>
	);
};

export default Footer;
