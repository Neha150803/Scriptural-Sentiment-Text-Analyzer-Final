"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SentimentResult } from "@/app/page"
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

interface SentimentChartsProps {
  results: SentimentResult
}

export function SentimentCharts({ results }: SentimentChartsProps) {
  const mlProbData = [
    { name: "Positive", value: results.mlPrediction.probabilities.positive, fill: "hsl(142, 76%, 36%)" },
    { name: "Negative", value: results.mlPrediction.probabilities.negative, fill: "hsl(0, 84%, 60%)" },
    { name: "Neutral", value: results.mlPrediction.probabilities.neutral, fill: "hsl(217, 91%, 60%)" },
  ]

  const vaderData = [
    { name: "Positive", value: results.vaderAnalysis.positive, fill: "hsl(142, 76%, 36%)" },
    { name: "Negative", value: results.vaderAnalysis.negative, fill: "hsl(0, 84%, 60%)" },
    { name: "Neutral", value: results.vaderAnalysis.neutral, fill: "hsl(217, 91%, 60%)" },
  ]

  const comparisonData = [
    {
      model: "ML",
      positive: results.mlPrediction.probabilities.positive * 100,
      negative: results.mlPrediction.probabilities.negative * 100,
      neutral: results.mlPrediction.probabilities.neutral * 100,
    },
    {
      model: "VADER",
      positive: results.vaderAnalysis.positive * 100,
      negative: results.vaderAnalysis.negative * 100,
      neutral: results.vaderAnalysis.neutral * 100,
    },
  ]

  const confidenceData = [
    {
      name: "ML Confidence",
      value: results.mlPrediction.confidence * 100,
      fill: "hsl(217, 91%, 60%)",
    },
  ]

  const radarData = [
    {
      metric: "ML Positive",
      value: results.mlPrediction.probabilities.positive * 100,
    },
    {
      metric: "ML Negative",
      value: results.mlPrediction.probabilities.negative * 100,
    },
    {
      metric: "ML Neutral",
      value: results.mlPrediction.probabilities.neutral * 100,
    },
    {
      metric: "VADER Positive",
      value: results.vaderAnalysis.positive * 100,
    },
    {
      metric: "VADER Negative",
      value: results.vaderAnalysis.negative * 100,
    },
    {
      metric: "VADER Neutral",
      value: results.vaderAnalysis.neutral * 100,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>ML Prediction Distribution</CardTitle>
          <CardDescription>Probability distribution across sentiments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mlProbData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${(value * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mlProbData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>VADER Distribution</CardTitle>
          <CardDescription>Sentiment score breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vaderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${(value * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vaderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Comparison</CardTitle>
          <CardDescription>Side-by-side sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <XAxis dataKey="model" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="positive" fill="hsl(142, 76%, 36%)" name="Positive" />
              <Bar dataKey="negative" fill="hsl(0, 84%, 60%)" name="Negative" />
              <Bar dataKey="neutral" fill="hsl(217, 91%, 60%)" name="Neutral" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ML Confidence Level</CardTitle>
          <CardDescription>Model prediction confidence</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              barSize={30}
              data={confidenceData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={10} fill="hsl(217, 91%, 60%)" />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-3xl font-bold"
              >
                {confidenceData[0].value.toFixed(1)}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Comprehensive Sentiment Radar</CardTitle>
          <CardDescription>Multi-dimensional sentiment analysis comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="metric"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Radar
                name="Sentiment Scores"
                dataKey="value"
                stroke="hsl(217, 91%, 60%)"
                fill="hsl(217, 91%, 60%)"
                fillOpacity={0.3}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
