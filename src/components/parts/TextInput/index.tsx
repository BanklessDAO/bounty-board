import { ReactElement } from 'react'
import styled from 'styled-components'

const Input = styled.input`
  padding: 20px 30px;

  border-radius: 10px;
`

const TextInput = ({ name, placeholder, ...restProps }
  : {name: string, placeholder: string, restProps: any})
  : ReactElement => {
  return (
    <Input type="text" name={name} placeholder={placeholder} {...restProps} />
  )
}

export default TextInput
