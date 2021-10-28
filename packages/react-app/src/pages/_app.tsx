import Router from 'next/router';
import NProgress from 'nprogress';
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Provider } from 'next-auth/client';
import { DefaultSeo } from 'next-seo';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { customizeTheme, baseTheme } from '../styles/customTheme';
import SEO from '../../next-seo.config';
import GlobalStyle from '../styles';
import { CustomerProps } from '../types/Customer';
import 'styles/css/nprogress.css';
import { BANKLESS } from './api/customer/customer.service';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MotionBox = motion(Box);

function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
	const [theme, setTheme] = useState(baseTheme);
	const [customer, setCustomer] = useState<CustomerProps>(BANKLESS);

	useEffect(() => {
		// update the global theme when the customer changes 
		const { Customization } = customer;
		let newTheme = baseTheme;
		if (Customization) {
			newTheme = customizeTheme(Customization);
		}
		setTheme(newTheme);
	}, [customer]);

	return (
		<Provider session={pageProps.session}>
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
							<Component {...{ ...pageProps, customer, setCustomer }} />
						</MotionBox>
					</AnimatePresence>
				</GlobalStyle>
			</ChakraProvider>
		</Provider>
	);
}

export default MyApp;
