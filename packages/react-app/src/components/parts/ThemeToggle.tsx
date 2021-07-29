import { Button, ButtonGroup, useColorMode } from '@chakra-ui/react'
import { RiMoonFill, RiSunLine } from 'react-icons/ri'

const ThemeToggle = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode()

  const actions = (
    <>
      <Button
        onClick={toggleColorMode}
        bg={colorMode === 'light' ? 'gray.300' : 'gray.700'}
      >
        {colorMode === 'light' ? <RiMoonFill /> : <RiSunLine />}
      </Button>
    </>
  )

  return <ButtonGroup>{actions}</ButtonGroup>
}

export default ThemeToggle
