"use client"
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Avatar, Box, Link, } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/navigation';

const fakeUserData = {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
    cedula: "123456789",
    occupation: "Ingeniero",
    area: "Tecnología",
    position: "Desarrollador Senior",
    institution: "Empresa XYZ",
    avatarUrl: "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png"
};

export default function ProfileView() {
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    const handleEdit = () => {
        // Redirigir a la página /edit
        router.push('/users/me/edit');
    };
    const handleChangePassword = () => {
        // Redirigir a la página /edit
        router.push('/users/me/update-password');
    };

    useEffect(() => {
        // Simulando una consulta a la base de datos para obtener el perfil del usuario
        const fetchUserProfile = async () => {
            try {
                const user = fakeUserData;
                // const user = await getUserProfileFromDatabase(); // Llama a tu función para obtener el perfil del usuario
                setUserData(user); // Actualiza el estado con los datos del usuario
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
                // Manejo de errores según sea necesario
            }
        };

        fetchUserProfile();
    }, []); // Ejecuta la consulta solo una vez al montar el componente

    if (!userData) {
        return <Typography>Cargando perfil...</Typography>; // Muestra un mensaje mientras se carga el perfil
    }

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Avatar del usuario */}
                <Avatar sx={{ width: 100, height: 100, mb: 2, overflow: 'visible' }}>
                    {userData.avatarUrl ? (
                        <img
                            src={userData.avatarUrl}
                            alt="Avatar del usuario"
                            style={{ width: '100%', height: 'auto', borderRadius: '50%' }}
                        />
                    ) : (
                        <LockOutlinedIcon />
                    )}
                </Avatar>
                <Typography component="h1" variant="h5">
                    Perfil de Usuario
                </Typography>
                <Box sx={{ mt: 3 }}>
                    {/* Información básica */}
                    <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 2 }}>
                        Información Básica
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1"><strong>Nombre:</strong> {userData.firstName}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1"><strong>Apellido:</strong> {userData.lastName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1"><strong>Correo electrónico:</strong> {userData.email}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1"><strong>Cédula:</strong> {userData.cedula}</Typography>
                        </Grid>
                    </Grid>

                    {/* Información académica */}
                    <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 2 }}>
                        Información Académica
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1"><strong>Ocupación:</strong> {userData.occupation}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1"><strong>Área:</strong> {userData.area}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1"><strong>Cargo:</strong> {userData.position}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1"><strong>Institución:</strong> {userData.institution}</Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                        {/* Botón para editar perfil */}
                        <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={handleEdit}>
                            Editar Perfil
                        </Button>
                        {/* Botón para cambiar contraseña */}
                        <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={handleChangePassword}>
                            Cambiar Contraseña
                        </Button>
                    </Box>


                </Box>
            </Box>
        </Container>
    );
}
