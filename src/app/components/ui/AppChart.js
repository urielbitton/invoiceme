import React from 'react'
import {
  Legend, Pie, PieChart, Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  AreaChart,
  Area
} from "recharts"
import './styles/AppChart.css'

export function AppPieChart(props) {

  const { title, data } = props

  return (
    <div className="app-chart app-pie-chart">
      <h4>{title}</h4>
      <div className="chart-container">
        <ResponsiveContainer>
          <PieChart className="pie-container">
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              paddingAngle={2}
              outerRadius={120}
              innerRadius={80}
              blendStroke
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function AppBarChart(props) {

  const { title, data, fill, barSize = 30 } = props

  return <div className="app-chart app-bar-chart">
    <h4>{title}</h4>
    <div className="chart-container">
      <ResponsiveContainer>
        <BarChart
          data={data}
          barSize={barSize}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis dataKey="value" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={fill} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

}

export function AppAreaChart(props) {

  const { title, data, areas, xAxisDataKey, xAxisStyles,
    yAxisStyles, tooltipLabelFormat, tooltipFormat } = props

  const areasRender = areas?.map((area, index) => {
    return <Area
      key={index}
      dataKey={area.dataKey}
      stroke={area.stroke}
      fill={area.fill}
    />
  })

  return <div className="app-chart app-area-chart">
    <h4>{title}</h4>
    <div className="chart-container">
      <ResponsiveContainer>
        <AreaChart
          width={1030}
          // height={350}
          className="area-chart"
          data={data}
        >
          <XAxis
            dataKey={xAxisDataKey}
            style={xAxisStyles}
          />
          <YAxis style={yAxisStyles} />
          {areasRender}
          <Tooltip
            labelFormatter={tooltipLabelFormat}
            formatter={tooltipFormat}
          />
          <Legend verticalAlign="top" align="right"/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
}