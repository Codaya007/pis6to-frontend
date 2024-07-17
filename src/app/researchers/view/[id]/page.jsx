"use client";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "next/navigation";
import { getResearcherById } from "@/services/researcher.service"; // Asegúrate de que esta ruta sea correcta
import { useAuth } from "@/context/AuthContext";
import mensajes from "@/app/components/Mensajes";

export default function ResearcherCard() {
    const { id } = useParams();
    const [researcher, setResearcher] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchResearcher = async () => {
            try {
                const { results } = await getResearcherById(token, id);

                setResearcher(results);
            } catch (error) {
                console.error("Error fetching researcher:", error);

                mensajes("Error al obtener usuario", error.response?.data?.customMessage || "No se ha podido obtener el usuario", "error");
            } finally {
                setLoading(false);
            }
        };
        if (token)
            fetchResearcher();
    }, [id, token]);

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
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Estado:</strong> {researcher.user.state}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Rol:</strong> {researcher.user.role?.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Correo electrónico:</strong> {researcher.user.email}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Cédula:</strong> {researcher.user.identificationCard}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Ocupación:</strong> {researcher.occupation}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Área:</strong> {researcher.area}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Cargo:</strong> {researcher.position}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Institución:</strong> {researcher.institution}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
