import 'reflect-metadata'
import {
  Authorized,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Int,
  InputType,
  Field,
} from 'type-graphql'
import { User } from './User'
import { Context } from './types'
import { sign } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "./env";
import bcrypt from 'bcrypt';
import { AuthResponse } from './AuthResponse';
import { customAuthChecker } from "./customAuthChecker";

@InputType()
class UserCreateInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;
}

@Resolver(User)
export class UserResolver {

  @Mutation(() => AuthResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: Context
  ): Promise<AuthResponse> {
    const user = await ctx.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid Email or password");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or Password");
    }
    const token = sign({ userId: user.id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return { user, token };
  }

  @Mutation(() => User)
  async deleteUser(
    @Arg('id', (type) => String) id: string, 
    @Ctx() ctx: Context
  ): Promise<User> {
    const deletedUser = await ctx.prisma.user.delete({
      where: { id },
    });
    return deletedUser;
  }

@Mutation((returns) => User)
async signupUser(
  @Arg('data') data: UserCreateInput,
  @Ctx() ctx: Context,
): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, 10)
  return ctx.prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
      bio: data.bio,
    },
  })
}

  @Authorized(["admin"],  { authChecker: customAuthChecker })
  @Query(() => [User])
  async allUsers(@Ctx() ctx: Context) {
    return ctx.prisma.user.findMany()
  }

}
