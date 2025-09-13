// types/recharts.d.ts
import * as Recharts from "recharts"

// Extend Recharts types to be more specific
export type RechartsPayload<T = any> = {
  dataKey?: string
  name?: string
  value?: T
  color?: string
  fill?: string
  payload?: Record<string, any>
}

export type RechartsLegendPayload = {
  value: string
  type: "line" | "square" | "circle" | "rect"
  id?: string
  color?: string
}

export type RechartsTooltipPayload<T = any> = RechartsPayload<T>[]

export type ChartConfigKey = string

export interface ChartConfigItem {
  label?: React.ReactNode
  icon?: React.ComponentType
  color?: string
  theme?: Record<"light" | "dark", string>
}

export type ChartConfig = Record<ChartConfigKey, ChartConfigItem>

// We'll use this to safely extract item configs
export type RechartsItem = {
  dataKey?: string
  name?: string
  value?: unknown
  color?: string
  payload?: Record<string, unknown>
}