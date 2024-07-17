"use client";
import React, { useState, useEffect } from "react";
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
import { getUserById, updateUser } from "@/services/user.service";
import mensajes from "@/app/components/Mensajes";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";

export default function UpdateUser() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        identificationCard: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        lastname: "",
        email: "",
        identificationCard: "",
    });
    const { token } = useAuth();
    const router = useRouter();

    const fetchUserData = async () => {
        try {
            const { results: user } = await getUserById(token, id);

            setFormData({
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                identificationCard: user.identificationCard,
            });
        } catch (error) {
            console.error(error);

            mensajes("Error al obtener usuario", error.response?.data?.customMessage || "No se ha podido obtener el usuario", "error");
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [id, token]);

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
            case "identificationCard":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    identificationCard: value ? "" : "La cédula es requerida",
                }));
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar todos los campos antes de enviar
        handleBlur({ target: { name: "name", value: formData.name } });
        handleBlur({ target: { name: "lastname", value: formData.lastname } });
        handleBlur({ target: { name: "email", value: formData.email } });
        handleBlur({ target: { name: "identificationCard", value: formData.identificationCard } });

        // Si hay errores, no enviar el formulario
        if (Object.values(errors).some((error) => error !== "")) {
            return;
        }

        try {
            await updateUser(id, formData, token);

            mensajes("Usuario actualizado exitosamente.", "Éxito");
            router.push("/users/admins");
        } catch (error) {
            console.log(error?.response?.data || error.message);
            mensajes("Error al actualizar el usuario", error.response?.data?.customMessage || "No se ha podido actualizar el usuario", "error");
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
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Actualizar usuario
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
                                error={!!errors.lastname}
                                helperText={errors.lastname}
                                required
                                fullWidth
                                id="lastname"
                                label="Apellido"
                                name="lastname"
                                value={formData.lastname}
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
                                value={formData.email}
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.identificationCard}
                                helperText={errors.identificationCard}
                                required
                                fullWidth
                                id="identificationCard"
                                label="Cédula"
                                name="identificationCard"
                                value={formData.identificationCard}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Actualizar
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
