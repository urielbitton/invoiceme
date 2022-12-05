import React from 'react'
import {
  Legend, Pie, PieChart, Tooltip, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Bar, BarChart,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis,
  Radar
} from "recharts"
import './styles/AppChart.css'

const chartsAnimationDuration = 500

export function AppBarChart(props) {

  const { title, subtitle, data, barSize = 30, actions,
    barsList, xDataKey, className='', tooltipLabelFormat,
    tooltipFormat } = props

  const barsListRender = barsList?.map((bar, index) => {
    return <Bar
      key={index}
      dataKey={bar.dataKey}
      fill={bar.fill}
      animationDuration={chartsAnimationDuration}
      name={bar.legendLabel}
    />
  })

  return <div className={`app-chart app-bar-chart ${className}`}>
    <div className="title-bar">
      <h4>
        {title}
        {subtitle && <span>{subtitle}</span>}
      </h4>
      {actions}
    </div>
    <div className="chart-container">
      <ResponsiveContainer>
        <BarChart
          data={data}
          barSize={barSize}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Legend />
          <Tooltip
            labelFormatter={tooltipLabelFormat}
            formatter={tooltipFormat}
            />
          {barsListRender}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
}

export function AppAreaChart(props) {

  const { title, subtitle, actions, data, areas, xDataKey, xAxisStyles,
    yAxisStyles, tooltipLabelFormat, tooltipFormat, legendLabel,
    className='' } = props

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

  return <div className={`app-chart app-area-chart ${className}`}>
    <div className="title-bar">
      <h4>
        {title}
        {subtitle && <span>{subtitle}</span>}
      </h4>
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
          <Tooltip
            labelFormatter={tooltipLabelFormat}
            formatter={tooltipFormat}
            />
          {areasRender}
          <CartesianGrid strokeOpacity={0.3} />
          <Legend verticalAlign="top" align="right" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
}

export function AppPieChart(props) {

  const { title, subtitle, data, dataKey = "value", nameKey = "name",
    showLegend = true, actions, className='' } = props

  return (
    <div className={`app-chart app-pie-chart ${className}`}>
      <div className="title-bar">
        <h4>
          {title}
          {subtitle && <span>{subtitle}</span>}
        </h4>
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

  const { title, subtitle, data, fill, stroke, barLabel, radarDataKey,
    axisDataKey, actions, className='' } = props

  return <div className={`app-chart app-area-chart ${className}`}>
    <div className="title-bar">
      <h4>
        {title}
        {subtitle && <span>{subtitle}</span>}
      </h4>
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
