import * as S from './style'
import React from 'react'

interface TimeDisplayValuesType {
  days: number
  hours: number
  minutes: number
  seconds: number
}
interface CounterType {
  displayValue: number
  label: string
  size: string
}

// timing
const generateTimeDisplay = (targetDate): TimeDisplayValuesType => {
  const rightJustNow = new Date().getTime()
  const runway = targetDate - rightJustNow
  const stateObj = {
    days: Math.floor(runway / (1000 * 60 * 60 * 24)),
    hours: Math.floor((runway % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((runway % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((runway % (1000 * 60)) / 1000),
  }
  return stateObj
}

// components
const Counter = ({ displayValue, label, size }: CounterType) => (
  <S.Counter counterColor="#8973FD" size={size}>
    <h2>{label}</h2>
    {displayValue}
  </S.Counter>
)

const CountDown = ({
  header = '',
  targetDate = new Date().getTime(),
  size = '',
}) => {
  const [timeDisplay, setTimeDisplay] = React.useState<TimeDisplayValuesType>(
    generateTimeDisplay(targetDate)
  )
  React.useEffect(() => {
    setInterval(() => setTimeDisplay(generateTimeDisplay(targetDate)), 1000)
  }, [])

  return (
    <S.Container>
      {header && (
        <S.Header size={size}>
          <h1>{header}</h1>
        </S.Header>
      )}
      <S.Wrapper>
        <Counter displayValue={timeDisplay.days} label={'Days'} size={size} />
        <Counter displayValue={timeDisplay.hours} label={'Hours'} size={size} />
        <Counter
          displayValue={timeDisplay.minutes}
          label={'Minutes'}
          size={size}
        />
        <Counter
          displayValue={timeDisplay.seconds}
          label={'Seconds'}
          size={size}
        />
      </S.Wrapper>
    </S.Container>
  )
}

export default CountDown
