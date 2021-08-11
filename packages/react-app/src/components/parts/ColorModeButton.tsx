import { Button, useColorModeValue } from '@chakra-ui/react'
import NextLink from 'next/link'

const ColorModeButton = ({
  children,
  url
}: {
  children?: React.ReactNode,
  url: string
}): JSX.Element => {
  const bgColor = useColorModeValue('gray.300', 'gray.700')
  return (
    <a href={url}>
    <Button bg={bgColor} transition="background 100ms linear">
      {children}
    </Button>
    </a>
  )
}

export default ColorModeButton
