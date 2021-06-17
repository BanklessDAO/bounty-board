import styled from 'styled-components'
import { neutralColors } from 'src/theme'

export const HeaderWrapper = styled.header`
  background: ${neutralColors.one};
  height: 81px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
`
export const Divider = styled.span`
  background: ${neutralColors.three}
  height: 1px;
`
export const NavContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 160px;
  height: 80px;
`
export const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  width: 573px;
  padding: 0px;
`
export const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: 0px;
  height: 40px;
`
export const ActionSearch = styled.div``

export const Left = styled.div``
