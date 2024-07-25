"use client";
import dynamic from 'next/dynamic';
import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MyLocationIcon from '@mui/icons-material/MyLocation'; import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { areasDeTrabajo } from "@/constants";
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select } from "@mui/material";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../../../constants";
// import MapWithDrawNodes from "../../components/MapWithDrawNodes";
import { uploadImageToS3 } from "../../../services/image.service";
import { createMonitoringStation } from "@/services/monitoringStation.service";
import { toast } from "react-toastify";
import mensajes from "@/app/components/Mensajes";

// Dinamicamente importar MapContainer
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });


const monitoringStationInitialState = {
    name: "",
    latitude: DEFAULT_MAP_CENTER[0],
    longitude: DEFAULT_MAP_CENTER[1],
    address: null,
    photos: [],
    reference: "",
    campus: "",
    block: null,
    floor: null,
    enviroment: null,
    subEnviroment: null,
    status: true,
};
export const handleFileChange = async (e) => {
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
            const imageURL = await uploadImageToS3(file);
            uploadedImages.push(imageURL); // Agrega la URL de la imagen al array
        } catch (error) {
            toast.error(`Error al subir el archivo ${file.name}: ${error.message}`);
        }
    }
    console.log(uploadedImages);
    return uploadedImages; // Devuelve el array con las URLs de las imágenes
};

export default function CreateMonitoringStation() {
    const [area, setArea] = useState('');
    const [statusMonitoringStation, setStatusMonitoringStation] = useState("Activo");
    const [campus, setCampus] = useState('');
    const [imagenes, setImagenes] = useState([]);
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
        longitude: "",
        latitude: "",
    });
    const [monitoringStation, setMonitoringStation] = useState(monitoringStationInitialState);

    const markerRef = useRef();

    const handleMarkerDrawn = (markerCoordinates) => {
        const coordinates = markerCoordinates.geometry.coordinates;
        setMonitoringStation((prevState) => ({
            ...prevState,
            latitude: coordinates[1],
            longitude: coordinates[0],
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (errors.name != "") {
            return;
        }
        const data = new FormData(event.currentTarget);
        const dataToSend = {
            name: data.get("name"),
            address: data.get("address"),
            reference: data.get("reference"),
            photos: imagenes,
            coordinate: [parseFloat(data.get("longitude")), parseFloat(data.get("latitude"))],
            status: statusMonitoringStation,
            //Coodenadas
            nomenclature: {
                campus: campus,
                bloque: parseInt(data.get("block")),
                piso: parseInt(data.get("floor")),
                ambiente: parseInt(data.get("enviroment")),
                subAmbiente: parseInt(data.get("subEnviroment")),
            }
        };
        //   console.log('Data to send');
        //   console.log(dataToSend.coordinate);
        try {
            await createMonitoringStation(dataToSend);
            mensajes("Creacion exitosa");
        } catch (error) {
            console.log('ERROR');
            console.log(error?.response?.data || error.message);
            mensajes("No se pudo crear estacion de monitoreo", error.response?.data?.customMessage || "No se ha podido crear estacion de monitoreo", "error");
        }
        // Aquí puedes agregar lógica adicional, como enviar los datos al backend
    };

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
            default:
                break;
        }
    };

    return (
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
                <Typography component="h1" variant="h4">
                    Crear Estacion de monitoreo
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
                                value={monitoringStation.longitude}
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
                    <MapContainer
                        style={{ width: "100%", height: "60vh" }}
                        center={DEFAULT_MAP_CENTER}
                        zoom={DEFAULT_MAP_ZOOM}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* <MapWithDrawNodes
                            onMarkerDrawn={handleMarkerDrawn}
                            markerRef={markerRef}
                            latitude={monitoringStation.latitude}
                            longitude={monitoringStation.longitude}
                        /> */}
                    </MapContainer>
                    {/* <MapContainer
                        style={{ width: "100%", height: "60vh", marginTop: 20}}
                        center={DEFAULT_MAP_CENTER}
                        zoom={DEFAULT_MAP_ZOOM}
                        scrollWheelZoom={false}
                    >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapWithDrawNodes
                        onMarkerDrawn={handleMarkerDrawn}
                        markerRef={markerRef}
                        latitude={monitoringStation.latitude}
                        longitude={monitoringStation.longitude}
                    />
                </MapContainer> */}
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Habilitado"
                            onChange={(e) => {
                                let valor = e.target.checked == true ? "Activo" : "Inactivo"
                                console.log(valor);
                                setStatusMonitoringStation(valor)
                            }} />
                    </FormGroup>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Crear
                    </Button>

                </Box>
            </Box>
        </Container>
    );
}
