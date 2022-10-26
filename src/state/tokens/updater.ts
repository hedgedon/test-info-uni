import { useAllTokenData, useUpdateTokenData, useAddTokenKeys, useUpdateTokenDatasTest } from './hooks'
import { useEffect, useMemo } from 'react'
import { useTopTokenAddresses } from '../../data/tokens/topTokens'
import { useFetchedTokenDatas } from 'data/tokens/tokenData'
import { useTopTokenAddressesGfxTest } from 'data/protocol/topTokens'

export default function Updater(): null {
  // updaters
  const updateTokenDatas = useUpdateTokenData()
  const addTokenKeys = useAddTokenKeys()

  const updateTokenDatasTest = useUpdateTokenDatasTest()

  console.log('updater: updateTokenDatasTest:', updateTokenDatasTest)

  // intitial data
  const allTokenData = useAllTokenData()
  const { loading, error, addresses } = useTopTokenAddresses()

  // testing with copy of gfx:
  // might be uncessary
  const { loading: l2, error: err2, addresses: addressesGfx } = useTopTokenAddressesGfxTest()
  console.log('loading addressesGfx::', addressesGfx)
  // useEffect(() => {
  //   if (addressesGfx && !err2 && !l2) {

  //   }
  // })

  // add top pools on first load
  useEffect(() => {
    if (addresses && !error && !loading) {
      addTokenKeys(addresses)
    }
  }, [addTokenKeys, addresses, error, loading])

  // detect for which addresses we havent loaded token data yet
  const unfetchedTokenAddresses = useMemo(() => {
    return Object.keys(allTokenData).reduce((accum: string[], key) => {
      const tokenData = allTokenData[key]
      if (!tokenData || !tokenData.data || !tokenData.lastUpdated) {
        accum.push(key)
      }
      return accum
    }, [])
  }, [allTokenData])

  // update unloaded pool entries with fetched data
  const {
    error: tokenDataError,
    loading: tokenDataLoading,
    data: tokenDatas,
  } = useFetchedTokenDatas(unfetchedTokenAddresses)

  useEffect(() => {
    if (tokenDatas && !tokenDataError && !tokenDataLoading) {
      updateTokenDatas(Object.values(tokenDatas))
    }
  }, [tokenDataError, tokenDataLoading, tokenDatas, updateTokenDatas])

  return null
}
