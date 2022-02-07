import Image from "next/image";
import React, { useContext, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { MenuLinks, MenuToggle } from "./Menu";
import { CustomerContext } from "../../../context/CustomerContext";

const NavBarContainer: React.FC = (props): JSX.Element => (
  <Flex
    as="nav"
    align="center"
    justify="space-between"
    wrap="wrap"
    w="100%"
    p={8}
    {...props}
  >
    {props.children}
  </Flex>
);

const NavBar: React.FC = (props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { customer } = useContext(CustomerContext);
  return (
    <NavBarContainer {...props}>
      {!isOpen ? (
        <Image
          src={customer?.customization?.logo ?? "/logo.png"}
          height={50}
          width={50}
          alt={`${customer?.customerName ?? "DAO"} Logo`}
        />
      ) : null}
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

export default NavBar;