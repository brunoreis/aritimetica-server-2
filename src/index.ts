import 'reflect-metadata'
import * as tq from 'type-graphql'
import { UserResolver } from './UserResolver'
import { ApolloServer } from 'apollo-server'
import { DateTimeResolver } from 'graphql-scalars'
import { GraphQLScalarType } from 'graphql'
import { PrismaClient } from '@prisma/client'
import { authChecker } from "./AuthChecker";
import { createContext } from './createContext'


const INIT_MESSAGE = `
🚀 Server ready at: http://localhost:4000
⭐️  See sample queries: http://pris.ly/e/ts/graphql-typegraphql#using-the-graphql-api
`;

const app = async () => {

  const schema = await tq.buildSchema({
    resolvers: [UserResolver],
    authChecker,
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    validate: { forbidUnknownValues: false }
  })

  const prisma = new PrismaClient()

  new ApolloServer({ 
    schema, 
    context: createContext
  }).listen({ port: 4000 }, () =>
    console.log(INIT_MESSAGE),
  )
}

app()
