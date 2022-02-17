import React from "react";
import { RiMenuFill, RiCloseFill } from "react-icons/ri";
import { Box, Stack, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { MenuLinks } from "./MenuLinks";
import ThemeToggle from "@app/components/parts/ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const CloseIcon = ({ color }: { color: string }) => (
  <RiCloseFill size="2.7em" color={color} />
);
const MenuIcon = ({ color }: { color: string }) => (
  <RiMenuFill size="2.5em" color={color} />
);

interface MenuToggleProps {
  toggle: VoidFunction;
  isOpen: boolean;
}

export const MenuToggle = ({
  toggle,
  isOpen,
}: MenuToggleProps): JSX.Element => {
  const fgColor = useColorModeValue("black", "white");
  return (
    <Box display={{ base: "flex", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon color={fgColor} /> : <MenuIcon color={fgColor} />}
    </Box>
  );
};

export const Menu = (): JSX.Element => {
  // predefined hook from Chakra for toggle behavior
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {/* appears if size is under md */}
      <MenuToggle toggle={onOpen} isOpen={isOpen} />
      {isOpen ? (
        <MobileMenu isOpen={isOpen} onClose={onClose} />
      ) : (
        <Box
          display={{
            base: "none",
            md: "block",
          }}
          flexBasis={{ base: "100%", md: "auto" }}
        >
          <Stack
            spacing={4}
            align="stretch"
            justify={{ base: "center", sm: "space-between", md: "flex-end" }}
            direction={{ base: "column", md: "row" }}
          >
            <MenuLinks />
            <ThemeToggle />
          </Stack>
        </Box>
      )}
    </>
  );
};
