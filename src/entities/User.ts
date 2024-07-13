import { Entity, PrimaryKey, Property, OptionalProps } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  username!: string;

  @Property({ type: "text" })
  password!: string;

  @Field(() => String)
  @Property({ type: "date", defaultRaw: "now()" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date(), defaultRaw: "now()" })
  updatedAt = new Date();
}
