import { Box, Stack, Heading } from '@chakra-ui/react'
import { ReactNode } from 'react'

import Header from '../Header'
import Footer from '../Footer'

type LayoutProps = {
  children: ReactNode
  title: string
}

const SiteLayout = ({ children, title }: LayoutProps): JSX.Element => {
  return (
    <>
      <Header />
      <Stack
        mx="10"
        mt="30"
        mb="10"
        align="center"
        justify="center"
        transition="background 100ms linear"
      >
        <Box>
          <Heading size="xl" as="h1">
            {title}
          </Heading>
          {children}
        </Box>
      </Stack>
      <Footer />
    </>
  )
}

export default SiteLayout
