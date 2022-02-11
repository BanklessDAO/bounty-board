import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  Stack,
  Divider,
} from "@chakra-ui/react";
import ThemeToggle from "@app/components/parts/ThemeToggle";
import { MenuLinks } from "./MenuLinks";

interface MobileProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

export const MobileMenu = ({ isOpen, onClose }: MobileProps): JSX.Element => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xs">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton w={"4em"} h={"4em"} onClick={onClose} />
        <DrawerHeader display={"flex"} p="2">
          <Heading as="h1" size="xl">
            <u>Bounty Board</u>
          </Heading>
        </DrawerHeader>
        <Divider />
        <DrawerBody mt="1" p="0">
          <Stack
            spacing={0}
            align="stretch"
            justify={"center"}
            direction={"column"}
          >
            <MenuLinks />
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <ThemeToggle />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
