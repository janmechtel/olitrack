export const schema = gql`
  type Price {
    id: Int!
    symbol_exchange: String!
    date: DateTime!
    value: Int!
  }

  type Query {
    prices: [Price]
  }

  input PriceInput {
    symbol_exchange: String
    date: DateTime
    value: Int
  }

  type Mutation {
    createPrice(input: PriceInput!): Price
  }
`
