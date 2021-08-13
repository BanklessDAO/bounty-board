import { Heading } from '@chakra-ui/react'
import Layout from '../components/global/SiteLayout'
import { Stack } from '@chakra-ui/react'

const Page400 = (): JSX.Element => (
  <Layout title="">
    <Stack align="center" justify="center" h="400px">
      <Heading size="4xl" align="center">
        <strong>400</strong>
      </Heading>
      <Heading size="xl">Unauthorized</Heading>
    </Stack>
  </Layout>
)

export default Page400
