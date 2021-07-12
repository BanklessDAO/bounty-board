import { css } from 'styled-components'

export const primaryColors = {
  blue: '#3772FF',
  purple: '#9757D7',
  pink: '#EF466F',
  green: '#45B26B',
}
export const secondaryColors = {
  blue: '#4BC9F0',
  offWhite: '#E4D7CF',
  yellow: '#FFD166',
  purple: '#CDB4DB',
}
export const neutralColors = {
  one: '#141416',
  two: '#23262F',
  three: '#353945',
  four: '#777E90',
  five: '#B1B5C3',
  six: '#E6E8EC',
  seven: '#F4F5F6',
  eight: '#FCFCFD',
}

export const fontStyles = {
  H1: css`
    font-weight: 700;
    font-size: 64px;
    line-height: 64px;
  `,
  H2: css`
    font-weight: 700;
    font-size: 48px;
    line-height: 56px;
  `,
  H3: css`
    font-weight: 700;
    font-size: 40px;
    line-height: 48px;
  `,
  H4: css`
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
  `,
  largeP: css`
    font-family: Poppins;
    font-weight: 400;
    font-size: 24px;
    line-height: 32px;
  `,
  P: css`
    font-family: Poppins;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  `,
  mediumP: css`
    font-family: Poppins;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
  `,
  smallP: css`
    font-family: Poppins;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
  `,
}

export const breakpoints = {
  xsm: '320px',
  sm: '480px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
}
