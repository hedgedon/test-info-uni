import { WhitelistPool } from './../../types/index'
import {
  useProtocolData,
  useProtocolChartData,
  useProtocolTransactions,
  useProtocolTransactionsGfx,
  useProtocolTopTokensGfx, useProtocolTopPools,
} from './hooks'
import { useEffect } from 'react'
import { useFetchProtocolData } from 'data/protocol/overview'
import { useFetchGlobalChartData } from 'data/protocol/chart'
import { fetchTopTransactions, fetchTopTransactionsGfx } from 'data/protocol/transactions'
import { fetchTopTokens } from 'data/protocol/topTokens'
import { useClients, useGfxClient } from 'state/application/hooks'
import {fetchTopPools} from "../../data/pools/topPools";
import {updateTopPoolsGfx} from "./actions";

export default function Updater(): null {
  // this calls the useProtocolTransactions()
  console.log('called updater.ts from state/protocol/updater.ts')

  // client for data fetching
  const { dataClient, gfxClient } = useClients()

  const [protocolData, updateProtocolData] = useProtocolData()
  const { data: fetchedProtocolData, error, loading } = useFetchProtocolData()

  const [chartData, updateChartData] = useProtocolChartData()
  const { data: fetchedChartData, error: chartError } = useFetchGlobalChartData()

  // we first call fetchTopTransactions() and then update
  const [transactions, updateTransactions] = useProtocolTransactions()

  const [transactionsGfx, updateTransactionsGfx] = useProtocolTransactionsGfx()

  const [topTokens, updateTopTokensGfx] = useProtocolTopTokensGfx()

  //TODO: add useProtocolTopPools - this handles our data mapping
  const [topPools, updateTopPoolsGfx] = useProtocolTopPools()

  // update overview data if available and not set
  useEffect(() => {
    if (protocolData === undefined && fetchedProtocolData && !loading && !error) {
      updateProtocolData(fetchedProtocolData)
    }
  }, [error, fetchedProtocolData, loading, protocolData, updateProtocolData])

  // update global chart data if available and not set
  useEffect(() => {
    if (chartData === undefined && fetchedChartData && !chartError) {
      updateChartData(fetchedChartData)
    }
  }, [chartData, chartError, fetchedChartData, updateChartData])

  // Fetches here
  useEffect(() => {
    async function fetch() {
      const data = await fetchTopTransactions(dataClient)
      if (data) {
        updateTransactions(data)
      }
    }
    if (!transactions) {
      fetch()
    }
  }, [transactions, updateTransactions, dataClient])

  useEffect(() => {
    async function fetch2() {
      const gfx = await fetchTopTransactionsGfx(gfxClient)
      if (gfx) {
        updateTransactionsGfx(gfx)
      }
    }
    if (!transactionsGfx) {
      fetch2()
    }
  }, [transactionsGfx, updateTransactionsGfx, gfxClient])

  // TODO: add updateTopTokensGfx
  useEffect(() => {
    async function fetch3() {
      console.log('called fetch3()')
      const topTokens = await fetchTopTokens(gfxClient)

      if (topTokens) {
        console.log('test exists:', topTokens[0].whitelistPools)
        updateTopTokensGfx(topTokens)
      }
    }

    if (!topTokens) {
      console.log('no topTokens..refetching')
      fetch3()
    }
  }, [topTokens, updateTopTokensGfx, gfxClient])

  // TODO: add fetchTopPools call here

  useEffect(() => {
   async function fetch() {
     const topPoolsgfx = await fetchTopPools(gfxClient)

     if (topPoolsgfx) {
       console.log("top pools gfx exists:", topPoolsgfx)
      updateTopPoolsGfx(topPoolsgfx)
     }
   }

   if (!topPools) {
     console.log('no topPools..refetching')
     fetch()
   }
  }, [topPools, updateTopPoolsGfx, gfxClient])

  return null
}
