import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "./components/nav/NavBar";
import { registerUrql } from "@urql/next/rsc";
import { cacheExchange, createClient, fetchExchange, gql } from "@urql/next";
import { ChakraProvider } from "@chakra-ui/react";
// import { PostsDocument } from "@/generated/graphql";
import { PostsDocument, PostsQuery } from "@/generated/server";

const makeClient = () => {
  return createClient({
    url: "http://localhost:4000/graphql",
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      credentials: "include",
    },
    suspense: true,
  });
};

const postsq = gql`
  query {
    posts {
      id
      createdAt
      updatedAt
      title
    }
  }
`;

const { getClient } = registerUrql(makeClient);

export default async function Home() {
  const fetchPosts = async () => {
    const result = await getClient().query(PostsDocument, {});
    return result.data as PostsQuery;
  };

  return (
    <>
      <ChakraProvider>
        <NavBar />
      </ChakraProvider>
      <h1>Hello world</h1>
      {fetchPosts().then((data) =>
        !data ? null : data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
}
