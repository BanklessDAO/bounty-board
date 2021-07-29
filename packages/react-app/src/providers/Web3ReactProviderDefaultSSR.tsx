import { createWeb3ReactRoot } from '@web3-react/core'
import { ReactElement } from 'react'
import { DefaultProviderName } from '../constants'

const Web3ReactProviderDefault = createWeb3ReactRoot(DefaultProviderName)

const Web3ReactProviderDefaultSSR = ({ children, getLibrary }: {children: any, getLibrary: any}): ReactElement => {
  return (
    <Web3ReactProviderDefault getLibrary={getLibrary}>
      {children}
    </Web3ReactProviderDefault>
  )
}

export default Web3ReactProviderDefaultSSR