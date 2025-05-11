import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import { useAnalyzeBuilding, useGetBuildings } from "../api/building";
import { BuildingInput } from "../types";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Dashboard() {
  const [building, setBuilding] = useState<BuildingInput | null>(null);
  const { mutateAsync, data, isPending } = useAnalyzeBuilding();
  const { data: allBuildings = [] } = useGetBuildings();

  useEffect(() => {
    const stored = localStorage.getItem("buildingForm");
    if (stored) {
      const parsed = JSON.parse(stored);
      setBuilding(parsed);
      mutateAsync(parsed).catch((error) => {
        console.error("Error analyzing building:", error);
      });
    }
  }, [mutateAsync]);

  if (isPending || !data || !building)
    return <Typography>Loading analysis...</Typography>;

  // Default radiation values if not provided
  const radiation = data.radiation || {
    north: 0,
    south: 0,
    east: 0,
    west: 0,
  };

  console.log("Radiation data:", {
    receivedRadiation: data.radiation,
    defaultRadiation: radiation,
  });

  const chartData = [
    {
      name: "Cooling Load (kWh)",
      value: Number(data.analyzedData.coolingLoad),
      displayValue: data.analyzedData.coolingLoad.toFixed(2),
    },
    {
      name: "Energy Used (kWh)",
      value: Number(data.analyzedData.energyConsumed),
      displayValue: data.analyzedData.energyConsumed.toFixed(2),
    },
    {
      name: "Cost (₹)",
      value: Number(data.analyzedData.cost),
      displayValue: data.analyzedData.cost.toFixed(2),
    },
  ];

  const comparisonData = Array.isArray(allBuildings)
    ? allBuildings.map((b: any) => ({
        name: b.name,
        cost: b.analysis?.cost || 0,
        energy: b.analysis?.energyConsumed || 0,
        coolingLoad: b.analysis?.coolingLoad || 0,
      }))
    : [];

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 4 }}>
      <Typography variant="h4">Analysis Dashboard</Typography>
      <Typography variant="h6">Building: {building.name}</Typography>
      <Typography variant="subtitle1">City: {building.city}</Typography>
      <Typography variant="subtitle1">
        Total Heat Gain (BTU):{" "}
        {Number(data.analyzedData.totalHeatGain).toFixed(2)}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Heat Gain Per Facade</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Orientation</TableCell>
              <TableCell>Height</TableCell>
              <TableCell>Width</TableCell>
              <TableCell>WWR</TableCell>
              <TableCell>Heat Gain (BTU)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {building.facades.map((f, i) => {
              const area = f.height * f.width * f.wwr;
              console.log("Facade orientation:", f.orientation);
              const facadeRadiation = radiation[f.orientation] || 0;
              const gain = area * building.shgc * facadeRadiation * 5; // 5 = deltaT
              console.log("Heat gain calculation:", {
                area,
                shgc: building.shgc,
                facadeRadiation,
                deltaT: 5,
                gain,
              });
              return (
                <TableRow key={i}>
                  <TableCell>{f.orientation}</TableCell>
                  <TableCell>{f.height}</TableCell>
                  <TableCell>{f.width}</TableCell>
                  <TableCell>{f.wwr}</TableCell>
                  <TableCell>
                    {(Number(data.analyzedData.totalHeatGain) / 4).toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Energy Cost Breakdown</Typography>
      <Paper sx={{ p: 2, backgroundColor: "#fafafa", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              label={({ name, percent }) =>
                `${name.split(" ")[0]}: ${(percent * 100).toFixed(1)}%`
              }
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
