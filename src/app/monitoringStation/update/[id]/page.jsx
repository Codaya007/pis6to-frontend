"use client";
import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MyLocationIcon from '@mui/icons-material/MyLocation'; import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { CardMedia, CircularProgress, FormControl, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMonitoringStationById, updateMonitoringStation } from "@/services/monitoring-station.service";
import mensajes from "@/app/components/Mensajes";
import { MapContainer, TileLayer } from "react-leaflet";
import MapWithDrawNodes from "@/app/components/MapWithDrawNodes";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/constants";
import { toast } from "react-toastify";
import { uploadImageToS3 } from "@/services/imageServices";


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
    const router = useRouter();
    const { id } = useParams();
    const { token } = useAuth();
    const [monitoringStation, setMonitoringStation] = useState({});
    const [loading, setLoading] = useState(true);
    const [imagenes, setImagenes] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        reference: "",
        address: "",
        photos: [],
        nomenclature: {
            campus: "",
            bloque: null,
            ambiente: null,
            subAmbiente: null,
            piso: null,
        },
        coordinate: [],
    });
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

    const markerRef = useRef();

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
                    photos: value ? "" : "El las fotos son requeridas",
                }));
                break;
            case "campus":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    campus: value ? undefined : "El campus es requerida",
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

    useEffect(() => {
        const fetchMonitoringStation = async () => {
            try {
                const { results: monitoringStation } = await getMonitoringStationById(token, id);
                console.log(monitoringStation);
                setMonitoringStation(monitoringStation);

                setFormData({
                    name: monitoringStation.name,
                    reference: monitoringStation.reference,
                    address: monitoringStation.address,
                    photos: monitoringStation.photos,
                    nomenclature: monitoringStation.nomenclature,
                    coordinate: monitoringStation.coordinate,
                });
            } catch (error) {
                console.error("Error fetching estacion de monitoreo", error);
                mensajes("Error al obtener estacion de monitoreo", error.response?.data?.customMessage || "No se pudo obtener la estacion de monitoreo", "error");
            } finally {
                setLoading(false);
            }
        }
          if (token) {
            fetchMonitoringStation();
          }

    }, [id, token]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if(name == "campus" ){
            setFormData((prevFormData) => ({
                ...prevFormData,
                nomenclature: {
                    ...prevFormData.nomenclature,
                    campus: value,
                },
            }));
        }
        if(name == "bloque" && value >= 1){
            setFormData((prevFormData) => ({
                ...prevFormData,
                nomenclature: {
                    ...prevFormData.nomenclature,
                    bloque: value,
                },
            }));
        }
        if(name == "piso" && value >= 1 ){
            setFormData((prevFormData) => ({
                ...prevFormData,
                nomenclature: {
                    ...prevFormData.nomenclature,
                    piso: value,
                },
            }));
        }
        if(name == "ambiente" && value >= 1 ){
            setFormData((prevFormData) => ({
                ...prevFormData,
                nomenclature: {
                    ...prevFormData.nomenclature,
                    ambiente: value,
                },
            }));
        }
        if(name == "subAmbiente" && value >= 1 ){
            setFormData((prevFormData) => ({
                ...prevFormData,
                nomenclature: {
                    ...prevFormData.nomenclature,
                    subAmbiente: value,
                },
            }));
        }
        if(name == "longitude" || name == "latitude" ){
            let lon;
            let lat;
            if( name == "longitude"){
                lon = parseFloat(value);
            }
            if(name == "latitude"){
                lat = parseFloat(value);
            }
            let coordinateNew = [lon, lat];
            setFormData((prevFormData) => ({
                ...prevFormData,
                coordinate: coordinateNew,
            }));
        }else{
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
            // alert(formData)
        }
        
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(token);
        // Validar todos los campos antes de enviar
        handleBlur({ target: { name: "name", value: formData.name } });
        handleBlur({ target: { name: "reference", value: formData.reference } });
        handleBlur({ target: { name: "address", value: formData.address } });
        handleBlur({ target: { name: "photos", value: formData.photos } });
        handleBlur({ target: { name: "campus", value: formData.nomenclature.campus } });
        handleBlur({ target: { name: "bloque", value: formData.nomenclature.bloque } });
        handleBlur({ target: { name: "ambiente", value: formData.nomenclature.ambiente } });
        handleBlur({ target: { name: "subAmbiente", value: formData.nomenclature.subAmbiente } });
        handleBlur({ target: { name: "piso", value: formData.nomenclature.piso } });
        handleBlur({ target: { name: "longitude", value: formData.coordinate[0] } });
        handleBlur({ target: { name: "latitude", value: formData.coordinate[1] } });
        console.log('FormData');
        console.log(formData);

        const errorMessages = Object.entries(errors)
            .filter(([field, error]) => error)
            .map(([field, error]) => `${error}`)
            .join("\n");

        // Imprimir todos los errores
        try {

        // Si hay errores, no enviar el formulario
        if (Object.values(errors).some((error) => error !== "")) {
            mensajes("Error al actualizar la estación de monitoreo", errorMessages || "No se ha podido actualizar la estación de monitoreo", "error");
            return;
        }
        console.log('TRUUUUUUU');
            console.log('Dentro de formData');
            console.log(formData);
            await updateMonitoringStation(id, formData, token);

            mensajes("Estación de monitoreo actualizada exitosamente.", "Éxito");
            router.push("/monitoringStation");
        } catch (error) {
            console.log(error?.response?.data || error.message);
            mensajes("Error al actualizar la estación de monitoreo", error.response?.data?.customMessage || "No se ha podido actualizar la estación de monitoreo", "error");
        }
    };    
    
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!monitoringStation) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Typography variant="h6">Estación de monitoreo no encontrado</Typography>
            </Box>
        );
    }

    const handleMarkerDrawn = (markerCoordinates) => {
        const coordinates = markerCoordinates.geometry.coordinates;
        // setMonitoringStation((prevState) => ({
        //   ...prevState,
        //   latitude: coordinates[1],
        //   longitude: coordinates[0],
        // }));
        setFormData((prevFormData) => ({
            ...prevFormData,
            coordinate: [coordinates[0], coordinates[1]]
            // latitude: coordinates[1],
            // longitude: coordinates[0],
        }));
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
                <Typography component="h1" variant="h5">
                    Actualizar estación de monitoreo
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                        {/* Información básica */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                autoComplete="given-name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Nombre"
                                value={formData.name}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.reference}
                                helperText={errors.reference}
                                required
                                fullWidth
                                id="reference"
                                label="Referecia"
                                value={formData.reference}
                                name="reference"
                                autoComplete="family-name"
                                
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.address}
                                helperText={errors.address}
                                required
                                fullWidth
                                id="address"
                                value={formData.address}
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
                                    const newImg = await handleFileChange(e);
                                    setImagenes(newImg);
                                    console.log(newImg);
                                    setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        photos: newImg,
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                            {formData.photos.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    {formData.photos.map((photo, index) => (
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
                                    helperText={errors.campus}
                                    labelId="campus"
                                    name="campus"
                                    id="campus"
                                    
                                    required
                                    value={formData.nomenclature.campus}
                                    label="Campus"
                                    onChange={(e) => {
                                        setFormData((prevFormData) => ({
                                            ...prevFormData,
                                            nomenclature: {
                                                ...prevFormData.nomenclature,
                                                campus: e.target.value,
                                            },
                                        }));
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
                                onChange={handleChange}
                                error={!!errors.bloque}
                                helperText={errors.bloque}
                                required
                                fullWidth
                                value={formData.nomenclature.bloque}
                                name="bloque"
                                label="Bloque"
                                min = "1"
                                type="number"
                                id="bloque"
                                autoComplete="bloque"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.piso}
                                helperText={errors.piso}
                                required
                                fullWidth
                                value={formData.nomenclature.piso}
                                name="piso"
                                label="Piso"
                                type="number"
                                id="piso"
                                min = "1"
                                autoComplete="piso"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.ambiente}
                                helperText={errors.ambiente}
                                required
                                fullWidth
                                value={formData.nomenclature.ambiente}
                                name="ambiente"
                                label="Ambiente"
                                type="number"
                                id="ambiente"
                                min="1"
                                autoComplete="ambiente"
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.subAmbiente}
                                helperText={errors.subAmbiente}
                                required
                                fullWidth
                                value={formData.nomenclature.subAmbiente}
                                name="subAmbiente"
                                label="Subambiente"
                                type="number"
                                id="subAmbiente"
                                min="1"
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
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.longitude}
                                onChange={handleChange}
                                helperText={errors.longitude}
                                autoComplete="given-name"
                                name="longitude"
                                required
                                disabled
                                fullWidth
                                id="longitude"
                                label="Longitud"
                                autoFocus
                                value = {formData.coordinate[0]}
                            />
                        </Grid>
                        <Grid item xs={4} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.latitude}
                                helperText={errors.latitude}
                                required
                                disabled 
                                fullWidth
                                id="latitude"
                                value={formData.coordinate[1]}
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

                        <MapWithDrawNodes
                        onMarkerDrawn={handleMarkerDrawn}
                        markerRef={markerRef}
                        latitude={formData.coordinate[1]}
                        longitude={formData.coordinate[0]}
                        />
                    </MapContainer>
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