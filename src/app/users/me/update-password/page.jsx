"use client"
import React, { useState } from 'react';
import { Container, Typography, Grid, Button, Box, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';


export default function ProfileView() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();


    const handleChangePassword = () => {
        // Aquí iría la lógica para cambiar la contraseña
        // Puedes realizar validaciones aquí antes de enviar la solicitud al servidor
        console.log('Cambiando contraseña...');
    };


    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Actualizar contraseña
                </Typography>
                <Box>
                    {/* Cambiar contraseña */}
                    <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 2 }}>
                        Cambiar Contraseña
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="newPassword"
                                label="Nueva Contraseña"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="confirmPassword"
                                label="Confirmar Contraseña"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleChangePassword}>
                            Cambiar Contraseña
                        </Button>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
