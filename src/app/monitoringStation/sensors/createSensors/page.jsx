"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  CssBaseline,
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import mensajes from "@/app/components/Mensajes";
import { createSensor } from "@/services/sensor.service";
import { useAuth } from "@/context/AuthContext";
import { getAllNodes } from "@/services/nodes.service";
import { useParams, useRouter } from "next/navigation";

export default function SensorManagement() {
  const { token } = useAuth();
  const [nodes, setNodes] = useState([]);
  const router = useRouter();

  const [newSensor, setNewSensor] = useState({
    type: "",
    node: "",
    code: "",
    status: "",
  });
  
  const [errors, setErrors] = useState({
    type: "",
    node: "",
    code: "",
    status: "",
  });
  useEffect(() => {
    const fetchNodes = async () => {
        try {
            const { data: data } = await getAllNodes(token, 0, 10);
            console.log(data);
            // const nodeNames = response.data.map(node => node.name);
            setNodes(data);
        } catch (error) {
            console.error("Error fetching nodos", error);
            mensajes("Error al obtener los nodos", error.response?.data?.customMessage || "No se pudo obtener los nodos", "error");
        } 
    }
    if (token) {
        fetchNodes();
    }

}, [token]);
  const validateFields = (sensor) => {
    const newErrors = {};
    newErrors.type = sensor.type ? "" : "El tipo de sensor es requerido";
    newErrors.node = sensor.node ? "" : "El nodo al que pertenece es requerido";
    newErrors.code = sensor.code ? "" : "El código del sensor es requerido";
    newErrors.status = sensor.status ? "" : "El estado del sensor es requerido";
    return newErrors;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `El campo ${name} es requerido`,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewSensor((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos
    const newErrors = validateFields(newSensor);
    setErrors(newErrors);

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      const errorMessages = Object.entries(newErrors)
        .filter(([field, error]) => error)
        .map(([field, error]) => `${error}`)
        .join("\n");

      mensajes(
        "Error al crear el sensor",
        errorMessages || "No se ha podido crear el sensor",
        "error"
      );
      return;
    }

    // Si no hay errores, procesar el formulario
    console.log('Sensor creado:', newSensor);
    // Aquí puedes agregar la lógica para enviar el formulario al servidor

    try {
      await createSensor(newSensor, token);
      mensajes("Éxito", "Creación exitosa");
      router.push("/monitoringStation/sensors")
    } catch (error) {
      console.log('ERROR');
      console.log(error);
      mensajes("No se pudo crear estacion de monitoreo", error?.response?.data?.customMessage || "No se ha podido crear el sensor", "error");
    }
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
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Tipo de sensor</InputLabel>
                    <Select
                      onBlur={handleBlur}
                      error={!!errors.type}
                      labelId="Tipo"
                      name="type"
                      id="type"
                      required
                      label="Tipo"
                      onChange={handleChange}
                    >
                    <MenuItem value={""}></MenuItem>
                    <MenuItem value={"Temperatura"}>Temperatura</MenuItem>
                    <MenuItem value={"Humedad"}>Humedad</MenuItem>
                    <MenuItem value={"CO2"}>CO2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                {/* <TextField
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!errors.node}
                  helperText={errors.node}
                  fullWidth
                  name="node"
                  id="node"
                  label="Nodo"
                  value={newSensor.node}
                /> */}
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Nodo</InputLabel>
                    <Select
                      onBlur={handleBlur}
                      error={!!errors.node}
                      labelId="Tipo"
                      name="node"
                      id="node"
                      required
                      label="Nodo"
                      onChange={handleChange}
                    >
                      <MenuItem value={""}></MenuItem>
                      {nodes.map( (nodo, index) => (
                        <MenuItem value={nodo._id}>{nodo.name}</MenuItem>
                      ) )}
                    {/* <MenuItem value={""}></MenuItem>
                    <MenuItem value={"Temperatura"}>Temperatura</MenuItem>
                    <MenuItem value={"Humedad"}>Humedad</MenuItem>
                    <MenuItem value={"CO2"}>CO2</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!errors.code}
                  helperText={errors.code}
                  fullWidth
                  name="code"
                  id="code"
                  label="Codigo"
                  value={newSensor.code}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                    <Select
                      onBlur={handleBlur}
                      error={!!errors.status}
                      // helpertext={errors.campus}
                      labelId="status"
                      name="status"
                      id="status"
                      required
                      label="Estado"
                      onChange={handleChange}
                    >
                    <MenuItem value={""}></MenuItem>
                    <MenuItem value={"Activo"}>Activo</MenuItem>
                    <MenuItem value={"Inactivo"}>Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Crear Sensor
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
