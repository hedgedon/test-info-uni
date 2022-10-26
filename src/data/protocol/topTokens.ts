import { useMemo } from 'react'

import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

import { TokensResponse, Token } from 'types'

import { useClients } from 'state/application/hooks'

export const TOP_TOKENS_GFX = gql`
  query tokens {
    tokens(limit: 50) {
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

export async function fetchTopTokens(client: ApolloClient<NormalizedCacheObject>): Promise<Token[] | undefined> {
  try {
    const { data, error, loading } = await client.query<TokensResponse>({
      query: TOP_TOKENS_GFX,
      fetchPolicy: 'cache-first',
    })

    console.log('gql response:', data)

    if (error || loading || !data) {
      return undefined
    }

    return data.tokens
  } catch {
    return undefined
  }
}

interface TopTokensResponse {
  tokens: {
    id: string
  }[]
}

// Currently unused.
export function useTopTokenAddressesGfxTest(): {
  loading: boolean
  error: boolean
  addresses: string[] | undefined
} {
  const { gfxClient } = useClients()

  const { loading, error, data } = useQuery<TopTokensResponse>(TOP_TOKENS_GFX, { client: gfxClient })

  const formattedData = useMemo(() => {
    if (data) {
      return data.tokens.map((t) => t.id)
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
