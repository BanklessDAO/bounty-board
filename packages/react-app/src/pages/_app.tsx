import Router from 'next/router';
import NProgress from 'nprogress';
import { AppProps } from 'next/app';
import { useState } from 'react';
import { DefaultSeo } from 'next-seo';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChakraTheme } from '@chakra-ui/theme';
import { customizeTheme, baseTheme }  from '../styles/customTheme';
import SEO from '../../next-seo.config';
import GlobalStyle from '../styles';
import { Customer } from '../types/Customer';
import { customers } from '../models/stubs/Customer';
import 'styles/css/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MotionBox = motion(Box);

function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
	const [customer, setCustomer] = useState<Customer>(customers[0]);
	const theme = customer.customization ? customizeTheme(customer.customization) : baseTheme;	
	return (
		<ChakraProvider resetCSS theme={theme}>
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
						<Component {...{...pageProps, customer, setCustomer }} />
					</MotionBox>
				</AnimatePresence>
			</GlobalStyle>
		</ChakraProvider>
	);
}

export default MyApp;
