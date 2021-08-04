import React from 'react'
import { Box, BoxProps, Image } from '@chakra-ui/react'

export default function Logo(props: BoxProps): JSX.Element {
  return (
    <Box {...props}>
      <Image alt="Bankless DAO" src="/logo.svg" />
    </Box>
  )
}
