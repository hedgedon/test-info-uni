export interface Block {
  number: number
  timestamp: string
}

export enum VolumeWindow {
  daily,
  weekly,
  monthly,
}

export interface ChartDayData {
  date: number
  volumeUSD: number
  tvlUSD: number
}

export interface GenericChartEntry {
  time: string
  value: number
}

export enum TransactionType {
  SWAP,
  MINT,
  BURN,
}

export type Transaction = {
  type: TransactionType
  hash: string
  timestamp: string
  sender: string
  token0Symbol: string
  token1Symbol: string
  token0Address: string
  token1Address: string
  amountUSD: number
  amountToken0: number
  amountToken1: number
}

export type TransactionTest = {
  type: TransactionType
  hash: string
  timestamp: string
  sender: string
  token0Symbol: string
  token1Symbol: string
  token0Address: string
  token1Address: string
  amountUSD: number
  amountToken0: number
  amountToken1: number
}

/**
 * Formatted type for Candlestick charts
 */
export type PriceChartEntry = {
  time: number // unix timestamp
  open: number
  close: number
  high: number
  low: number
}

// TESTING GFX:::
export interface RootTest {
  data: PoolData
}

export interface PoolData {
  pool: Pool
}

export interface TransactionResponseData {
  transactions: TransactionData[]
}

export interface Pool {
  id: string
  feeTier: string
  token0: Token
  token1: Token
  createdAtTimestamp: string
  createdAtBlockNumber: string
  liquidity: string
  sqrtPrice: string
  tick: string
  mints: Mint[]
  swaps: Swap[]
  burns: Burn[]
}

export interface TransactionData {
  id: string
  blockNumber: string
  timestamp?: string
  mints: Mint[]
  burns: Burn[]
  swaps: Swap[]
}

export interface Mint {
  id: string
  timestamp: string
  owner: string
  sender: string
  origin: string
  amount: string
  amount0: string
  amount1: string
  amountUSD: any
  tickLower: string
  tickUpper: string
  logIndex: string
  transaction: TransactionData
  pool: Pool
  token0: Token
  token1: Token
}

export interface Swap {
  id: string
  timestamp: string
  amount0: string
  amount1: string
  amountUSD: string
  sender: string
  recipient: string
  origin: string
  sqrtPriceX96: string
  tick: string
  logIndex: string
  token0: Token
  token1: Token
  pool: Pool
  transaction: Transaction
}

export interface Burn {
  id: string
  timestamp: string
  owner: string
  origin: string
  amount: string
  amount0: string
  amount1: string
  amountUSD: any
  tickLower: string
  tickUpper: string
  logIndex: string
  token0: Token
  token1: Token
  pool: Pool
  transaction: Transaction
}

export interface Token {
  id: string
  symbol: string
  name: string
  decimals: string
  totalSupply: string
  poolCount: string
  // whitelistPools: string[]
  whitelistPools: WhitelistPool[]
}

export interface TokensResponse {
  tokens: Token[]
}

export interface WhitelistPool {
  id: string
  token0: Token
  token1: Token
}
