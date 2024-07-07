import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import path from "path";
require("dotenv").config();

export default defineConfig({
  extensions: [Migrator],
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pathTs: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
    disableForeignKeys: false,
  },
  debug: __prod__,
  entities: [Post],
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  allowGlobalContext: false,
});
