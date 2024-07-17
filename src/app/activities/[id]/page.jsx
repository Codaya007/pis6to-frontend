"use client"
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Avatar, Box, Link, } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useParams, useRouter } from 'next/navigation';

// TODO: Completar los datos faltantes

const fakeActivityData = {
    id: 1,
    type: 'Tipo 1',
    model: 'Modelo 1',
    route: 'Ruta 1',
    body: 'body 1',
}

export default function SeeActivityDetail() {
    const [activityData, setActivityData] = useState(null);
    const router = useRouter();
    const { id } = useParams();

    const handleReturn = () => {
        // Redirigir a la página /edit
        router.push('/activities');
    };

    useEffect(() => {
        // Simulando una consulta a la base de datos para obtener el perfil del usuario
        const fetchUserProfile = async () => {
            try {
                const activity = fakeActivityData;
                // const user = await getUserProfileFromDatabase(); // Llama a tu función para obtener el perfil del usuario
                setActivityData(activity); // Actualiza el estado con los datos del usuario
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
                // Manejo de errores según sea necesario
            }
        };

        fetchUserProfile();
    }, []); // Ejecuta la consulta solo una vez al montar el componente

    if (!activityData) {
        return <Typography>Cargando activididad...</Typography>; // Muestra un mensaje mientras se carga el perfil
    }

    return (
        <Container component="main" maxWidth="xs" xs={8} sx={{marginTop: 2, paddingBottom:5, borderRadius:5, border: '4px solid black', alignItems: 'center' }}>
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Avatar del usuario */}
                <Avatar sx={{ width: 100, height: 100, mb: 2, overflow: 'visible' }}>
                        <img
                            src='https://static.vecteezy.com/system/resources/previews/026/630/523/non_2x/activity-icon-symbol-design-illustration-vector.jpg'
                            alt="Avatar de atividad"
                            style={{ width: '100%', height: 'auto', borderRadius: '50%' }}
                        />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Detalle de la actividad
                </Typography>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    {/* Información básica */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} >
                            <Typography variant="subtitle1"><strong>Tipo:</strong> {activityData.type}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Modelo:</strong> {activityData.model}</Typography>
                        </Grid>
                        <Grid item xs={12}  sm={12}>
                            <Typography variant="subtitle1"><strong>Ruta:</strong> {activityData.route}</Typography>
                        </Grid>
                        <Grid item xs={12}  sm={12}>
                            <Typography variant="subtitle1"><strong>Contenido:</strong> {activityData.body}</Typography>
                        </Grid>
                    </Grid>


                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        {/* Botón para editar perfil */}
                        <Button variant="contained" color="secondary" sx={{ mt: 1 }} onClick={handleReturn}>
                            Regresar
                        </Button>
                        {/* Botón para cambiar contraseña */}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
