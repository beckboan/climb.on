import "reflect-metadata";
import { __prod__, COOKIE_NAME } from "./constants";
import { MyContext } from "./types";

import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./mikro-orm.config";

import express from "express";
import cors from "cors";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";

import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import session from "express-session";
import { createClient } from "redis";
import RedisStore from "connect-redis";

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

    // --REDIS SETUP-- //
    // Initialize client.
    let redisClient = createClient();
    redisClient.connect().catch(console.error);

    // Initialize store.
    const redisStore = new RedisStore({
      client: redisClient,
      prefix: "myapp:",
      disableTouch: true,
    });

    // Initialize session storage.
    app.use(
      session({
        name: COOKIE_NAME,
        store: redisStore,
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        secret: "qpwrakldjlkawejrpajwdpaiwdj",
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
          httpOnly: true,
          sameSite: "lax",
          secure: __prod__, // Cookies only works in https
        },
      })
    );

    // --APOLLO SETUP-- //
    const server = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
      }),
    });

    await server.start();

    app.use(
      "/",
      cors<cors.CorsRequest>({
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req, res }): Promise<MyContext> => ({ em, req, res }),
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
