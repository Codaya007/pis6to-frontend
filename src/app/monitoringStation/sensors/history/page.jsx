"use client";
import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  Modal,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Datos mock para el ejemplo
const mockHistoricalData = [
  { id: 1, date: "2023-07-01", temperature: 25.5, humidity: 60, co2: 400 },
  { id: 2, date: "2023-07-02", temperature: 26.0, humidity: 58, co2: 410 },
  { id: 3, date: "2023-07-03", temperature: 24.8, humidity: 62, co2: 395 },
  { id: 4, date: "2023-07-04", temperature: 25.2, humidity: 59, co2: 405 },
  { id: 5, date: "2023-07-05", temperature: 26.5, humidity: 57, co2: 415 },
];

export default function HistoricalData() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Simulamos la carga de datos
    setData(mockHistoricalData);
  }, []);

  const handleViewDetails = (item) => {
    setSelectedData(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedData(null);
  };

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
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography component="h1" variant="h5">
              Datos Históricos
            </Typography>
          </Grid>
        </Grid>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
            <Line type="monotone" dataKey="co2" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Temperatura (°C)</TableCell>
                <TableCell>Humedad (%)</TableCell>
                <TableCell>Nivel de CO2 (ppm)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} onClick={() => handleViewDetails(item)} style={{cursor: 'pointer'}}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.temperature}°C</TableCell>
                  <TableCell>{item.humidity}%</TableCell>
                  <TableCell>{item.co2} ppm</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="data-modal-title"
        aria-describedby="data-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedData && (
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Detalles para {selectedData.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Temperatura: {selectedData.temperature}°C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Humedad: {selectedData.humidity}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nivel de CO2: {selectedData.co2} ppm
                </Typography>
              </CardContent>
            </Card>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal}>Cerrar</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}