"use client";

import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../../../generated/graphql";
import { Provider } from "urql";
import { urqlClient } from "@/utils/urql/urqlClient";

interface NavBarProps {}

const NavBarContent: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();

  let body = null;

  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login" passHref legacyBehavior>
          <Link color="white" mr={2}>
            login
          </Link>
        </NextLink>

        <NextLink href="/register" passHref legacyBehavior>
          <Link color="white">register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout({});
          }}
          isLoading={logoutFetching}
          variant={"link"}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
    <Provider value={urqlClient}>
      <NavBarContent />
    </Provider>
  );
};

export default NavBar;
