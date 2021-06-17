import styled from 'styled-components'
interface FlexProps {
  wrapReverse?: any
  noWrap?: any
  justifyContent?: any
  justifyCenter?: any
  justifyAround?: any
  justifyBetween?: any
  justifyEnd?: any
  alignItems?: any
  alignStretch?: any
  alignEnd?: any
  alignCenter?: any
  alignBaseline?: any
  alignContent?: any
  contentStart?: any
  contentEnd?: any
  contentCenter?: any
  contentBetween?: any
  contentAround?: any
  column?: any
  content?: any
}
interface ColumnProps {
  three?: any
  four?: any
  noPadding?: any
}
const Flex = styled.div<FlexProps>`
  display: flex;
  flex-wrap: ${(props) => {
    if (props.wrapReverse) return 'wrap-reverse'
    else if (props.noWrap) return 'nowrap'
    return 'wrap'
  }};
  justify-content: ${(props) => {
    if (props.justifyContent) return props.justifyContent
    if (props.justifyCenter) return 'center'
    else if (props.justifyAround) return 'space-around'
    else if (props.justifyBetween) return 'space-between'
    else if (props.justifyEnd) return 'flex-end'
    return 'flex-start'
  }};
  align-items: ${(props) => {
    if (props.alignItems) return props.alignItems
    else if (props.alignStretch) return 'stretch'
    else if (props.alignEnd) return 'flex-end'
    if (props.alignCenter) return 'center'
    else if (props.alignBaseline) return 'baseline'
    return 'flex-start'
  }};
  align-content: ${(props) => {
    if (props.alignContent) return props.content
    else if (props.contentStart) return 'flex-start'
    else if (props.contentEnd) return 'flex-end'
    else if (props.contentCenter) return 'center'
    else if (props.contentBetween) return 'space-between'
    else if (props.contentAround) return 'contentAround'
    return 'stretch'
  }};
  flex-direction: ${(props) => (props.column ? 'column' : 'row')};
`

export const Column = styled.div<ColumnProps>`
    width: ${(props) => {
      if (props.three) return '33.33%'
      if (props.four) return '25%'
      return '50%'
    }};
    padding: ${(props) => (props.noPadding ? 0 : '15px')}};
`

export default Flex
