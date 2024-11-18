import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, CardContent, Grid } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { BarChart } from "@mui/x-charts/BarChart";

const drawerWidth = 240;

export default function DashboardOverview() {
  const [openDropdown, setOpenDropdown] = useState({});

  const handleToggle = (itemText) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  return (
    <>
      <Box sx={{ display: "flex", marginLeft: "15%" }}>
        <Box
          component="main"
          sx={{ flexGrow: 1, padding: 5, marginRight: "10%" }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h4">Tổng quan</Typography>
          </Box>

          {/* Cards Grid */}
          <Grid container spacing={3}>
            {/* Revenue Card */}
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{ borderRadius: "5%", padding: "5px" }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ marginBottom: "5%" }}
                  >
                    <TimelineIcon fontSize="large" />
                    <Typography variant="subtitle1">Tổng doanh thu</Typography>
                  </Box>
                  <Typography variant="h4" component="div">
                    25.000.000đ
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography
                      color="success.main"
                      variant="body2"
                      sx={{ ml: 0.5 }}
                    >
                      15% increase vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Products Sold Card */}
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{ borderRadius: "5%", padding: "5px" }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ marginBottom: "5%" }}
                  >
                    <PointOfSaleIcon fontSize="large" />
                    <Typography variant="subtitle1">
                      Tổng sản phẩm bán
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div">
                    120 Sản Phẩm
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography color="error.main" variant="body2">
                      5% decrease vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Orders Card */}
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{ borderRadius: "5%", padding: "5px" }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ marginBottom: "5%" }}
                  >
                    <CreditScoreIcon fontSize="large" />
                    <Typography variant="subtitle1">Tổng đơn hàng</Typography>
                  </Box>
                  <Typography variant="h4" component="div">
                    49 Đơn
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography color="success.main" variant="body2">
                      12% increase vs last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <Card
                  variant="outlined"
                  sx={{ borderRadius: "5%", padding: "5px" }}
                >
                  <CardContent>
                    <Typography variant="h4">Doanh thu</Typography>
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: [
                            "Tháng 1",
                            "Tháng 2",
                            "Tháng 3",
                            "Tháng 4",
                            "Tháng 5",
                            "Tháng 6",
                            "Tháng 7",
                            "Tháng 8",
                            "Tháng 9",
                            "Tháng 10",
                            "Tháng 11",
                            "Tháng 12",
                          ],
                        },
                      ]}
                      series={[
                        {
                          data: [4, 5, 6, 7, 8, 3, 6, 4, 7, 5, 9, 2],
                        },
                      ]}
                      width={500}
                      height={300}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItem>
                    <ListItemText
                      primary="Đơn hàng 1"
                      secondary="Jan 9, 2014"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Đơn hàng 2"
                      secondary="Jan 7, 2014"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Đơn hàng 3"
                      secondary="July 20, 2014"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}
