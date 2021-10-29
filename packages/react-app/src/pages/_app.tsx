import Router from 'next/router';
import NProgress from 'nprogress';
import { AppProps } from 'next/app';

import { DefaultSeo } from 'next-seo';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import SEO from '../../next-seo.config';
import GlobalStyle from '../styles';
import customTheme from '../styles/customTheme';
import 'styles/css/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MotionBox = motion(Box);

function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
	return (
		<ChakraProvider resetCSS theme={customTheme}>
			<DefaultSeo {...SEO} />
			<GlobalStyle>
				<AnimatePresence exitBeforeEnter>
					<MotionBox
						key={router.route}
						animate="enter"
						as="main"
						exit="exit"
						flexGrow={1}
						initial="initial"
						variants={{
							initial: { opacity: 0, y: -10 },
							enter: { opacity: 1, y: 0 },
							exit: { opacity: 0, y: 10 },
						}}
					>
						<Component {...pageProps} />
					</MotionBox>
				</AnimatePresence>
			</GlobalStyle>
		</ChakraProvider>
	);
}

export default MyApp;
