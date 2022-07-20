import Router from 'next/router';
import NProgress from 'nprogress';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import SEO from '../../next-seo.config';
import GlobalStyle from '../styles';
import '../styles/css/nprogress.css';
import '../styles/css/date-picker.css';
import '../styles/css/bounty.css';
import { CustomerContext } from '../context/CustomerContext';
import { useTheme } from '@app/hooks/useTheme';
import { useCustomer } from '@app/hooks/useCustomer';
import AuthContextProvider from '@app/context/AuthContext';

Router.events.on('routeChangeStart', function() {
	return NProgress.start();
});

Router.events.on('routeChangeComplete', function() {
	return NProgress.done();
});

Router.events.on('routeChangeError', function() {
	return NProgress.done();
});

const MotionBox = motion(Box);

function MyApp({ Component, pageProps: { session, ...pageProps }, router }: AppProps): JSX.Element {
	const { id, customerKey } = router.query;
	const { customer, setCustomer } = useCustomer(id, customerKey);

	const theme = useTheme(customer);
	return (
		<SessionProvider session={session}>
			<CustomerContext.Provider value={{ customer, setCustomer }}>
				<ChakraProvider resetCSS theme={theme}>
					<AuthContextProvider>
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
					</AuthContextProvider>
				</ChakraProvider>
			</CustomerContext.Provider>
		</SessionProvider>
	);
}

export default MyApp;
