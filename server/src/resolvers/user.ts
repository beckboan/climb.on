import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field(() => String)
  username: string;
  @Field(() => String)
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field?: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input") input: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      const userCheck = await em.findOne(User, { username: input.username });
      if (userCheck) {
        return {
          errors: [
            {
              field: "username",
              message: "Username already exists - please try a different one.",
            },
          ],
        };
      }
      if (input.username.length <= 4) {
        return {
          errors: [
            {
              field: "username",
              message: "Username must be longer than 4 characters",
            },
          ],
        };
      }
      if (input.password.length <= 4) {
        return {
          errors: [
            {
              field: "password",
              message: "Password must be longer than 4 characters",
            },
          ],
        };
      }
      const hashedPassword = await argon2.hash(input.password);
      const user = em.create(User, {
        username: input.username,
        password: hashedPassword,
      });
      await em.persistAndFlush(user);

      req.session.userId = user.id;

      return { user };
    } catch (err) {
      const code = err.code;
      console.log(err.message);
      return {
        errors: [
          {
            message: `Unknown error occured: ${code}`,
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: input.username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "Username does not exist" }],
      };
    }
    const valid = await argon2.verify(user.password, input.password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Password is not correct" }],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
