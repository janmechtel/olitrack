import { db } from 'src/lib/db'

export const prices = () => {
  return db.price.findMany()
}

export const createPrice = ({ input }) => {
  return db.price.create({ data: input })
}
