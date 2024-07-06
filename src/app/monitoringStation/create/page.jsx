"use client";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MyLocationIcon from '@mui/icons-material/MyLocation';import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { areasDeTrabajo } from "@/constants";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function SignUp() {
    const [area, setArea] = useState('');
    const [errors, setErrors] = useState({
        name: "",
        reference: "",
        photos: "",
        nomenclature: "",
        cedula: "",
        occupation: "",
        area: "",
        position: "",
        institution: "",
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            name: data.get("name"),
            reference: data.get("reference"),
            photos: data.get("photos"),
            nomenclature: data.get("nomenclature")
            // Agregar más campos según sea necesario
        });

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
            case "photos":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    photos: value ? "" : "Las fotos son requeridas",
                }));
              break;      
            case "nomenclature":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    nomenclature: value ? "" : "La nomenclatura es requerida",
                }));
            break;

            // Agregar más validaciones según sea necesario para los demás campos
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
                <Typography component="h1" variant="h5">
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
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.photos}
                                helperText={errors.photos}
                                required
                                fullWidth
                                id="photos"
                                type="file"
                                label="Fotos"
                                name="photos"
                                autoComplete="photos"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.nomenclature}
                                helperText={errors.nomenclature}
                                required
                                fullWidth
                                name="nomenclature"
                                label="Nomenclatura"
                                type="text"
                                id="nomenclature"
                                autoComplete="nomenclature"
                            />
                        </Grid>
                    </Grid>

                    {/* Información académica */}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Crear
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
