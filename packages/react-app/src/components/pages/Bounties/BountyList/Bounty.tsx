import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/react'

import { BountyBoardProps } from '../../../../models/Bounty'

const Status = ({ indication }: { indication: string }): JSX.Element => (
  <Tag my={0} size="lg" key="lg" variant="outline" colorScheme={indication}>
    <TagLabel>{indication.replace('-', ' ')}</TagLabel>
  </Tag>
)

const DiscordStub = ({ name }: { name: string }): JSX.Element => (
  <Flex my={2} align="center" gridGap={3}>
    <Avatar size="sm" src="https://bit.ly/broken-link" />
    <Text fontSize="md" color="steelblue">
      @{name}
    </Text>
  </Flex>
)

const Bounty = ({
  title,
  reward,
  status,
  description,
  criteria,
  createdBy,
  claimedBy,
}: BountyBoardProps): JSX.Element => (
  <AccordionItem borderWidth={3} borderRadius={10} mb={3}>
    <AccordionButton pb={5}>
      <Flex flexWrap="wrap" width="100%" justifyContent="flex-end" ml="2">
        <Box
          width={{ base: '100%', md: '60%' }}
          pr={{ base: 7, md: 0 }}
          align="left"
          mt="4"
        >
          <Heading mb={4} size="md" flex={{ base: 1, md: 0 }}>
            {title}
          </Heading>
        </Box>
        <Box
          width={{ base: '50%', md: '30%' }}
          textAlign={{ base: 'left', md: 'right' }}
          mt={{ base: 0, md: 4 }}
          ml="auto"
          pr={7}
        >
          {reward && (
            <Heading mt={1} size="md">
              {reward.amount} {reward.currency}
            </Heading>
          )}
        </Box>
        <Box pos="absolute" align="flex-end" textAlign="right" pt="2">
          <AccordionIcon />
        </Box>
        <Box mb={2} width="50%" textAlign={{ base: 'right', md: 'left' }}>
          {status && <Status indication={status} />}
        </Box>
        <Box
          width={{ base: '100%', md: '50%' }}
          textAlign={{ base: 'left', md: 'right' }}
          pr={7}
        >
          {/* {guilds &&
            guilds.map((guild: string) => (
              <Badge
                key={guild}
                borderRadius="10"
                _notFirst={{ marginLeft: '10px' }}
                mb={2}
                py={1}
                px={3}
              >
                {guild}
              </Badge>
            ))} */}
        </Box>
      </Flex>
    </AccordionButton>
    <AccordionPanel mx={2}>
      <Grid gap={6}>
        <GridItem>
          <Heading size="sm">Description</Heading>
          <Text>{description}</Text>
        </GridItem>
        <GridItem>
          <Heading size="sm">Done Criteria</Heading>
          <Text>{criteria}</Text>
        </GridItem>
        <GridItem>
          <Heading size="sm">Requested By</Heading>
          <DiscordStub name={createdBy.discordHandle} />
        </GridItem>
        <GridItem>
          <Heading size="sm">Claimed By</Heading>
          {claimedBy ? (
            <DiscordStub name={claimedBy.discordHandle} />
          ) : (
            <Button my={2} size="sm" colorScheme="green">
              <TagLabel>Claim It</TagLabel>
            </Button>
          )}
        </GridItem>
      </Grid>
    </AccordionPanel>
  </AccordionItem>
)

export default Bounty
