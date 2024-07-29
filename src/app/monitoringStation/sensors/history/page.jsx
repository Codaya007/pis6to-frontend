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
<<<<<<< Updated upstream
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
=======
  Pagination,
  TextField,
  CircularProgress,
} from "@mui/material";
import { BACKEND_BASEURL } from "@/constants";
import { useAuth } from "@/context/AuthContext";
>>>>>>> Stashed changes

export default function HistoricalData() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
<<<<<<< Updated upstream

  useEffect(() => {
    fetchClimateData();
  }, []);
=======
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    if (searchDate) {
      handleDateSearch();
    } else {
      fetchClimateData();
    }
  }, [page]);
>>>>>>> Stashed changes

  const fetchClimateData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4006/climate-datas');
      const result = await response.json();
      setData(result.results || []);
<<<<<<< Updated upstream
=======
      setTotalCount(result.totalCount || 0);
      setTotalPages(Math.ceil(result.totalCount / limit));
      setSearchDate("");
>>>>>>> Stashed changes
    } catch (error) {
      console.error('Error fetching climate data:', error);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
=======
  const handleDateSearch = async () => {
    if (!searchDate) return;
    setLoading(true);
    try {
      const formattedDate = searchDate.split('T')[0];
      const skip = (page - 1) * limit;
      const response = await fetch(`http://localhost:4000/ms3/climate-data/data/${formattedDate}?skip=${skip}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error en la red');
      }

      const result = await response.json();
      setData(result.results || []);
      setTotalCount(result.totalCount || 0);
      setTotalPages(Math.ceil(result.totalCount / limit));
    } catch (error) {
      console.error('Error fetching climate data by date:', error);
    } finally {
      setLoading(false);
    }
  };

>>>>>>> Stashed changes
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
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Typography component="h1" variant="h5">
              Datos Históricos
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button variant="contained" onClick={handleDateSearch}>
              Buscar por Fecha
            </Button>
            <Button variant="outlined" onClick={fetchClimateData} sx={{ ml: 2 }}>
              Ver Todos
            </Button>
          </Grid>
        </Grid>

<<<<<<< Updated upstream
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
=======
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
                  {data.length > 0 ? (
                    data.map((item) => (
                      <TableRow key={item._id} onClick={() => handleViewDetails(item)} style={{ cursor: 'pointer' }}>
                        <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{item.temp}°C</TableCell>
                        <TableCell>{item.hum}%</TableCell>
                        <TableCell>{item.co2} ppm</TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No hay datos disponibles.
                      </TableCell>
                    </TableRow>
                  )}
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
          </>
        )}
>>>>>>> Stashed changes
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="data-modal-title"
        aria-describedby="data-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
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
                  Nivel de CO2: {selectedData.co2.toFixed(2)} ppm
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
<<<<<<< Updated upstream
=======
                {selectedData.node && (
                  <Typography variant="body2" color="text.secondary">
                    Nodo ID: {selectedData.node}
                  </Typography>
                )}
                {selectedData.monitoringStation && (
                  <Typography variant="body2" color="text.secondary">
                    Estación de Monitoreo ID: {selectedData.monitoringStation}
                  </Typography>
                )}
>>>>>>> Stashed changes
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