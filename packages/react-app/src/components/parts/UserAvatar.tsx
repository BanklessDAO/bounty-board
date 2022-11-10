import { DiscordBoardUser } from '@app/models/Bounty';
import { Avatar } from '@chakra-ui/react';

// import { getAnyDiscordUser } from '@app/services/discord.service';

const UserAvatar = (props: {
  user: DiscordBoardUser;
  size?: any;
}): JSX.Element => {
	const { user, size } = props;

	const avatarSrc = user?.iconUrl ? user.iconUrl : '';

	return <Avatar size={size ? size : 'sm'} name="" src={avatarSrc} />;
};

export default UserAvatar;
