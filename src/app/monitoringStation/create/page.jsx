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
import { CardMedia, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select } from "@mui/material";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../../../constants";
// import MapWithDrawNodes from "../../components/MapWithDrawNodes";
import { uploadImageToS3 } from "../../../services/image.service";
import { createMonitoringStation } from "@/services/monitoringStation.service";
import { toast } from "react-toastify";
import mensajes from "@/app/components/Mensajes";
import MapWithDrawNodes from '@/app/components/MapWithDrawNodes';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Dinamicamente importar MapContainer
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });


const monitoringStationInitialState = {
    name: "",
    latitude: null,
    longitude: null,
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

export default function CreateMonitoringStation() {
    const [area, setArea] = useState('');
    const [statusMonitoringStation, setStatusMonitoringStation] = useState("Activo");
    const [campus, setCampus] = useState("");
    const [imagenes, setImagenes] = useState([]);
    const { token } = useAuth();
    const router = useRouter();
    const [errors, setErrors] = useState({
        name: "",
        reference: "",
        address: "",
        photos: "",
        campus: "",
        bloque: "",
        ambiente: "",
        subAmbiente: "",
        longitude: "",
        latitude: "",
        piso: "",
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
        const data = new FormData(event.currentTarget);
        handleBlur({ target: { name: "name", value: data.get("name") } });
        handleBlur({ target: { name: "reference", value: data.get("reference") } });
        handleBlur({ target: { name: "address", value: data.get("address") } });
        handleBlur({ target: { name: "campus", value: campus } });
        handleBlur({ target: { name: "bloque", value: data.get("bloque") } });
        handleBlur({ target: { name: "ambiente", value: data.get("ambiente") } });
        handleBlur({ target: { name: "subAmbiente", value: data.get("subAmbiente") } });
        handleBlur({ target: { name: "piso", value: data.get("piso") } });
        handleBlur({ target: { name: "longitude", value: monitoringStation.longitude } });
        handleBlur({ target: { name: "latitude", value: monitoringStation.latitude } });

        const errorMessages = Object.entries(errors)
            .filter(([field, error]) => error)
            .map(([field, error]) => `${error}`)
            .join("\n");

        if (Object.values(errors).some((error) => error !== "")) {
            mensajes("Error al crear la estación de monitoreo", errorMessages || "No se ha podido actualizar la estación de monitoreo", "error");
            return;
        }
        const dataToSend = {
            name: data.get("name"),
            address: data.get("address"),
            reference: data.get("reference"),
            photos: imagenes,
            coordinate: [parseFloat(monitoringStation.longitude), parseFloat(monitoringStation.latitude)],
            status: statusMonitoringStation,
            //Coodenadas
            nomenclature: {
                campus: campus,
                bloque: parseInt(data.get("bloque")),
                piso: parseInt(data.get("piso")),
                ambiente: parseInt(data.get("ambiente")),
                subAmbiente: parseInt(data.get("subAmbiente")),
            }
        };
        try {
            await createMonitoringStation(dataToSend, token);
            mensajes("Estación de monitoreo creada exitosamente.", "Éxito");
            router.push("/monitoringStation");
        } catch (error) {
            console.log(error?.response?.data || error.message);
            mensajes("No se pudo crear estacion de monitoreo", error.response?.data?.customMessage || "No se ha podido crear estacion de monitoreo", "error");
        }
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;
        console.log(name);
        console.log('valueeeee');
        console.log(value);
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
            case "campus":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    campus: campus ? "" : "El campus es requerida",
                }));
                break;
            case "bloque":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    bloque: value ? "" : "El bloque es requerido",
                }));
                break;
            case "piso":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    piso: value ? "" : "El piso es requerido",
                }));
                break;
            case "ambiente":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    ambiente: value ? "" : "El ambiente es requerido",
                }));
                break;
            case "subAmbiente":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    subAmbiente: value ? "" : "El subambiente es requerido",
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
                                // // helpertext={errors.name}
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
                                // helpertext={errors.reference}
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
                                // helpertext={errors.address}
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
                                required
                                fullWidth
                                id="photos"
                                type="file"
                                name='photos'
                                inputProps={{ multiple: true }}
                                onChange={async (e) => {
                                    const newImg = await handleFileChange(e, token);
                                    console.log(newImg);
                                    setImagenes(newImg);

                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                            {imagenes.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    {imagenes.map((photo, index) => (
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
                                    // helpertext={errors.campus}
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
                                    <MenuItem value={""}></MenuItem>
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
                                error={!!errors.bloque}
                                // helpertext={errors.bloque}
                                required
                                fullWidth
                                name="bloque"
                                label="Bloque"
                                type="number"
                                id="bloque"
                                autoComplete="bloque"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.piso}
                                // helpertext={errors.piso}
                                required
                                fullWidth
                                name="piso"
                                label="Piso"
                                type="number"
                                id="piso"
                                autoComplete="piso"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.ambiente}
                                // helpertext={errors.ambiente}
                                required
                                fullWidth
                                name="ambiente"
                                label="Ambiente"
                                type="number"
                                id="ambiente"
                                autoComplete="ambiente"
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.subAmbiente}
                                // helpertext={errors.subAmbiente}
                                fullWidth
                                name="subAmbiente"
                                label="Subambiente"
                                type="number"
                                id="subAmbiente"
                                autoComplete="subAmbiente"
                            />
                        </Grid>

                        <Grid item xs={9}>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component="h6" variant="h6">
                                Coordenadas
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.latitude}
                                // helpertext={errors.latitude}
                                required
                                fullWidth
                                disabled
                                id="latitude"
                                value={monitoringStation.latitude ? monitoringStation.latitude : "" }
                                label="Latitud"
                                name="latitude"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.longitude}
                                // helpertext={errors.longitude}
                                // onChange={ (e) =>  {
                                //     setMonitoringStation((prevState) => ({
                                //         ...prevState,
                                //         longitude: e.target.value,
                                //     }));
                                // }}
                                autoComplete="given-name"
                                name="longitude"
                                required
                                disabled
                                fullWidth
                                id="longitude"
                                label="Longitud"
                                autoFocus
                                value={monitoringStation.longitude ? monitoringStation.longitude :""}
                            />
                        </Grid>
                    </Grid>
                    <MapContainer
                        style={{ width: "100%", height: "60vh", marginTop: 20 }}
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
                    </MapContainer>

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
