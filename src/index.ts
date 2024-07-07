import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "./mikro-orm.config";
import { Post } from "./entities/Post";

const main = async () => {
  try {
    // Initialize ORM and run migrations
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();

    // Fork the EntityManager for specific operations
    const em = orm.em.fork();

    // Create a new Post entity
    const post = em.create(Post, {
      title: "my first post",
    });

    await em.persistAndFlush(post);

    console.log(post);
  } catch (err) {
    console.error(err);
  }
};

main();
