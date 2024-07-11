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
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            // TODO: Agregar lógica para enviar la solicitud al backend
            const body = {
                token, password
            }

            const response = { ok: true };

            if (!response.ok) {
                throw new Error('Error al restablecer la contraseña');
            }

            console.log('Contraseña restablecida correctamente');
            router.push('/');
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al restablecer la contraseña');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Restablecer Contraseña
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="Nueva Contraseña"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                variant="outlined"
                                required
                                fullWidth
                                id="confirm-password"
                                label="Confirmar Nueva Contraseña"
                                type="password"
                                name="confirm-password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Restablecer Contraseña
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
