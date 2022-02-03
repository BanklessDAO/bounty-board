import React, { useContext, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { MenuLinks, MenuToggle } from "./Menu";
import { CustomerContext } from "../../../context/CustomerContext";
import Image from "next/image";

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

const myLoader = ({ src, width, quality }) => {
  return `https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.2p9BfZBVR9JDnNyMsTqXngHaHa%26pid%3DApi&f=1${src}?w=${width}&q=${
    quality || 75
  }`;
};

const NavBar: React.FC = (props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { customer } = useContext(CustomerContext);
  return (
    <NavBarContainer {...props}>
      {!isOpen ? (
        <Image
          loader={myLoader}
          src="src"
          alt={`${customer?.customerName ?? "DAO"} Logo`}
          width={50}
          height={50}
          quality={100}
        />
      ) : null}
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

export default NavBar;
