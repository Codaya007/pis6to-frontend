"use client";
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import CloudIcon from '@mui/icons-material/Cloud';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Datos mock para los nodos
const mockNodes = [
  {
    id: 1,
    name: "Nodo A",
    location: "Aula magna",
    temperature: 25.5,
    humidity: 60,
    co2: 400,
    lastUpdate: "2023-07-13T10:30:00",
  },
  {
    id: 2,
    name: "Nodo B",
    location: "Aula 425",
    temperature: 26.2,
    humidity: 58,
    co2: 420,
    lastUpdate: "2023-07-13T10:35:00",
  },
  {
    id: 3,
    name: "Nodo C",
    location: "Bar",
    temperature: 22.8,
    humidity: 45,
    co2: 380,
    lastUpdate: "2023-07-13T10:40:00",
  },
];

export default function Home() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    // Simulamos la carga de datos
    setNodes(mockNodes);
  }, []);

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Panel de Control de Monitoreo
        </Typography>
        <Grid container spacing={4}>
          {nodes.map((node) => (
            <Grid item xs={12} md={6} lg={4} key={node.id}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {node.name.charAt(0)}
                    </Avatar>
                  }
                  title={node.name}
                  subheader={
                    <Box display="flex" alignItems="center">
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {node.location}
                      </Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <ThermostatIcon color="error" />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {node.temperature}°C
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <OpacityIcon color="primary" />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {node.humidity}%
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <CloudIcon color="action" />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {node.co2} ppm
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Última actualización: {new Date(node.lastUpdate).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}