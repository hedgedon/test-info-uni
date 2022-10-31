import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import gql from 'graphql-tag'
import { PoolData, TransactionType, TransactionTest } from 'types'
import { convertDate } from 'utils/date'

const POOL_TRANSACTIONS_GFX = gql`
  query pool($id: String!) {
    pool(filter: { id: $id }) {
      id
      createdAtBlockNumber
      liquidity
      feeTier
      token0 {
        id
        symbol
        name
        decimals
        totalSupply
      }
      token1 {
        id
        symbol
        name
        decimals
        totalSupply
      }
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
    }
  }
`

export async function fetchPoolTransactionsGfx(
  address: string,
  client: ApolloClient<NormalizedCacheObject>
): Promise<{
  // data: PoolData | undefined;
  data: TransactionTest[] | undefined
  error: boolean
  loading: boolean
}> {
  const { data, error, loading } = await client.query<PoolData>({
    query: POOL_TRANSACTIONS_GFX,
    variables: {
      id: address,
    },
    fetchPolicy: 'cache-first',
  })

  if (error) {
    return {
      data: undefined,
      error: true,
      loading: false,
    }
  }

  if (loading && !data) {
    return {
      data: undefined,
      error: false,
      loading: true,
    }
  }

  // TODO: update formatting for values
  // NEED DATA FOR SENDER

  const mints = data.pool.mints.map((m) => {
    return {
      type: TransactionType.MINT,
      hash: m.id,
      timestamp: convertDate(m.timestamp),
      sender: m.sender,
      token0Symbol: m.token0.symbol,
      token1Symbol: m.token1.symbol,
      token0Address: m.token0.id,
      token1Address: m.token1.id,
      amountUSD: parseFloat(m.amountUSD),
      amountToken0: parseFloat(m.amount0), // needs to be number
      amountToken1: parseFloat(m.amount1), // needs to be number
    }
  })

  const swaps = data.pool.swaps.map((m) => {
    return {
      type: TransactionType.SWAP,
      hash: m.id,
      timestamp: convertDate(m.timestamp),
      // sender: m.sender,
      sender: m.recipient,
      token0Symbol: m.token0.symbol,
      token1Symbol: m.token1.symbol,
      token0Address: m.token0.id,
      token1Address: m.token1.id,
      amountUSD: parseFloat(m.amountUSD),
      amountToken0: parseFloat(m.amount0), // needs to be number
      amountToken1: parseFloat(m.amount1), // needs to be number
    }
  })

  const burns = data.pool.burns.map((m) => {
    return {
      type: TransactionType.BURN,
      hash: m.id,
      timestamp: convertDate(m.timestamp),
      sender: m.owner, // owner is sender here.
      token0Symbol: m.token0.symbol,
      token1Symbol: m.token1.symbol,
      token0Address: m.token0.id,
      token1Address: m.token1.id,
      amountUSD: parseFloat(m.amountUSD),
      amountToken0: parseFloat(m.amount0), // needs to be number
      amountToken1: parseFloat(m.amount1), // needs to be number
    }
  })

  return { data: [...mints, ...swaps, ...burns], error: false, loading: false }
}
