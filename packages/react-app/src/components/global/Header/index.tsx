import * as S from './style'
import * as Button from '../../parts/Button'
import { ReactElement } from 'react'

const Header = (): ReactElement => {
  return (
    <S.HeaderWrapper>
      <S.Divider />
      <S.NavContent>
        <S.Actions>
          <S.ActionButtons>
            <Button.Dark size=""> Connect Wallet </Button.Dark>
          </S.ActionButtons>
        </S.Actions>
      </S.NavContent>
    </S.HeaderWrapper>
  )
}

export default Header
