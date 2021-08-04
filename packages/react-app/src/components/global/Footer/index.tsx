import { Box, Flex, Text } from '@chakra-ui/react'

const Footer = (): JSX.Element => {
  return (
    <Flex
      as="footer"
      px={8}
      py={10}
      width="full"
      justifyContent="space-between"
    >
      <Box>
        <Text>Bankless DAO</Text>
        <Text fontSize="xs" color="grey">
          Mirror Substack Discord Twitter Github
        </Text>
      </Box>

      <Text>&copy; {new Date().getFullYear()} Bankless DAO</Text>
    </Flex>
  )
}

export default Footer
