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

export default function HistoricalData() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchClimateData();
  }, []);

  const fetchClimateData = async () => {
    try {
      const response = await fetch('http://localhost:4006/climate-datas');
      const result = await response.json();
      setData(result.results || []);
    } catch (error) {
      console.error('Error fetching climate data:', error);
    }
  };

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
            <XAxis dataKey="createdAt" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temp" name="Temperatura" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="hum" name="Humedad" stroke="#82ca9d" />
            <Line type="monotone" dataKey="co2" name="CO2" stroke="#ffc658" />
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
                <TableCell>Presión</TableCell>
                <TableCell>Calor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id} onClick={() => handleViewDetails(item)} style={{cursor: 'pointer'}}>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{item.temp}°C</TableCell>
                  <TableCell>{item.hum}%</TableCell>
                  <TableCell>{item.co2} ppm</TableCell>
                  <TableCell>{item.press}</TableCell>
                  <TableCell>{item.heat}</TableCell>
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
                  Detalles para {new Date(selectedData.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Temperatura: {selectedData.temp}°C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Humedad: {selectedData.hum}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nivel de CO2: {selectedData.co2} ppm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Presión: {selectedData.press}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calor: {selectedData.heat}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estado: {selectedData.status}
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