interface AreaChartDataInput {
  data: { date: string; pac: number; sedex: number }[]
  timeRange: string
}

export function useAreaChartData({ data, timeRange }: AreaChartDataInput) {
  const filteredData = data.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 90
    
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return filteredData
}