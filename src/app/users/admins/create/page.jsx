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
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        cedula: "",
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        cedula: "",
    });
    const router = useRouter();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;

        // Validación básica de campos requeridos
        switch (name) {
            case "firstName":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    firstName: value ? "" : "El nombre es requerido",
                }));
                break;
            case "lastName":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    lastName: value ? "" : "El apellido es requerido",
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
            case "cedula":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    cedula: value ? "" : "La cédula es requerida",
                }));
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Validar todos los campos antes de enviar
        handleBlur({ target: { name: "firstName", value: formData.firstName } });
        handleBlur({ target: { name: "lastName", value: formData.lastName } });
        handleBlur({ target: { name: "email", value: formData.email } });
        handleBlur({ target: { name: "cedula", value: formData.cedula } });

        // Si hay errores, no enviar el formulario
        if (Object.values(errors).some((error) => error !== "")) {
            return;
        }

        console.log(formData);

        // TODO: Enviar los datos al backend

        router.push("/users/admins");
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
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registrar usuario administrador
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {/* Información básica */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="Nombre"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                required
                                fullWidth
                                id="lastName"
                                label="Apellido"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
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
                                onChange={handleChange}
                                error={!!errors.cedula}
                                helperText={errors.cedula}
                                required
                                fullWidth
                                id="cedula"
                                label="Cédula"
                                name="cedula"
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Crear
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
