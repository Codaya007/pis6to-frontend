"use client";
import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MyLocationIcon from '@mui/icons-material/MyLocation'; import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMonitoringStationById, updateMonitoringStation } from "@/services/monitoring-station.service";
import mensajes from "@/app/components/Mensajes";


export default function CreateMonitoringStation() {
    const router = useRouter();
    const [area, setArea] = useState('');
    const { id } = useParams();
    const { token } = useAuth();
    const [monitoringStation, setMonitoringStation] = useState({});



    const [formData, setFormData] = useState({
        name: "",
        reference: "",
        address: "",
        photos: "",
        campus: "",
        block: "",
        enviroment: "",
        subEnviroment: "",
        floor: "",
        longitude: "",
        latitude: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        reference: "",
        address: "",
        photos: "",
        campus: "",
        block: "",
        enviroment: "",
        subEnviroment: "",
        longitude: "",
        latitude: "",
        floor: "",
    });

    const handleStation = async (data) => {
        try {
            // await updateStation(id, data, token);
            mensajes("Exito", "Mota actualizada exitosamente");
            router.push("/monitoringStation");
        } catch (error) {
            console.log(error?.response?.data || error);
            mensajes("Error", error.response?.data?.customMessage || "No se ha podido actualizar la mota", "error");
        }
    }

    const handleBlur = (event) => {
        const { name, value } = event.target;

        // Validación básica de campos requeridos
        switch (name) {
            case "name":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: value ? "" : "El nombre es requerido",
                }));
                break;
            case "reference":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    reference: value ? "" : "La referencia es requerida",
                }));
                break;

            case "address":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    address: value ? "" : "La direccion es requerida",
                }));
                break;
            case "photos":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    photos: value ? "" : "Las fotos son requeridas",
                }));
                break;      
            case "campus":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    campus: value ? undefined : "El campus es requerida",
                }));
                break;
            case "block":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    block: value ? "" : "El bloque es requerido",
                }));
                break;
            case "floor":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    floor: value ? "" : "El piso es requerido",
                }));
                break;
            case "enviroment":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    enviroment: value ? "" : "El ambiente es requerido",
                }));
                break;
            case "subEnviroment":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    subEnviroment: value ? "" : "El subambiente es requerido",
                }));
                break;
            case "longitude":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    longitude: value ? "" : "La longitud es requerida",
                }));
                break;
            case "latitude":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    latitude: value ? "" : "La latitud es requerida",
                }));
                break

            // Agregar más validaciones según sea necesario para los demás campos
            default:
                break;
        }
    };

    const fetchMonitoringStation = async () => {
        try {
            const { results: monitoringStation } = await getMonitoringStationById(token, id);

            setFormData({
                name: monitoringStation.name,
                reference: monitoringStation.reference,
                address: monitoringStation.address,
                photos: monitoringStation.photos,
                campus: monitoringStation.campus,
                block: monitoringStation.block,
                enviroment: monitoringStation.enviroment,
                subEnviroment: monitoringStation.subEnviroment,
                longitude: monitoringStation.longitude,
                latitude: monitoringStation.latitude,
                floor: monitoringStation.floor,
                longitude: monitoringStation.longitude,
            });
        } catch (error) {
            console.error(error);
            mensajes("Error al obtener la estación de monitoreo", error.response?.data?.customMessage || "No se ha podido obtener la estación de monitoreo", "error");
        }
    }
    useEffect(() => {
          if (token) {
            fetchMonitoringStation();
          }

    }, [id, token]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(token);
        // Validar todos los campos antes de enviar
        handleBlur({ target: { name: "name", value: formData.name } });
        handleBlur({ target: { name: "reference", value: formData.reference } });
        handleBlur({ target: { name: "address", value: formData.address } });
        handleBlur({ target: { name: "photos", value: formData.photos } });
        handleBlur({ target: { name: "campus", value: formData.campus } });
        handleBlur({ target: { name: "block", value: formData.block } });
        handleBlur({ target: { name: "enviroment", value: formData.enviroment } });
        handleBlur({ target: { name: "subEnviroment", value: formData.subEnviroment } });
        handleBlur({ target: { name: "floor", value: formData.floor } });
        handleBlur({ target: { name: "longitude", value: formData.longitude } });
        handleBlur({ target: { name: "latitude", value: formData.latitude } });

        // Si hay errores, no enviar el formulario
        if (Object.values(errors).some((error) => error !== "")) {
            return;
        }

        try {
            await updateMonitoringStation(id, formData, token);

            mensajes("Estación de monitoreo actualizada exitosamente.", "Éxito");
            router.push("/monitoringStation");
        } catch (error) {
            console.log(error?.response?.data || error.message);
            mensajes("Error al actualizar la estación de monitoreo", error.response?.data?.customMessage || "No se ha podido actualizar la estación de monitoreo", "error");
        }
    };    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}

            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <MyLocationIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Actualizar estación de monitoreo
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                        {/* Información básica */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.name}
                                helperText={errors.name}
                                autoComplete="given-name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Nombre"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.reference}
                                helperText={errors.reference}
                                required
                                fullWidth
                                id="reference"
                                label="Referecia"
                                name="reference"
                                autoComplete="family-name"
                                
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.address}
                                helperText={errors.address}
                                required
                                fullWidth
                                id="address"
                                label="Direccion"
                                name="address"
                                autoComplete="family-name"
                                
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.photos}
                                helperText={errors.photos}
                                required
                                fullWidth
                                id="photos"
                                type="file"
                                // value={detail.img.length}
                                inputProps={{ multiple: true }}
                                // autoComplete="photos"
                                onChange={async (e) => {
                                    // setDetail({ ...detail, });
                                    const newImg = await handleFileChange(e);
                                    console.log(newImg);
                                    // setDetail({ ...detail, [..img, newImg] });
                                    setImagenes(newImg);
                                    // setDetail((prevDetail) => ({
                                    //     ...prevDetail,
                                    //     img: [...prevDetail.img, newImg], // Agrega las nuevas imágenes al array existente
                                    //   }));
                                }}
                            />
                        </Grid>
                    
                        <Grid item xs={12}>
                            <Typography component="h6" variant="h6">
                                Nomenclatura
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Campus</InputLabel>
                                <Select
                                    onBlur={handleBlur}
                                    error={!!errors.campus}
                                    helperText={errors.campus}
                                    labelId="campus"
                                    name="campus"
                                    id="campus"
                                    required
                                    // value={age}
                                    label="Campus"
                                    onChange={(e) => {
                                        setCampus(e.target.value);
                                        console.log(e.target.value);
                                    }}
                                >
                                    <MenuItem value={"Argelia"}>Argelia</MenuItem>
                                    <MenuItem value={"Motupe"}>Motupe</MenuItem>
                                    <MenuItem value={"Facultad de la Salud Humana"}>Facultad de la Salud Humana</MenuItem>
                                    <MenuItem value={"Nueva Loja"}>Nueva Loja</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.block}
                                helperText={errors.block}
                                required
                                fullWidth
                                name="block"
                                label="Bloque"
                                type="number"
                                id="block"
                                autoComplete="block"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.floor}
                                helperText={errors.floor}
                                required
                                fullWidth
                                name="floor"
                                label="Piso"
                                type="number"
                                id="floor"
                                autoComplete="floor"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.enviroment}
                                helperText={errors.enviroment}
                                required
                                fullWidth
                                name="enviroment"
                                label="Ambiente"
                                type="number"
                                id="enviroment"
                                autoComplete="enviroment"
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.subEnviroment}
                                helperText={errors.subEnviroment}
                                required
                                fullWidth
                                name="subEnviroment"
                                label="Subambiente"
                                type="number"
                                id="subEnviroment"
                                autoComplete="subEnviroment"
                            />
                        </Grid>

                        <Grid item xs={9}>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component="h6" variant="h6">
                                Coordenadas
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.longitude}
                                helperText={errors.longitude}
                                autoComplete="given-name"
                                name="longitude"
                                required
                                fullWidth
                                id="longitude"
                                label="Longitud"
                                autoFocus
                                value = {monitoringStation.longitude}
                            />
                        </Grid>
                        <Grid item xs={4} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.latitude}
                                helperText={errors.latitude}
                                required
                                fullWidth
                                id="latitude"
                                value={monitoringStation.latitude}
                                label="Latitud"
                                name="latitude"
                                autoComplete="family-name"
                            />
                        </Grid>
                    </Grid>

                    {/* Información académica */}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Actualizar
                    </Button>

                    {/* <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2,backgroundColor: 'rgba(255, 165, 0, 0.8)', // Naranja opaco
                '&:hover': {
                    backgroundColor: 'rgba(255, 140, 0, 0.8)', // Un poco más oscuro al hacer hover
                } }}>
                        Cancelar
                    </Button> */}

                </Box>
            </Box>
        </Container>
    );
}
