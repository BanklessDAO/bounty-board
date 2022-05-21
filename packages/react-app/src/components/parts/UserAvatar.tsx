import { Avatar } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
// import { getAnyDiscordUser } from '@app/services/discord.service';

const UserAvatar = (props: { userId: any; size?: any; }): JSX.Element => {
	const { userId, size } = props;
	const [avatarSrc, setAvatarSrc] = useState('');
	const { data: session } = useSession({ required: false });
	console.log(userId);
	console.log(session);

	useEffect(() => {
		if (!avatarSrc) {
			getAvatarSrc();
		}
	}, []);

	const getAvatarSrc = async () => {
		const avatarSource = '';
		// TODO: Put this behind the API and tie to the user model
		// console.log(session);
		// if (userId && session && session.accessToken)  {
		// 	const discordUser = await getAnyDiscordUser(session.accessToken as string, userId);
		// 	if (discordUser && discordUser.data.avatar) {
		// 		avatarSource = `https://cdn.discordapp.com/avatars/${userId}/${discordUser.data.avatar}.png`;
		// 	}
		// }
		setAvatarSrc(avatarSource);
	};

	return (
		<Avatar size={ size ? size : 'sm' } name='' src={avatarSrc} />
	);
};

export default UserAvatar;
