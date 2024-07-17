"use client"
import React, { useState } from 'react';
import { Container, Typography, Grid, Button, Box, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateUser } from '@/services/user.service';
import mensajes from '@/app/components/Mensajes';


export default function ProfileView() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const { user, token } = useAuth();


    const handleChangePassword = async () => {
        // Aquí iría la lógica para cambiar la contraseña
        // Puedes realizar validaciones aquí antes de enviar la solicitud al servidor
        console.log('Cambiando contraseña...');

        if (newPassword !== confirmPassword) {
            return mensajes("Error de validación", "Las constraseñas ingresadas no coinciden", "error");
        }

        try {
            await updateUser(user._id, { password: newPassword }, token);

            mensajes("Usuario actualizado exitosamente.", "Éxito");

            router.push("/users/me");
        } catch (error) {
            console.log(error?.response?.data || error.message);

            mensajes("Error al actualizar el usuario", error.response?.data?.customMessage || "No se ha podido actualizar el usuario", "error");
        }
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
