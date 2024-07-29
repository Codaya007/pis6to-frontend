"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  CssBaseline,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import CloudIcon from '@mui/icons-material/Cloud';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import io from "socket.io-client";
import { CLIMATEDATA_SOCKET_URL, getClimateDataByNodes } from "@/services/climateData.service";
import mensajes from "./components/Mensajes";
import { getAllMonitoringStation } from "@/services/monitoring-station.service";

export default function Home() {
  const [nodes, setNodes] = useState([]);
  const [monitoringStations, setMonitoringStations] = useState([]);
  const [currentMonitoringStation, setCurrentMonitoringStation] = useState(null);
  const [latestData, setLatestData] = useState({ temp: null, hum: null, co2: null });
  const socketRef = useRef(null);

  const fetchData = async () => {
    try {
      const nodesData = await getClimateDataByNodes(currentMonitoringStation);
      setNodes(nodesData);
    } catch (error) {
      console.error(error);
      mensajes("Error", error.response?.data?.customMessage || "No se han podido obtener los nodos", "error");
    }
  };

  const fetchMonitoringStations = async () => {
    try {
      const { results } = await getAllMonitoringStation(null, 0, 100);
      setMonitoringStations(results);
    } catch (error) {
      console.error(error);
      mensajes("Error", error.response?.data?.customMessage || "No se han podido obtener las estaciones de monitoreo", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonitoringStation]);

  useEffect(() => {
    fetchMonitoringStations();
  }, []);

  const BASEURL = "http://localhost:4003"

  useEffect(() => {
    try {
      // socket = io(BASEURL, { transports: ['websocket'], });
      // const socket = io(CLIMATEDATA_SOCKET_URL, { transports: ['websocket'], });
      socketRef.current = io(BASEURL, {
        transports: ['websocket'],
        auth: {
          token: null
        }
      });

      socketRef.current.on("climateData", (data) => {
        setLatestData(data);

        if (currentMonitoringStation === data.monitoringStationId) {
          fetchData();
        }
      });

    } catch (error) {
      console.error(error)
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentMonitoringStation]);

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Typography component="h2" variant="h4" gutterBottom>
        Datos climáticos UNL
      </Typography>
      <Box mb={4}>
        <Typography component="h2" variant="h5" gutterBottom color="textSecondary">
          Últimos datos recibidos
        </Typography>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <ThermostatIcon color="error" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {latestData.temp}°C
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <OpacityIcon color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {latestData.hum}%
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <CloudIcon color="action" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {latestData.co2} ppm
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Última actualización: {new Date(latestData.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="monitoring-station-label">Estación de Monitoreo</InputLabel>
        <Select
          labelId="monitoring-station-label"
          value={currentMonitoringStation || ""}
          onChange={(e) => setCurrentMonitoringStation(e.target.value)}
          label="Estación de Monitoreo"
        >
          <MenuItem key="" value="">
            Todo
          </MenuItem>
          {monitoringStations.map((station) => (
            <MenuItem key={station._id} value={station._id}>
              {station.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography component="h2" variant="h5" gutterBottom color="textSecondary">
        Nodos de sensores
      </Typography>
      <Box>
        <Grid container spacing={4}>
          {nodes.map((node) => (
            <Grid item xs={12} md={6} lg={4} key={node._id}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {node.name.charAt(0)}
                    </Avatar>
                  }
                  title={`${node.name} (${node.code})`}
                  subheader={
                    <Box display="flex" alignItems="center">
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {node.location}
                      </Typography>
                    </Box>
                  }
                />
                {node.lastClimateData ? (
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Box display="flex" alignItems="center">
                        <ThermostatIcon color="error" />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {node.lastClimateData?.temp}°C
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <OpacityIcon color="primary" />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {node.lastClimateData?.hum}%
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <CloudIcon color="action" />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {node.lastClimateData?.co2} ppm
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Última actualización: {new Date(node.lastClimateData.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                ) : (
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      No se han enviado datos desde el nodo.
                    </Typography>
                  </CardContent>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
