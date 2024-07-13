import "reflect-metadata";
import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  try {
    // -- ORM SETUP -- //
    // Initialize ORM and run migrations
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();
    // Fork the EntityManager
    const em = orm.em.fork();

    // -- SERVER SETUP -- //
    const app = express();

    const server = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver],
        validate: false,
      }),
    });

    await server.start();

    app.use(
      "/",
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async () => ({ em }),
      })
    );

    app.listen(4000, () => {
      console.log("Server listening on port 4000");
    });

    // Create a new Post entity
    // const post = em.create(Post, {
    //   title: "my first post",
    // });

    // await em.persistAndFlush(post);

    // const post = await em.find(Post, {});

    // console.log(post);
  } catch (err) {
    console.error(err);
  }
};

main();
