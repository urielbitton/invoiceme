import React from 'react'
import { Legend, Pie, PieChart, Tooltip, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Bar, BarChart,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis,
  Radar } from "recharts"
import './styles/AppChart.css'

const chartsAnimationDuration = 500

export function AppBarChart(props) {

  const { title, data, fill, barSize = 30, actions, legendLabel } = props

  return <div className="app-chart app-bar-chart">
    <div className="title-bar">
      <h4>{title}</h4>
      {actions}
    </div>
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
          <Bar 
            dataKey="value" 
            fill={fill} 
            animationDuration={chartsAnimationDuration} 
            name={legendLabel}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

}

export function AppAreaChart(props) {

  const { title, actions, data, areas, xDataKey, xAxisStyles,
    yAxisStyles, tooltipLabelFormat, tooltipFormat, legendLabel } = props

  const areasRender = areas?.map((area, index) => {
    return <Area
      key={index}
      dataKey={area.dataKey}
      stroke={area.stroke}
      fill={area.fill}
      type="natural"
      animationDuration={chartsAnimationDuration}
      name={legendLabel}
    />
  })

  return <div className="app-chart app-area-chart">
    <div className="title-bar">
      <h4>{title}</h4>
      {actions}
    </div>
    <div className="chart-container">
      <ResponsiveContainer>
        <AreaChart
          className="area-chart"
          data={data}
        >
          <XAxis
            dataKey={xDataKey}
            style={xAxisStyles}
          />
          <YAxis style={yAxisStyles} />
          {areasRender}
          <Tooltip
            labelFormatter={tooltipLabelFormat}
            formatter={tooltipFormat}
          />
          <CartesianGrid strokeOpacity={0.3}/>
          <Legend verticalAlign="top" align="right" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
}

export function AppPieChart(props) {

  const { title, data, dataKey = "value", nameKey = "name",
    showLegend = true, actions } = props

  return (
    <div className="app-chart app-pie-chart">
      <div className="title-bar">
        <h4>{title}</h4>
        {actions}
      </div>
      <div className="chart-container">
        <ResponsiveContainer>
          <PieChart className="pie-container">
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              paddingAngle={2}
              outerRadius={120}
              innerRadius={80}
              blendStroke
              animationDuration={chartsAnimationDuration}
            />
            <Tooltip />
            {showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function AppRadarChart(props) {

  const { title, data, fill, stroke, barLabel, radarDataKey,
    axisDataKey, actions } = props

  return <div className="app-chart app-area-chart">
    <div className="title-bar">
      <h4>{title}</h4>
      {actions}
    </div>
    <div className="chart-container">
      <ResponsiveContainer>
        <RadarChart
          outerRadius={90}
          data={data}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey={axisDataKey} />
          <Radar
            name={barLabel}
            dataKey={radarDataKey}
            fill={fill}
            stroke={stroke}
            fillOpacity={0.6}
            animationDuration={chartsAnimationDuration}
          />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </div>
}