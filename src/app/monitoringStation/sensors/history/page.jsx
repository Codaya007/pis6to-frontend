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
  Pagination,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BACKEND_BASEURL } from "@/constants";

export default function HistoricalData() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10; // Número de elementos por página

  useEffect(() => {
    fetchClimateData();
  }, [page]);

  useEffect(() => {
    fetchClimateDataAll();
  }, []);

  const fetchClimateData = async () => {
    try {
      const skip = (page - 1) * limit;
      const response = await fetch(`${BACKEND_BASEURL}/ms3/climate-datas?skip=${skip}&limit=${limit}`);
      const result = await response.json();
      setData(result.results || []);
      setTotalCount(result.totalCount || 0);
      setTotalPages(Math.ceil(result.totalCount / limit));
    } catch (error) {
      console.error('Error fetching climate data:', error);
    }
  };

  const fetchClimateDataAll = async () => {
    try {
      const skip = (page - 1) * limit;
      const response = await fetch(`${BACKEND_BASEURL}/ms3/climate-datas?skip=${skip}&limit=200`);
      const result = await response.json();

      setAllData(result.results || []);
    } catch (error) {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
            data={allData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdAt" tickFormatter={(timeStr) => new Date(timeStr).toLocaleDateString()} />
            <YAxis />
            <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
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
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id} onClick={() => handleViewDetails(item)} style={{ cursor: 'pointer' }}>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{item.temp}°C</TableCell>
                  <TableCell>{item.hum}%</TableCell>
                  <TableCell>{item.co2} ppm</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          Total de registros: {totalCount}
        </Typography>
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
                  Estado: {selectedData.status}
                </Typography>
                {selectedData.node && (
                  <Typography variant="body2" color="text.secondary">
                    Nodo: {selectedData.node}
                  </Typography>
                )}
                {selectedData.monitoringStation && (
                  <Typography variant="body2" color="text.secondary">
                    Estación de Monitoreo: {selectedData.monitoringStation}
                  </Typography>
                )}
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