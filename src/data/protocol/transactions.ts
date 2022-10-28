import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import gql from 'graphql-tag'
import { Transaction, TransactionType, Burn, Swap, Mint } from 'types'
import { formatTokenSymbol } from 'utils/tokens'

const GLOBAL_TRANSACTIONS = gql`
  query transactions {
    transactions(first: 500, orderBy: timestamp, orderDirection: desc, subgraphError: allow) {
      id
      timestamp
      mints {
        pool {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        owner
        sender
        origin
        amount0
        amount1
        amountUSD
      }
      swaps {
        pool {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        origin
        amount0
        amount1
        amountUSD
      }
      burns {
        pool {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        owner
        origin
        amount0
        amount1
        amountUSD
      }
    }
  }
`

type TransactionEntry = {
  timestamp: string
  id: string
  mints: {
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  swaps: {
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  burns: {
    pool: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
    }
    owner: string
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
}

interface TransactionResults {
  transactions: TransactionEntry[]
}

export async function fetchTopTransactions(
  client: ApolloClient<NormalizedCacheObject>
): Promise<Transaction[] | undefined> {
  try {
    const { data, error, loading } = await client.query<TransactionResults>({
      query: GLOBAL_TRANSACTIONS,
      fetchPolicy: 'cache-first',
    })

    if (error || loading || !data) {
      return undefined
    }

    const formatted = data.transactions.reduce((accum: Transaction[], t: TransactionEntry) => {
      const mintEntries = t.mints.map((m) => {
        return {
          type: TransactionType.MINT,
          hash: t.id,
          timestamp: t.timestamp,
          sender: m.origin,
          token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
          token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
          token0Address: m.pool.token0.id,
          token1Address: m.pool.token1.id,
          amountUSD: parseFloat(m.amountUSD),
          amountToken0: parseFloat(m.amount0),
          amountToken1: parseFloat(m.amount1),
        }
      })
      const burnEntries = t.burns.map((m) => {
        return {
          type: TransactionType.BURN,
          hash: t.id,
          timestamp: t.timestamp,
          sender: m.origin,
          token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
          token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
          token0Address: m.pool.token0.id,
          token1Address: m.pool.token1.id,
          amountUSD: parseFloat(m.amountUSD),
          amountToken0: parseFloat(m.amount0),
          amountToken1: parseFloat(m.amount1),
        }
      })

      const swapEntries = t.swaps.map((m) => {
        return {
          hash: t.id,
          type: TransactionType.SWAP,
          timestamp: t.timestamp,
          sender: m.origin,
          token0Symbol: formatTokenSymbol(m.pool.token0.id, m.pool.token0.symbol),
          token1Symbol: formatTokenSymbol(m.pool.token1.id, m.pool.token1.symbol),
          token0Address: m.pool.token0.id,
          token1Address: m.pool.token1.id,
          amountUSD: parseFloat(m.amountUSD),
          amountToken0: parseFloat(m.amount0),
          amountToken1: parseFloat(m.amount1),
        }
      })
      accum = [...accum, ...mintEntries, ...burnEntries, ...swapEntries]
      return accum
    }, [])

    console.log('subgraph: formatted global tx data:', formatted)

    return formatted
  } catch {
    return undefined
  }
}

type TransactionEntryTest = {
  timestamp: string
  id: string
  mints: Mint[]
  burns: Burn[]
  swaps: Swap[]
}
interface TransactionResultsTest {
  transactions: TransactionEntryTest[]
}

const GLOBAL_TRANSACTIONS_GFX = gql`
  query Transactions {
    transactions(limit: 20, filter: { orderDirection: "DESC" }) {
      id
      blockNumber
      timestamp
      mints {
        id
        timestamp
        owner
        sender
        amount
        amount0
        amount1
        tickLower
        tickUpper
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      burns {
        id
        timestamp
        owner
        origin
        amount
        amount0
        amount1
        amountUSD
        tickLower
        tickUpper
        logIndex
        transaction {
          id
          blockNumber
          timestamp
        }
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      swaps {
        id
        timestamp
        amount0
        amount1
        amountUSD
        sender
        recipient
        origin
        sqrtPriceX96
        tick
        logIndex
        sqrtPriceX96
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        transaction {
          blockNumber
        }
      }
      flashed {
        id
      }
      collects {
        id
      }
    }
  }
`

const convertDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const timestampInSeconds = Math.floor(date.getTime() / 1000)
  return timestampInSeconds.toString()
}

export async function fetchTopTransactionsGfx(
  client: ApolloClient<NormalizedCacheObject>
): Promise<Transaction[] | undefined> {
  try {
    const { data, error, loading } = await client.query<TransactionResultsTest>({
      query: GLOBAL_TRANSACTIONS_GFX,
      fetchPolicy: 'cache-first',
    })

    if (error || loading || !data) {
      return undefined
    }

    const masterrr = data.transactions.reduce((accum: Transaction[], t: TransactionEntryTest) => {
      const burnEntries = t.burns.map((m) => {
        return {
          type: TransactionType.BURN,
          hash: t.id,
          timestamp: convertDate(m.timestamp),
          sender: m.owner, // owner is sender here.
          token0Symbol: m.token0.symbol,
          token1Symbol: m.token1.symbol,
          token0Address: m.token0.id,
          token1Address: m.token1.id,
          amountUSD: parseFloat(m.amountUSD),
          amountToken0: parseFloat(m.amount0),
          amountToken1: parseFloat(m.amount1),
        }
      })

      const swapEntries = t.swaps.map((m) => {
        return {
          type: TransactionType.SWAP,
          hash: t.id,
          timestamp: convertDate(m.timestamp),
          sender: m.sender,
          token0Symbol: m.token0.symbol,
          token1Symbol: m.token1.symbol,
          token0Address: m.token0.id,
          token1Address: m.token1.id,
          amountUSD: parseFloat(m.amountUSD),
          amountToken0: parseFloat(m.amount0),
          amountToken1: parseFloat(m.amount1),
        }
      })

      const mintEntries = t.mints.map((m) => {
        return {
          type: TransactionType.MINT,
          hash: t.id,
          timestamp: convertDate(m.timestamp),
          sender: m.sender,
          token0Symbol: m.token0.symbol,
          token1Symbol: m.token1.symbol,
          token0Address: m.token0.id.toLowerCase(),
          token1Address: m.token1.id.toLowerCase(),
          amountUSD: parseFloat(m.amountUSD),
          amountToken0: parseFloat(m.amount0),
          amountToken1: parseFloat(m.amount1),
        }
      })

      accum = [...accum, ...burnEntries, ...swapEntries, ...mintEntries]
      return accum
    }, [])

    return masterrr
  } catch (error) {
    return undefined
  }
}
