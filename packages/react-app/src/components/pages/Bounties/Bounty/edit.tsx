import RestrictedTo from "@app/components/global/Auth";
import bountyStatus from "@app/constants/bountyStatus";
import { useUser } from "@app/hooks/useUser";
import { BountyCollection } from "@app/models/Bounty";
import { Button, useColorMode } from "@chakra-ui/react";
import router from "next/router";

export const BountyEditButton: React.FC<{ bounty: BountyCollection }> = ({ bounty }) => {
	const { user } = useUser();
    const { colorMode } = useColorMode();
	const show = () => {
		const isOpen = bounty.status === bountyStatus.OPEN;
		const isOwnBounty = bounty.createdBy.discordId === user?.id;
		return isOwnBounty && isOpen;
	};
	return (
		<>
			{
				show() && 
				<RestrictedTo roles={['edit-own-bounty', 'admin']}>
					<Button 
                        bg='transparent' 
                        border="2px" 
                        borderColor={colorMode === 'dark' ? "primary.700" : 'primary.300' }
                        onClick={() => router.push(`/${bounty._id}/edit`)}
                    >Edit</Button>
				</RestrictedTo>
			}
		</>
	)
}
