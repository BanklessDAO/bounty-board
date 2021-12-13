import Router from 'next/router';
import NProgress from 'nprogress';
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { baseTheme, updateThemeForCustomer } from '../styles/customTheme';
import SEO from '../../next-seo.config';
import GlobalStyle from '../styles';
import { CustomerProps } from '../models/Customer';
import '../styles/css/nprogress.css';
import { CustomerContext, getCustomerFromBountyId, setCustomerFromLocalStorage } from '../context/CustomerContext';
import { BANKLESS } from '../constants/Bankless';


Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


const MotionBox = motion(Box);

function MyApp({ Component, pageProps: { session, ...pageProps }, router }: AppProps): JSX.Element {
	const [theme, setTheme] = useState(baseTheme);
	const [customer, setCustomer] = useState<CustomerProps>(BANKLESS);
	const { id } = router.query;
	const customerFromId = getCustomerFromBountyId(id);

	useEffect(() => {
		setCustomerFromLocalStorage(setCustomer);
	}, []);

	useEffect(() => {
		if (customerFromId) setCustomer(customerFromId);
	}, [customerFromId]);
	
	useEffect(() => {
		updateThemeForCustomer(customer, setTheme);
		localStorage.setItem('customer', JSON.stringify(customer));
	}, [customer]);

	return (
		<SessionProvider session={session}>
			<CustomerContext.Provider value={{ customer, setCustomer }}>
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
								<Component {...pageProps} />
							</MotionBox>
						</AnimatePresence>
					</GlobalStyle>
				</ChakraProvider>
			</CustomerContext.Provider>
		</SessionProvider>
	);
}

export default MyApp;
