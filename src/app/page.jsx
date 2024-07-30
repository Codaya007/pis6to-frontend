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
import { getAllClimateData, getClimateDataByNodes } from "@/services/climateData.service";
import mensajes from "./components/Mensajes";
import { getAllMonitoringStation } from "@/services/monitoring-station.service";
import { SOCKETS_BASEURL } from "@/constants";

const nullLastValue = { temp: null, hum: null, co2: null }

export default function Home() {
  const [nodes, setNodes] = useState([]);
  const [monitoringStations, setMonitoringStations] = useState([]);
  const [currentMonitoringStation, setCurrentMonitoringStation] = useState(null);
  const [currentStationName, setCurrentStationName] = useState("");
  const [latestData, setLatestData] = useState(nullLastValue);
  const [environmentState, setEnvironmentState] = useState(null);
  const socketRef = useRef(null);
  const socketRef2 = useRef(null);

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

  const fetchLastClimateData = async () => {
    try {
      const { results } = await getAllClimateData(
        0,
        1,
        currentMonitoringStation ? { monitoringStation: currentMonitoringStation } : {}
      );

      setLatestData(results[0] || nullLastValue);
    } catch (error) {
      console.error(error);
      mensajes("Error", error.response?.data?.customMessage || "No se han podido obtener las estaciones de monitoreo", "error");
    }
  };

  useEffect(() => {
    fetchData();
    fetchLastClimateData();
  }, [currentMonitoringStation]);

  useEffect(() => {
    fetchMonitoringStations();
  }, []);

  const CLIMATEDATA_SOCKET_URL = `${SOCKETS_BASEURL}:5000`
  const ALERTS_SOCKET_URL = `${SOCKETS_BASEURL}:5005`
  // const CLIMATEDATA_SOCKET_URL = `${BACKEND_BASEURL}:5000`;

  useEffect(() => {
    try {
      socketRef.current = io(CLIMATEDATA_SOCKET_URL, {
        transports: ['websocket'],
      });

      const chanelName = !currentMonitoringStation ? "climateData" : `climateDataMonitoringStation${currentMonitoringStation}`;

      // console.log({ chanelName, currentMonitoringStation, CLIMATEDATA_SOCKET_URL });

      socketRef.current.on(chanelName, (data) => {
        setLatestData(data);
      });

    } catch (error) {
      console.error(error)
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentMonitoringStation]);

  useEffect(() => {
    try {
      socketRef2.current = io(ALERTS_SOCKET_URL, {
        transports: ['websocket'],
      });

      const chanelName2 = `monitoringStationState${currentMonitoringStation}`;

      socketRef2.current.on(chanelName2, ({ status }) => {
        console.log("ESTADO RECIBIDO SOCKET: ", status)
        setEnvironmentState(status || "Malo");
      });

    } catch (error) {
      console.error(error)
    }

    return () => {
      socketRef2.current?.disconnect();
    };
  }, [currentMonitoringStation]);

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Typography component="h2" variant="h4" gutterBottom mt={4}>
        {currentStationName ? `Datos climáticos del ${currentStationName}` : `Datos climáticos UNL`}
      </Typography>
      {environmentState ?
        <Typography
          component="p" // Cambiar h2 a p para que no parezca título
          variant="h6" // Usar un variant menor que h5 para menos énfasis
          gutterBottom
          sx={{ color: '#3f51b5' }} // Azul medio de Material-UI
        >
          Estado ambiental actual: {environmentState}
        </Typography> : <></>}
      <Box mb={4}>
        <Typography component="h2" variant="h5" gutterBottom color="textSecondary">
          {/* Últimos datos de la estación */}
          {currentStationName ?
            `Últimos datos de la estación` : "Últimos datos"}
        </Typography>
        {latestData.createdAt ? <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <ThermostatIcon color="error" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {parseFloat(latestData.temp).toFixed(2)}°C
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <OpacityIcon color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {parseFloat(latestData.hum).toFixed(2)}%
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <CloudIcon color="action" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {parseFloat(latestData.co2).toFixed(2)} ppm
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Última actualización: {latestData.createdAt ? new Date(latestData.createdAt).toLocaleString() : "No se han enviado datos"}
            </Typography>
          </CardContent>
        </Card> :
          <Typography variant="body2" color="text.secondary">
            El nodo aún no ha registrado datos
          </Typography>
        }
      </Box>

      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="monitoring-station-label">Estación de Monitoreo</InputLabel>
        <Select
          labelId="monitoring-station-label"
          value={currentMonitoringStation || ""}
          onChange={(e) => {
            const selectedStationId = e.target.value;
            const selectedStation = monitoringStations.find(station => station._id === selectedStationId);
            setCurrentMonitoringStation(selectedStationId);
            setCurrentStationName(selectedStation ? selectedStation.name : "");
            if (global?.window !== undefined) {
              window?.localStorage?.setItem("monitoringStation", selectedStationId || "");
            }
            setEnvironmentState(selectedStation ? (selectedStation.environmentalState || "Saludable") : null);
          }}
          label="Estación de Monitoreooo"
        >
          <MenuItem key="" value="" name="">
            Todo
          </MenuItem>
          {monitoringStations.map((station) => (
            <MenuItem key={station._id} value={station._id} name={station.name}>
              {station.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      <Typography component="h2" variant="h5" gutterBottom color="textSecondary">
        {currentStationName ?
          `Nodos de sensores` : "Todos los nodos de sensores"}
      </Typography>
      <Box>
        <Grid container spacing={4}>
          {nodes.map((node) => (
            <Grid item xs={15} md={8} lg={6} key={node._id}>
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
                          {parseFloat(node.lastClimateData?.temp).toFixed(2)}°C
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <OpacityIcon color="primary" />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {parseFloat(node.lastClimateData?.hum).toFixed(2)}%
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <CloudIcon color="action" />
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {parseFloat(node.lastClimateData?.co2).toFixed(2)} ppm
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
      <br />
    </Container >
  );
}
