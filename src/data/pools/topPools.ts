import { useMemo } from 'react'
import { ApolloClient, NormalizedCacheObject, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useClients } from 'state/application/hooks'
import { notEmpty } from 'utils'
import { POOL_HIDE } from '../../constants'
import { TokensResponse, Pool } from '../../types'
import { TOP_TOKENS_GFX } from '../protocol/topTokens'

export const TOP_POOLS = gql`
  query topPools {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
    }
  }
`

interface TopPoolsResponse {
  pools: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export function useTopPoolAddresses(): {
  loading: boolean
  error: boolean
  addresses: string[] | undefined
} {
  const { dataClient } = useClients()
  const { loading, error, data } = useQuery<TopPoolsResponse>(TOP_POOLS, {
    client: dataClient,
    fetchPolicy: 'cache-first',
  })

  const formattedData = useMemo(() => {
    if (data) {
      return data.pools
        .map((p) => {
          if (POOL_HIDE.includes(p.id.toLocaleLowerCase())) {
            return undefined
          }
          return p.id
        })
        .filter(notEmpty)
    } else {
      return undefined
    }
  }, [data])

  return {
    loading: loading,
    error: Boolean(error),
    addresses: formattedData,
  }
}

// TODO: add GFX API call below

interface TopPoolsResponseGfx {
  pools: Pool[]
}

export const TOP_POOLS_GFX = gql`
  query Pools {
    pools {
      id
      feeTier
      token0 {
        id
        name
        symbol
      }
      token1 {
        id
        name
        symbol
      }
    }
  }
`

export async function fetchTopPools(client: ApolloClient<NormalizedCacheObject>): Promise<Pool[] | undefined> {
  try {
    const { data, error, loading } = await client.query<TopPoolsResponseGfx>({
      query: TOP_POOLS_GFX,
      fetchPolicy: 'cache-first',
    })

    console.log('gql response:', data)

    if (error || loading || !data) {
      return undefined
    }

    console.log('data.pools:', data.pools)

    return data.pools
  } catch {
    return undefined
  }
}
