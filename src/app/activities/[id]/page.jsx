"use client"
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Avatar, Box, } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { getSystemActivityById } from '@/services/systemActivity.service';
import { useAuth } from '@/context/AuthContext';
import mensajes from '@/app/components/Mensajes';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function SeeActivityDetail() {
    const [activityData, setActivityData] = useState(null);
    const router = useRouter();
    const { id } = useParams();
    const { token } = useAuth();

    const handleReturn = () => {
        // Redirigir a la página /edit
        router.push('/activities');
    };

    useEffect(() => {
        // Simulando una consulta a la base de datos para obtener el perfil del usuario
        const fetchActivity = async () => {
            try {
                const activity = await getSystemActivityById(token, id);

                setActivityData(activity); // Actualiza el estado con los datos del usuario
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
                // Manejo de errores según sea necesario
                mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener el detalle de la actividade", "error");
            }
        };
        if (token)
            fetchActivity();
    }, [token, id]);

    if (!activityData) {
        return <Typography>Cargando actividad...</Typography>; // Muestra un mensaje mientras se carga el perfil
    }

    return (
        <Container component="main" maxWidth="md" xs={8} sx={{ marginTop: 2, paddingBottom: 5, borderRadius: 5, border: '4px solid black', alignItems: 'center' }}>
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Avatar del usuario */}
                <Avatar sx={{ width: 100, height: 100, mb: 2, overflow: 'visible' }}>
                    {activityData.user.avatar ?
                        <img
                            src={activityData.user?.avatar || null}
                            alt="Usuario"
                            style={{ width: '100%', height: 'auto', borderRadius: '50%' }}
                        /> : <LockOutlinedIcon />}
                </Avatar>
                <Typography component="h1" variant="h5">
                    Detalle de la actividad
                </Typography>
                <Box sx={{ mt: 3 }}>
                    {/* Información básica */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} >
                            <Typography variant="subtitle1"><strong>Tipo:</strong> {activityData.type}</Typography>
                        </Grid>
                        {/* <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Modelo:</strong> {activityData.model}</Typography>
                        </Grid> */}
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Ruta:</strong> {activityData.route}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Contenido:</strong> {JSON.stringify(activityData.body)}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Typography component="h1" variant="h5">
                    Detalles usuario
                </Typography>
                <Box sx={{ mt: 3 }}>
                    {/* Información usuario */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} >
                            <Typography variant="subtitle1"><strong>Nombre:</strong> {activityData.user?.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Apellido:</strong> {activityData.user.lastname}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Email:</strong> {activityData.user?.email}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Cedula:</strong> {activityData.user.identificationCard}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Estatus:</strong> {activityData.user.state}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Rol:</strong> {activityData.user.role?.name}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    {/* Botón para editar perfil */}
                    <Button variant="contained" color="secondary" sx={{ mt: 1 }} onClick={handleReturn}>
                        Regresar
                    </Button>
                    {/* Botón para cambiar contraseña */}
                </Box>
            </Box>
        </Container>
    );
}
