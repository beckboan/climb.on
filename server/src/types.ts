import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session } from "express-session";
import "express-session";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Session };
  res: Response;
};

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
