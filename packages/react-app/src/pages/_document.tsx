import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'

export default class MyDocument extends NextDocument {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await NextDocument.getInitialProps(ctx)
    return { ...initialProps }
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://bountyboard.bankless.community" />
          <meta property="og:title" content="Bankless Bounty Board" />
          <meta property="og:description" content="Find, claim, and post bounties" />
          <meta name="twitter:image" content="https://bountyboard.bankless.community/preview.png"/>

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
        </Head>

        <body>
          <ColorModeScript initialColorMode={'dark'} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
