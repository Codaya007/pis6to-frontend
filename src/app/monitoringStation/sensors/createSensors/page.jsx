"use client";
import React, { useState } from "react";
import {
  CssBaseline,
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function SensorManagement() {
  const [sensors, setSensors] = useState([]);
  const [newSensor, setNewSensor] = useState({
    tipo: "",
    codigo: "",
    estado: "activo",
    modelo: "",
    fabricante: "",
  });
  const [editingSensor, setEditingSensor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingSensor, setViewingSensor] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSensor({ ...newSensor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSensors([...sensors, { ...newSensor, id: Date.now() }]);
    setNewSensor({
      tipo: "",
      codigo: "",
      estado: "activo",
      modelo: "",
      fabricante: "",
    });
  };

  const handleEdit = (sensor) => {
    setEditingSensor(sensor);
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSensor({ ...editingSensor, [name]: value });
  };

  const handleEditSubmit = () => {
    setSensors(sensors.map((s) => (s.id === editingSensor.id ? editingSensor : s)));
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    setSensors(
      sensors.map((sensor) =>
        sensor.id === id ? { ...sensor, estado: "inactivo" } : sensor
      )
    );
  };

  const handleView = (sensor) => {
    setViewingSensor(sensor);
    setIsViewModalOpen(true);
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">
          Gestión de Sensores
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4, width: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Crear Nuevo Sensor
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="tipo"
                  label="Tipo de Sensor"
                  value={newSensor.tipo}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="codigo"
                  label="Código"
                  value={newSensor.codigo}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="estado"
                  label="Estado"
                  value={newSensor.estado}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="modelo"
                  label="Modelo"
                  value={newSensor.modelo}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="fabricante"
                  label="Fabricante"
                  value={newSensor.fabricante}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Crear Sensor
            </Button>
          </form>
        </Paper>

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Fabricante</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell>{sensor.tipo}</TableCell>
                  <TableCell>{sensor.codigo}</TableCell>
                  <TableCell>{sensor.estado}</TableCell>
                  <TableCell>{sensor.modelo}</TableCell>
                  <TableCell>{sensor.fabricante}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleEdit(sensor)}>
                      Editar
                    </Button>
                    <Button color="secondary" onClick={() => handleDelete(sensor.id)}>
                      Dar de baja
                    </Button>
                    <Button color="info" onClick={() => handleView(sensor)}>
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Editar Sensor</Typography>
          <TextField
            fullWidth
            margin="normal"
            name="tipo"
            label="Tipo"
            value={editingSensor?.tipo || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="codigo"
            label="Código"
            value={editingSensor?.codigo || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="estado"
            label="Estado"
            value={editingSensor?.estado || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="modelo"
            label="Modelo"
            value={editingSensor?.modelo || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="fabricante"
            label="Fabricante"
            value={editingSensor?.fabricante || ""}
            onChange={handleEditInputChange}
          />
          <Button onClick={handleEditSubmit}>Guardar cambios</Button>
        </Box>
      </Modal>

      <Dialog open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <DialogTitle>Detalles del Sensor</DialogTitle>
        <DialogContent>
          <Typography>Tipo: {viewingSensor?.tipo}</Typography>
          <Typography>Código: {viewingSensor?.codigo}</Typography>
          <Typography>Estado: {viewingSensor?.estado}</Typography>
          <Typography>Modelo: {viewingSensor?.modelo}</Typography>
          <Typography>Fabricante: {viewingSensor?.fabricante}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}