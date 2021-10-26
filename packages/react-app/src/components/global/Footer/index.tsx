import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import AccessibleLink from '../../../components/parts/AccessibleLink';
import ColorModeButton from '../../../components/parts/ColorModeButton';

import { discordSupportChannelUrl } from '../../../constants/discordInfo';
import { feedbackUrl } from '../../../constants/discordInfo';

const Footer = (): JSX.Element => {
	return (
		<Flex
			as="footer"
			px={8}
			py={{ base: 5, sm: 10 }}
			width="full"
			justifyContent="space-between"
			alignItems="center"
			direction={{ base: 'column', sm: 'row' }}
		>
			<Box>
				{/* <Text fontSize="xs" color="grey">
          Mirror Substack Discord Twitter Github
        </Text> */}
				<HStack>
					<AccessibleLink href={feedbackUrl} isExternal={true}>
						<ColorModeButton>Give us Feedback</ColorModeButton>
					</AccessibleLink>

					<AccessibleLink href={discordSupportChannelUrl} isExternal={true}>
						<ColorModeButton>Need Help?</ColorModeButton>
					</AccessibleLink>
				</HStack>
			</Box>

			<Text paddingTop={{ base: '5' }}>
        &copy; {new Date().getFullYear()} Bankless DAO
			</Text>
		</Flex>
	);
};

export default Footer;
