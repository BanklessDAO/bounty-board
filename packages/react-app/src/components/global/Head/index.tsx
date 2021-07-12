import NextHead from 'next/head'
import { ReactElement } from 'react'

export interface PageMetaProps {
  title: string
  description: string
  url: string
}

const Head = ({ title = '', description = '' }: PageMetaProps): ReactElement => {
  // TODO social images
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="shortcut icon" type="image/png" href="/favicon.png" />
    </NextHead>
  )
}

export default Head
