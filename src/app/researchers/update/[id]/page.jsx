"use client";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useParams, useRouter } from "next/navigation";
import { getResearcherById, updateResearcher } from "@/services/researcher.service"; // Asegúrate de que esta ruta sea correcta
import { useAuth } from "@/context/AuthContext";
import mensajes from "@/app/components/Mensajes";

export default function ResearcherCard() {
    const { id } = useParams();
    const { token } = useAuth();
    const [researcher, setResearcher] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        identificationCard: "",
        occupation: "",
        area: "",
        position: "",
        institution: "",
    });

    useEffect(() => {
        const fetchResearcher = async () => {
            try {
                const { results } = await getResearcherById(token, id);
                setResearcher(results);
                // Inicializar el formData con los datos actuales del investigador
                setFormData({
                    name: results.user.name,
                    lastname: results.user.lastname,
                    email: results.user.email,
                    identificationCard: results.user.identificationCard,
                    occupation: results.occupation,
                    area: results.area,
                    position: results.position,
                    institution: results.institution,
                });
            } catch (error) {
                console.error("Error fetching researcher:", error);
                mensajes("Error al obtener investigador", error.response?.data?.customMessage || "No se pudo obtener el investigador", "error");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchResearcher();
        }
    }, [id, token]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleUpdateResearcher = async (event) => {
        event.preventDefault();
        try {
            // Lógica de actualización en el backend
            await updateResearcher(id, formData, token);
            mensajes("Investigador actualizado exitosamente", "Éxito");
            router.push("/users/me")
        } catch (error) {
            console.error("Error updating researcher:", error);
            mensajes("Error al actualizar investigador", error.response?.data?.customMessage || "No se pudo actualizar el investigador", "error");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!researcher) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Typography variant="h6">Investigador no encontrado</Typography>
            </Box>
        );
    }

    return (
        <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 3 }}>
                <Avatar
                    src={researcher.avatar}
                    alt={researcher.firstName}
                    sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h5">
                    {researcher.user.name} {researcher.user.lastname}
                </Typography>
            </Box>
            <CardContent>
                <form onSubmit={handleUpdateResearcher}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                id="name"
                                name="name"
                                label="Nombre"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                id="lastname"
                                name="lastname"
                                label="Apellido"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                id="email"
                                name="email"
                                label="Correo electrónico"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                id="identificationCard"
                                name="identificationCard"
                                label="Cédula"
                                value={formData.identificationCard}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="occupation"
                                name="occupation"
                                label="Ocupación"
                                value={formData.occupation}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="area"
                                name="area"
                                label="Área"
                                value={formData.area}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="position"
                                name="position"
                                label="Cargo"
                                value={formData.position}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="institution"
                                name="institution"
                                label="Institución"
                                value={formData.institution}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button type="submit" variant="contained">
                            Actualizar
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );
}
