import { Flex } from '@chakra-ui/react';
// import AccessibleLink from "../../../components/parts/AccessibleLink";
// import ColorModeButton from "../../../components/parts/ColorModeButton";

// import { discordSupportChannelUrl } from "../../../constants/discordInfo";
// import { feedbackUrl } from "../../../constants/discordInfo";

function Footer(): JSX.Element {
	return (
		<Flex as="footer" px={8} width="full" justifyContent="space-between">
			{/* <Box>
              <Text fontSize="xs" color="grey">
                Mirror Substack Discord Twitter Github
              </Text>
              <HStack>
                <AccessibleLink href={feedbackUrl} isExternal={true}>
                  <ColorModeButton>Give us Feedback</ColorModeButton>
                </AccessibleLink>
      
                <AccessibleLink href={discordSupportChannelUrl} isExternal={true}>
                  <ColorModeButton>Need Help?</ColorModeButton>
                </AccessibleLink>
              </HStack>
            </Box>
      
            <Text>&copy; {new Date().getFullYear()} Bankless DAO</Text> */}
		</Flex>
	);
}

export default Footer;
