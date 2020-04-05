export const schema = gql`
  type Price {
    id: Int!
    symbol_exchange: String!
    date: DateTime!
    value: Int!
  }

  type SymbolPrice {
    symbol_exchange: String!
    prices: [Price]
  }

  type Query {
    prices(symbols: [String]): [SymbolPrice]
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
