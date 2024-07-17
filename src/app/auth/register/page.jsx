"use client";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { areasDeTrabajo } from "@/constants";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import { createResearcher } from "@/services/researcher.service";
import mensajes from "@/app/components/Mensajes";

export default function SignUp() {
    const [area, setArea] = useState('');
    const [errors, setErrors] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        identificationCard: "",
        occupation: "",
        area: "",
        position: "",
        institution: "",
    });
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = {
            email: data.get("email"),
            password: data.get("password"),
            name: data.get("name"),
            lastname: data.get("lastname"),
            identificationCard: data.get("identificationCard"),
            occupation: data.get("occupation"),
            position: data.get("position"),
            institution: data.get("institution"),
            area,
            // Agregar más campos según sea necesario
        }

        // Enviamos datos a backend
        try {
            await createResearcher(body,)

            mensajes("Bienvenido usuario", "Se ha registrado exitosamente, ingrese con sus credenciales.");
            router.push("/auth/login");
        } catch (error) {
            console.log(error?.response?.data || error.message);

            mensajes("Error en inicio de sesion", error.response?.data?.customMessage || "No se ha podido iniciar sesión", "error");
        }
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
            case "lastname":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    lastname: value ? "" : "El apellido es requerido",
                }));
                break;
            case "email":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        ? ""
                        : "Correo electrónico inválido",
                }));
                break;
            case "password":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: value.length >= 8
                        ? ""
                        : "La contraseña debe tener al menos 8 caracteres",
                }));
                break;
            // Agregar más validaciones según sea necesario para los demás campos
            default:
                break;
        }
    };

    console.log({ area })

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
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registrar cuenta
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
                                error={!!errors.lastname}
                                helperText={errors.lastname}
                                required
                                fullWidth
                                id="lastname"
                                label="Apellido"
                                name="lastname"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                                fullWidth
                                id="email"
                                label="Correo electrónico"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.password}
                                helperText={errors.password}
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.identificationCard}
                                helperText={errors.identificationCard}
                                required
                                fullWidth
                                id="identificationCard"
                                label="Cédula"
                                name="identificationCard"
                            />
                        </Grid>
                    </Grid>

                    {/* Información académica */}
                    <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 2 }}>
                        Información Académica
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                fullWidth
                                id="occupation"
                                label="Ocupación"
                                name="occupation"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="area-label">Área</InputLabel>
                                <Select
                                    labelId="area-label"
                                    id="area"
                                    value={area}
                                    label="Área"
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        setArea(e.target.value);
                                    }}
                                >
                                    {areasDeTrabajo.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                fullWidth
                                id="position"
                                label="Cargo"
                                name="position"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                fullWidth
                                id="institution"
                                label="Institución"
                                name="institution"
                            />
                        </Grid>
                        {/* Agregar más campos según sea necesario para la información académica */}
                    </Grid>

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Registrarse
                    </Button>
                    <Grid item xs={12} sx={{ mt: 2 }} style={{ textAlign: "center", paddingBottom: "2rem" }}>
                        Ya tienes una cuenta? <span
                            style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => router.push("/auth/login")}
                        >
                            Iniciar sesión
                        </span>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
