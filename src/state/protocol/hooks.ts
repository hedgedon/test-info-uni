import {
    updateProtocolData,
    updateChartData,
    updateTransactions,
    updateTransactionsGfx,
    updateTopTokensGfx, updateTopPoolsGfx,
} from './actions'
import { AppState, AppDispatch } from './../index'
import { ProtocolData } from './reducer'
// import { PoolData, Pool } from '../pools/reducer'
import { PoolData } from '../pools/reducer'
import { Pool } from "types"
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChartDayData, Transaction, TransactionTest, Token } from 'types'
import { useActiveNetworkVersion, useClients } from 'state/application/hooks'
import { TokenData } from 'state/tokens/reducer'

export function useProtocolData(): [ProtocolData | undefined, (protocolData: ProtocolData) => void] {
  const [activeNetwork] = useActiveNetworkVersion()
  const protocolData: ProtocolData | undefined = useSelector(
    (state: AppState) => state.protocol[activeNetwork.id]?.data
  )

  const dispatch = useDispatch<AppDispatch>()
  const setProtocolData: (protocolData: ProtocolData) => void = useCallback(
    (protocolData: ProtocolData) => dispatch(updateProtocolData({ protocolData, networkId: activeNetwork.id })),
    [activeNetwork.id, dispatch]
  )
  return [protocolData, setProtocolData]
}

export function useProtocolChartData(): [ChartDayData[] | undefined, (chartData: ChartDayData[]) => void] {
  const [activeNetwork] = useActiveNetworkVersion()
  const chartData: ChartDayData[] | undefined = useSelector(
    (state: AppState) => state.protocol[activeNetwork.id]?.chartData
  )

  const dispatch = useDispatch<AppDispatch>()
  const setChartData: (chartData: ChartDayData[]) => void = useCallback(
    (chartData: ChartDayData[]) => dispatch(updateChartData({ chartData, networkId: activeNetwork.id })),
    [activeNetwork.id, dispatch]
  )
  return [chartData, setChartData]
}

// home page executes this function
export function useProtocolTransactions(): [Transaction[] | undefined, (transactions: Transaction[]) => void] {
  const [activeNetwork] = useActiveNetworkVersion()
  const transactions: Transaction[] | undefined = useSelector(
    (state: AppState) => state.protocol[activeNetwork.id]?.transactions
  )
  const dispatch = useDispatch<AppDispatch>()
  const setTransactions: (transactions: Transaction[]) => void = useCallback(
    (transactions: Transaction[]) => dispatch(updateTransactions({ transactions, networkId: activeNetwork.id })),
    [activeNetwork.id, dispatch]
  )
  return [transactions, setTransactions]
}

//TODO: add gfx protocol transactions
export function useProtocolTransactionsGfx(): [Transaction[] | undefined, (transactionsTest: Transaction[]) => void] {
  const [activeNetwork] = useActiveNetworkVersion()
  const transactions: Transaction[] | undefined = useSelector(
    (state: AppState) => state.protocol[activeNetwork.id]?.transactionsTest // asdf
  )
  const dispatch = useDispatch<AppDispatch>()
  const setTransactions: (transactionsTest: Transaction[]) => void = useCallback(
    (transactionsTest: Transaction[]) =>
      dispatch(
        updateTransactionsGfx({
          transactionsTest,
          networkId: activeNetwork.id,
        })
      ),
    [activeNetwork.id, dispatch]
  )
  console.log('called useProtocolTransactionsGfx() dispatch')
  return [transactions, setTransactions]
}

// TODO: rename
// refactor similarly to data/tokens/topTokens..
export function useProtocolTopTokensGfx(): [TokenData[] | undefined, (topTokens: Token[]) => void] {
  const [activeNetwork] = useActiveNetworkVersion()
  const topTokens: Token[] | undefined = useSelector((state: AppState) => state.protocol[activeNetwork.id]?.topTokens)
  const dispatch = useDispatch<AppDispatch>()
  const setTopTokens: (topTokens: Token[]) => void = useCallback(
    (topTokens: Token[]) =>
      dispatch(
        updateTopTokensGfx({
          topTokens,
          networkId: activeNetwork.id,
        })
      ),
    [activeNetwork.id, dispatch]
  )

  const topTokensData = topTokens?.map(
    (s): TokenData =>
      ({
        exists: true,
        name: s.name,
        symbol: s.symbol,
        address: s.id,
        volumeUSD: 0,
        volumeUSDChange: 0,
        volumeUSDWeek: 0,
        txCount: 0,
        feesUSD: 0,
        tvlToken: 0,
        tvlUSD: 0,
        tvlUSDChange: 0,
        priceUSD: 69,
        priceUSDChange: 0,
        priceUSDChangeWeek: 0,
      } as TokenData)
  )

  return [topTokensData, setTopTokens]
}

export function useProtocolTopPools(): [PoolData[] | undefined, (topPools: Pool[]) => void] {
    const [activeNetwork] = useActiveNetworkVersion()
    const topPools: Pool[] | undefined = useSelector((state: AppState) => state.protocol[activeNetwork.id]?.topPools)
    const dispatch = useDispatch<AppDispatch>()

    const setTopPools: (topPools: Pool[]) => void = useCallback(
        (topPools: Pool[]) =>
            dispatch(
                updateTopPoolsGfx({
                    topPools,
                    networkId: activeNetwork.id,
                })
            ), [activeNetwork.id, dispatch])

    //we need to map our data, to match the PoolData[] from pools/reducer.ts

    const topPoolsData = topPools?.map((s) => ({
        address: s.id,
        feeTier: parseInt(s.feeTier),
        token0: {
            name: s.token0.name,
            symbol: s.token0.symbol,
            address: s.token0.id,
            decimals: parseInt(s.token0.decimals),
            derivedETH: 0
        },
        token1: {
            name: s.token1.name,
            symbol: s.token1.symbol,
            address: s.token1.id,
            decimals: parseInt(s.token1.decimals),
            derivedETH: 0
        },
        liquidity: 0,
        sqrtPrice: 0,
        tick: 0,
        volumeUSD: 0,
        volumeUSDWeek: 0,
        volumeUSDChange: 0,
        tvlUSD: 0,
        tvlUSDChange: 0,
        token0Price: 0,
        token1Price: 0,
        tvlToken0: 0,
        tvlToken1: 0
    } as PoolData)
    )

    return [topPoolsData, setTopPools]
}