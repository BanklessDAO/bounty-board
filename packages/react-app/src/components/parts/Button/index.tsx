import styled from 'styled-components'
import { neutralColors } from '../../../theme'
interface ButtonProps {
  disabled?: boolean
  size?: string
  iconLeft?: string
  iconRight?: string
  color?: string
}

//Base Button
const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${(props) => {
    if (props.size == 'small') return '12px 16px'
    return '16px 24px'
  }};
  border-style: none;
  border-radius: 90px;

  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;

  text-align: center;
`

export const Neutral = styled(Button)`
  color: ${neutralColors.eight};
  &:hover {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
      ${(props) => props.color};
  }
  background: ${(props) => {
    if (props.disabled)
      return `linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), ${props.color}`
    return props.color
  }};
  ${({ disabled }) => disabled && `opacity: 0.5 `}
`

export const Light = styled(Button)`
  color: ${neutralColors.two};

  &:hover {
    background: ${(props) => {
      if (!props.disabled) {
        if (props.color) return props.color
        return neutralColors.two
      }
    }};
    color: ${(props) => {
      if (!props.disabled) return neutralColors.eight
    }};
  }
  ${({ disabled }) =>
    disabled &&
    `
  opacity: 0.5;
  color: ${neutralColors.eight}
  `}
`

export const Dark = styled(Button)`
  border: 2px solid ${neutralColors.four};
  box-sizing: border-box;
  color: ${neutralColors.eight};
  &:hover {
    background: ${neutralColors.eight};
    color: ${neutralColors.two};
  }
  background: ${(props) => {
    if (props.disabled) return neutralColors.eight
    return neutralColors.one
  }};
  ${({ disabled }) =>
    disabled &&
    `
  opacity: 0.5;
  color: ${neutralColors.two}
  `}
`
