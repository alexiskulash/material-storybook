import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
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
  const chartId = React.useId();
  const descriptionId = `${chartId}-description`;

  return (
    <Card variant="outlined" sx={{ width: "100%" }} role="region" aria-labelledby={chartId}>
      <CardContent>
        <Typography id={chartId} component="h2" variant="subtitle2" gutterBottom>
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
              1.3M
            </Typography>
            <Chip size="small" color="error" label="-8%" />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Page views and downloads for the last 6 months
          </Typography>
        </Stack>
        <Box
          id={descriptionId}
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Line chart showing page views, downloads, and conversions data from January to July.
          Page views range from 2,234 to 4,125. Downloads range from 2,101 to 4,752.
          Conversions range from 2,038 to 4,693. Total metrics show 1.3 million with an 8% decrease.
        </Box>
        <ChartWrapper height={250} sx={{ mt: 3 }}>
          <LineChart
            colors={colorPalette}
            aria-label="Line chart displaying page views, downloads, and conversions over time"
            aria-describedby={descriptionId}
            xAxis={[
              {
                scaleType: "band",
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
              },
            ]}
            series={[
              {
                id: "page-views",
                label: "Page views",
                data: [2234, 3872, 2998, 4125, 3357, 2789, 2998],
                curve: "natural",
                showMark: true,
              },
              {
                id: "downloads",
                label: "Downloads",
                data: [3098, 4215, 2384, 2101, 4752, 3593, 2384],
                curve: "natural",
                showMark: true,
              },
              {
                id: "conversions",
                label: "Conversions",
                data: [4051, 2275, 3129, 4693, 3904, 2038, 2275],
                curve: "natural",
                showMark: true,
              },
            ]}
            height={250}
            margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
            grid={{ horizontal: true }}
          />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}
