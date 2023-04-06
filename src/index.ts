import 'reflect-metadata'
import * as tq from 'type-graphql'
import { UserResolver } from './UserResolver'
import { ApolloServer } from 'apollo-server'
import { DateTimeResolver } from 'graphql-scalars'
import { GraphQLScalarType } from 'graphql'
import { customAuthChecker } from './customAuthChecker';
import { createContext } from './createContext'
import { config } from 'dotenv'
config({ path: '.env' })

const INIT_MESSAGE = `
🚀 Server ready at: http://localhost:4000
⭐️  See sample queries: http://pris.ly/e/ts/graphql-typegraphql#using-the-graphql-api
`;

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [UserResolver],
    authChecker: customAuthChecker,
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    validate: { forbidUnknownValues: false }
  })

  new ApolloServer({ 
    schema, 
    context: createContext
  }).listen({ port: 4000 }, () =>
    console.log(INIT_MESSAGE),
  )
}

app()
