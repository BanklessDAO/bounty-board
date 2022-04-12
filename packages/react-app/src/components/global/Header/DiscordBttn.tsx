import React from 'react';
import { Button, Img, Text } from '@chakra-ui/react';
import { toggleDiscordSignIn } from '../../../services/discord.service';
import { Session } from 'inspector';

export default function DiscordBttn({
	session,
}: {
  session: Session | unknown;
}) {
	return (
		<Button
			onClick={() => toggleDiscordSignIn(session)}
			id="DiscordButton"
			bg={'#5865F2'}
			w={{ base: '20em', md: 'auto' }}
			h={{ base: '3em', md: '2.4em' }}
		>
			<Img
				src="./assets/logos/discordWhite.png"
				boxSize={'1.5em'}
				mr={'.25em'}
			/>
			<Text color="white">Login</Text>
		</Button>
	);
}
