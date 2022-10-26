import { ThemeContext } from 'styled-components'
import { useContext } from 'react'

export default function useTheme() {
  // @ts-ignore
  return useContext(ThemeContext)
}
