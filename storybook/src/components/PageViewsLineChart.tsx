import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme } from "@mui/material/styles";
import ChartWrapper from "./ChartWrapper";

export default function PageViewsLineChart() {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.primary.dark,
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.primary.light,
  ];
  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Page views and downloads
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              1.5M
            </Typography>
            <Chip size="small" color="success" label="+12%" />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Page views and downloads for the last 6 months
          </Typography>
        </Stack>
        <ChartWrapper height={250}>
          <LineChart
            colors={colorPalette}
            xAxis={[
              {
                scaleType: "point",
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                height: 24,
              },
            ]}
            yAxis={[{ width: 50 }]}
            series={[
              {
                id: "page-views",
                label: "Page views",
                data: [2234, 3872, 2998, 4125, 3357, 2789, 2998],
                showMark: false,
              },
              {
                id: "downloads",
                label: "Downloads",
                data: [3098, 4215, 2384, 2101, 4752, 3593, 2384],
                showMark: false,
              },
              {
                id: "conversions",
                label: "Conversions",
                data: [4051, 2275, 3129, 4693, 3904, 2038, 2275],
                showMark: false,
              },
            ]}
            height={250}
            margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
            grid={{ horizontal: true }}
            hideLegend
          />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}
