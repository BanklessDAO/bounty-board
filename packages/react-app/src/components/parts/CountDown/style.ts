import styled from 'styled-components'

export const Container = styled.section`
  margin: auto;
`

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (min-width: 35.5em) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0 6rem;
  }
`

export const Header = styled.header<{ size?: any }>`
  margin-bottom: 2rem;
  & h1 {
    color: #798eb0;
    font-family: Mukta;
    font-size: ${(props) => {
      if (props.size) return props.size
      return 'clamp(1rem, 2vw, 99rem)'
    }};
    font-weight: 300;
    letter-spacing: 0.1875em;
    margin: unset;
    text-align: center;
    text-transform: uppercase;
  }
`

export const Counter = styled.div<{ counterColor?: any; size?: any }>`
    background: rgba(255, 255, 255, 0.025);
    border-radius: 1rem;
    color: ${(props) => {
      if (props.counterColor) return props.counterColor
      return 'black'
    }};
    display: flex;
    flex-direction: column;
    font-family: "JetBrains Mono", mono;
    font-size: ${(props) => {
      if (props.size) return props.size
      return 'clamp(1rem, 8vw, 99rem)'
    }};
    font-weight: 100;
    line-height: 1;
    padding: 2vw
    text-align: center;
  
    h2 {
      color: #798EB0;
      font-family: Mukta;
      font-size: ${(props) => {
        if (props.size) return props.size
        return 'clamp(1rem, 2vw, 99rem)'
      }};
      font-weight: 300;
      letter-spacing: .1875em;
      margin: 1.25rem 0 0;
      order: 1;
      overflow: hidden
      text-overflow: ellipsis;
      text-transform: uppercase;
      white-space: nowrap;
      width: 100%;
    }
  `
