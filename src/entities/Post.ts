import { Entity, PrimaryKey, Property, OptionalProps } from "@mikro-orm/core";

@Entity()
export class Post {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey()
  id!: number;

  @Property({ type: "string" })
  title!: string;

  @Property({ type: "date", defaultRaw: "now()" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date(), defaultRaw: "now()" })
  updatedAt = new Date();
}
