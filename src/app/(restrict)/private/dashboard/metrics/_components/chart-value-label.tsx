import { formatCount, NO_DATA_MARK } from '../_data/metrics-view'

// Distância do topo da área do gráfico até a linha de rótulos
const LABEL_BASELINE = 12

type ChartValueLabelProps = {
  x?: string | number
  width?: string | number
  index?: number
}

// Rótulos numa linha fixa no alto do gráfico: colados na barra, o zero e o mês futuro sumiriam da leitura
export function buildChartValueLabel(values: (number | null)[]) {
  return function ChartValueLabel({ x = 0, width = 0, index = 0 }: ChartValueLabelProps) {
    const value = values[index]

    return (
      <text
        x={Number(x) + Number(width) / 2}
        y={LABEL_BASELINE}
        textAnchor="middle"
        className="fill-muted-foreground text-[11px] tabular-nums"
      >
        {value === null || value === undefined ? NO_DATA_MARK : formatCount(value)}
      </text>
    )
  }
}
