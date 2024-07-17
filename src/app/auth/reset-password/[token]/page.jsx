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
import { useRouter, useParams } from "next/navigation";
import { recoveryPassword } from "@/services/auth.service";
import mensajes from "@/app/components/Mensajes";

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const { token } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const body = {
                token, password
            }

            console.log(token, password)

            // Lógica para enviar la solicitud al backend
            await recoveryPassword(token, body)

            mensajes("Exito", "Usuario actualizado exitosamente");
            router.push('/auth/login');
        } catch (error) {
            console.log(error?.response?.data || error.message);

            mensajes("Error", error.response?.data?.customMessage || "No se ha podido actualizar el usuario", "error");
        }
    };

    return (
        <Container component="main" maxWidth="md">
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
