import { ProtocolData } from './reducer'
import { createAction } from '@reduxjs/toolkit'
import { ChartDayData, Transaction, Token, Pool } from 'types'
import { SupportedNetwork } from 'constants/networks'

// protocol wide info
export const updateProtocolData = createAction<{
  protocolData: ProtocolData
  networkId: SupportedNetwork
}>('protocol/updateProtocolData')
export const updateChartData = createAction<{
  chartData: ChartDayData[]
  networkId: SupportedNetwork
}>('protocol/updateChartData')
export const updateTransactions = createAction<{
  transactions: Transaction[]
  networkId: SupportedNetwork
}>('protocol/updateTransactions')

// TODO: add gfx global
export const updateTransactionsGfx = createAction<{
  transactionsTest: Transaction[]
  networkId: SupportedNetwork
}>('protocol/updateTransactionsGfx')

export const updateTopTokensGfx = createAction<{
  topTokens: Token[]
  networkId: SupportedNetwork
}>('protocol/updateTopTokensGfx')

export const updateTopPoolsGfx = createAction<{
  topPools: Pool[]
  networkId: SupportedNetwork
}>('protocol/updateTopPoolsGfx')
