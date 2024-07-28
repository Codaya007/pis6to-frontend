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
  CardMedia,
} from "@mui/material";
import mensajes from "@/app/components/Mensajes";
import { createSensor } from "@/services/sensor.service";
import { useAuth } from "@/context/AuthContext";
import { createNode, getAllNodes } from "@/services/nodes.service";
import { useRouter } from "next/navigation";
import { getAllMonitoringStation } from "@/services/monitoring-station.service";
import { uploadImageToS3 } from "@/services/image.service";



export const handleFileChange = async (e, token) => {
  const files = Array.from(e.target.files);
  const MAX_IMG_SIZE_MB = 2;
  const maxSizeInBytes = MAX_IMG_SIZE_MB * 1024 * 1024;

  const uploadedImages = [];

  for (const file of files) {
      if (file.size > maxSizeInBytes) {
          toast.error(
              `El archivo ${file.name} es demasiado grande. El tamaño máximo permitido es de ${MAX_IMG_SIZE_MB} MB.`
          );
          continue; // Continúa con el siguiente archivo
      }

      try {
          const imageURL = await uploadImageToS3(file, token);
          uploadedImages.push(imageURL); // Agrega la URL de la imagen al array
      } catch (error) {
          toast.error(`Error al subir el archivo ${file.name}: ${error.message}`);
      }
  }
  console.log(uploadedImages);
  return uploadedImages; // Devuelve el array con las URLs de las imágenes
};


export default function SensorManagement() {
  const { token } = useAuth();
  const router = useRouter();
  const [monitoringStation, setMonitoringStation] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [node, setNode] = useState({
    name: "",
    location: "",
    code: "",
    photos: [],
    status: "Activo",
    monitoringStation: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    location: "",
    code: "",
    monitoringStation: "",
  });

  useEffect(() => {
    const fetchMonitoringStation = async () => {
        try {
            const { results } = await getAllMonitoringStation(token, 0, 10);
            setMonitoringStation(results);
        } catch (error) {
            console.error("Error fetching estacion de monitoreo", error);
            mensajes("Error al obtener las estaciones de monitoreo", error.response?.data?.customMessage || "No se pudo obtener las estacione de monitoreo", "error");
        } 
    }
    if (token) {
        fetchMonitoringStation();
    }

}, [token]);
  const validateFields = (node) => {
    const newErrors = {};
    newErrors.name = node.name ? "" : "El nombre del nodo es requerido";
    newErrors.location = node.location ? "" : "La ubicacion del nodo es requerida";
    newErrors.code = node.code ? "" : "El código del nodo es requerido";
    newErrors.monitoringStation = node.monitoringStation ? "" : "La estación de monitoreo es requerida";
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
    setNode((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos
    const newErrors = validateFields(node);
    setErrors(newErrors);

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      const errorMessages = Object.entries(newErrors)
        .filter(([field, error]) => error)
        .map(([field, error]) => `${error}`)
        .join("\n");

      mensajes(
        "Error al crear el nodo",
        errorMessages || "No se ha podido crear el nodo",
        "error"
      );
      return;
    }

    // Si no hay errores, procesar el formulario
    console.log('Sensor creado:', node);
    // Aquí puedes agregar la lógica para enviar el formulario al servidor

    try {
      await createNode(node, token);
      mensajes("Éxito", "Creación exitosa");
      router.push("/monitoringStation/node")
    } catch (error) {
      console.log('ERROR');
      console.log(error);
      mensajes("No se pudo crear el nodo", error?.response?.data?.customMessage || "No se ha podido crear el nodo", "error");
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">
          Crear un nuevo nodo
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4, width: "100%" }}>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
             <Grid item xs={12} sm={4}>
                <TextField
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  name="name"
                  id="name"
                  label="Nombre"
                  value={node.name}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!errors.location}
                  helperText={errors.location}
                  fullWidth
                  name="location"
                  id="location"
                  label="Localización"
                  value={node.location}
                />
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
                  label="Código"
                  value={node.code}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onBlur={handleBlur}
                  error={!!errors.photos}
                  fullWidth
                  id="photos"
                  type="file"
                  // value={detail.img.length}
                  inputProps={{ multiple: true }}
                                    // autoComplete="photos"
                  onChange={async (e) => {
                 // setDetail({ ...detail, });
                    const newImg = await handleFileChange(e, token);
                    console.log(newImg);
                    setNode((prevFormData) => ({
                      ...prevFormData,
                      photos: newImg,
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                  {node.photos.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      {node.photos.map((photo, index) => (
                        <CardMedia
                          key={index}
                          sx={{ height: 120, width: 150, borderRadius: 30, margin: '0 10px' }}
                          image={photo}
                          title={`Imagen ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Estación de monitoreo</InputLabel>
                    <Select
                      onBlur={handleBlur}
                      error={!!errors.monitoringStation}
                      labelId="monitoringStation"
                      name="monitoringStation"
                      id="monitoringStation"
                      label="Estación de monitoreo"
                      onChange={handleChange}
                    >
                      <MenuItem value={""}></MenuItem>
                      {monitoringStation.map( (monitoringStation, index) => (
                        <MenuItem value={monitoringStation._id}>{monitoringStation.name}</MenuItem>
                      ) )}
                  </Select>
                </FormControl>
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
                      label="Estado"
                      onChange={handleChange}
                      value={node.status}
                      defaultValue="Activo"
                    >
                    <MenuItem value={"Activo"}>Activo</MenuItem>
                    <MenuItem value={"Inactivo"}>Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Crear Nodo
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
