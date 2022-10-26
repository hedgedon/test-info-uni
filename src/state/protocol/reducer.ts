import { currentTimestamp } from './../../utils/index'
import {
  updateProtocolData,
  updateChartData,
  updateTransactions,
  updateTransactionsGfx,
  updateTopTokensGfx,
  updateTopPoolsGfx,
} from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { ChartDayData, Transaction, Token, Pool } from 'types'
import { SupportedNetwork } from 'constants/networks'

export interface ProtocolData {
  // volume
  volumeUSD: number
  volumeUSDChange: number

  // in range liquidity
  tvlUSD: number
  tvlUSDChange: number

  // fees
  feesUSD: number
  feeChange: number

  // transactions
  txCount: number
  txCountChange: number
}

export interface ProtocolState {
  [networkId: string]: {
    // timestamp for last updated fetch
    readonly lastUpdated: number | undefined
    // overview data
    readonly data: ProtocolData | undefined
    readonly chartData: ChartDayData[] | undefined
    readonly transactions: Transaction[] | undefined
    readonly transactionsTest: Transaction[] | undefined
    readonly topTokens: Token[] | undefined
    readonly topPools: Pool[] | undefined
  }
}

export const initialState: ProtocolState = {
  [SupportedNetwork.ETHEREUM]: {
    data: undefined,
    chartData: undefined,
    transactions: undefined,
    transactionsTest: undefined,
    topTokens: undefined,
    topPools: undefined,
    lastUpdated: undefined,
  },
  [SupportedNetwork.ARBITRUM]: {
    data: undefined,
    chartData: undefined,
    transactions: undefined,
    transactionsTest: undefined,
    topTokens: undefined,
    topPools: undefined,
    lastUpdated: undefined,
  },
  [SupportedNetwork.OPTIMISM]: {
    data: undefined,
    chartData: undefined,
    transactions: undefined,
    transactionsTest: undefined,
    topTokens: undefined,
    topPools: undefined,
    lastUpdated: undefined,
  },
  [SupportedNetwork.POLYGON]: {
    data: undefined,
    chartData: undefined,
    transactions: undefined,
    transactionsTest: undefined,
    topTokens: undefined,
    topPools: undefined,
    lastUpdated: undefined,
  },
  [SupportedNetwork.CELO]: {
    data: undefined,
    chartData: undefined,
    transactions: undefined,
    transactionsTest: undefined,
    topTokens: undefined,
    topPools: undefined,
    lastUpdated: undefined,
  },
}

// TODO: add test gfx global txs
export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateProtocolData, (state, { payload: { protocolData, networkId } }) => {
      state[networkId].data = protocolData
      // mark when last updated
      state[networkId].lastUpdated = currentTimestamp()
    })
    .addCase(updateChartData, (state, { payload: { chartData, networkId } }) => {
      state[networkId].chartData = chartData
    })
    .addCase(updateTransactions, (state, { payload: { transactions, networkId } }) => {
      state[networkId].transactions = transactions
    })
    .addCase(updateTransactionsGfx, (state, { payload: { transactionsTest, networkId } }) => {
      state[networkId].transactionsTest = transactionsTest
    })
    .addCase(updateTopTokensGfx, (state, { payload: { topTokens, networkId } }) => {
      state[networkId].topTokens = topTokens
    })
    .addCase(updateTopPoolsGfx, (state, { payload: { topPools, networkId } }) => {
      state[networkId].topPools = topPools
    })
)
