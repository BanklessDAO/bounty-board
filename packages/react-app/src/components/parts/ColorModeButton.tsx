import { Button, useColorModeValue } from '@chakra-ui/react'
import NextLink from 'next/link'

const ColorModeButton = ({
  children
}: {
  children?: React.ReactNode,
}): JSX.Element => {
  const bgColor = useColorModeValue('gray.300', 'gray.700')
  return (
    <Button bg={bgColor} transition="background 100ms linear">
      {children}
    </Button>
  )
}

export default ColorModeButton
