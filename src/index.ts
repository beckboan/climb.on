import { MikroORM } from "@mikro-orm/postgresql";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

const main = async () => {
  const orm = MikroORM.init({
    dbName: "climbon",
    debug: !__prod__,
    entities: [Post],
    // user: "",
    // password: "",
  });
  console.log("Hello ye");
  console.log("YES");

  const post = (await orm).em.create(Post, {
    title: "my first post",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  (await orm).em.persistAndFlush(post);
};

main();
