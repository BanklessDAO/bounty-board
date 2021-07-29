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
          <meta content="ie=edge" httpEquiv="X-UA-Compatible" />

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
