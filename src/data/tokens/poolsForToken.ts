import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import gql from 'graphql-tag'
import { TokensResponse, WhitelistPool } from 'types'

export const POOLS_FOR_TOKEN = gql`
  query topPools($address: Bytes!) {
    asToken0: pools(
      first: 200
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { token0: $address }
      subgraphError: allow
    ) {
      id
    }
    asToken1: pools(
      first: 200
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { token1: $address }
      subgraphError: allow
    ) {
      id
    }
  }
`

interface PoolsForTokenResponse {
  asToken0: {
    id: string
  }[]
  asToken1: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export async function fetchPoolsForToken(
  address: string,
  client: ApolloClient<NormalizedCacheObject>
): Promise<{
  loading: boolean
  error: boolean
  addresses: string[] | undefined
}> {
  try {
    // todo: change PoolsForTokenResponse to match struct of gfx endpoint
    const { loading, error, data } = await client.query<PoolsForTokenResponse>({
      query: POOLS_FOR_TOKEN,
      variables: {
        address: address,
      },
      fetchPolicy: 'cache-first',
    })

    if (loading || error || !data) {
      return {
        loading,
        error: Boolean(error),
        addresses: undefined,
      }
    }

    const formattedData = data.asToken0.concat(data.asToken1).map((p) => p.id)

    return {
      loading,
      error: Boolean(error),
      addresses: formattedData,
    }
  } catch {
    return {
      loading: false,
      error: true,
      addresses: undefined,
    }
  }
}

// TODO: call Tokens entity endpoint
export const POOLS_FOR_TOKEN_GFX = gql`
  query tokens($address: String!) {
    tokens(limit: 1, filter: { id: $address }) {
      id
      symbol
      name
      decimals
      totalSupply
      poolCount
      whitelistPools {
        id
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }
  }
`

export async function fetchPoolsForTokenGfx(
  address: string,
  client: ApolloClient<NormalizedCacheObject>
): Promise<{
  loading: boolean
  error: boolean
  addresses: string[] | undefined
}> {
  try {
    const { loading, error, data } = await client.query<TokensResponse>({
      query: POOLS_FOR_TOKEN_GFX,
      variables: {
        address: address,
      },
      fetchPolicy: 'cache-first',
    })

    if (loading || error || !data) {
      return {
        loading,
        error: Boolean(error),
        addresses: undefined,
      }
    }

    // from whitelist pools, map over it and return only the pool addy
    // our DB gives the raw addresses, so needs to be lowercased
    const formattedData = data.tokens.flatMap((s) => s.whitelistPools).map((x) => x.id.toLowerCase())
    console.log('formattedData:', formattedData)
    return {
      loading,
      error: Boolean(error),
      addresses: formattedData,
    }
  } catch {
    return {
      loading: false,
      error: true,
      addresses: undefined,
    }
  }
}
