"use client"
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Avatar, Box, Link, } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ADMIN_ROLE_NAME } from '@/constants';

// const fakeUserData = {
//     name: "Juan",
//     lastname: "Pérez",
//     email: "juan@example.com",
//     identificationCard: "123456789",
//     occupation: "Ingeniero",
//     area: "Tecnología",
//     position: "Desarrollador Senior",
//     institution: "Empresa XYZ",
//     avatar: "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png"
// };

export default function ProfileView() {
    const router = useRouter();
    const { user } = useAuth();

    const handleEdit = () => {
        if (user.researcher) {
            router.push(`/researchers/update/${user.researcher._id}`);
        } else {
            router.push(`/users/admins/update/${user._id}`);
        }
    };

    const handleChangePassword = () => {
        // Redirigir a la página /edit
        router.push('/users/me/update-password');
    };

    if (!user) {
        return <Typography>Cargando perfil...</Typography>; // Muestra un mensaje mientras se carga el perfil
    }

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Avatar del usuario */}
                <Avatar sx={{ width: 100, height: 100, mb: 2, overflow: 'visible' }}>
                    {user.avatar ? (
                        <img
                            src={user.avatar}
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
                            <Typography variant="subtitle1"><strong>Nombre:</strong> {user.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1"><strong>Apellido:</strong> {user.lastname}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1"><strong>Correo electrónico:</strong> {user.email}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1"><strong>Cédula:</strong> {user.identificationCard}</Typography>
                        </Grid>
                    </Grid>

                    {/* Información académica */}
                    {user.researcher ?
                        <>
                            <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 2 }}>
                                Información Académica
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1"><strong>Ocupación:</strong> {user.researcher?.occupation}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1"><strong>Área:</strong> {user.researcher?.area}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1"><strong>Cargo:</strong> {user.researcher?.position}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1"><strong>Institución:</strong> {user.researcher?.institution}</Typography>
                                </Grid>
                            </Grid>
                        </> : <></>}

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
