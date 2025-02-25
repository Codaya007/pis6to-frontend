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
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/auth.service";
import mensajes from "@/app/components/Mensajes";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Aquí puedes agregar lógica para enviar un correo de recuperación de contraseña
        console.log('Enviando correo de recuperación a:', email);

        // Implementación backend
        try {
            await forgotPassword({ email });

            mensajes("Exito", "Si ha ingresado sus datos correctamente, se enviará un email para recuperación de contraseña");

            // Luego rediriges a una página de confirmación o a la página de inicio de sesión
            router.push('/auth/login');
        } catch (error) {
            console.log(error?.response?.data || error.message);

            mensajes("Error", error.response?.data?.customMessage || "No se ha podido enviar el email de recuperación", "error");
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
                    Recuperar Contraseña
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Correo Electrónico"
                                name="email"
                                autoComplete="email"
                                inputProps={{
                                    style: { width: '100%' } // Asegura que el campo tome el 100% del ancho disponible
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Enviar Correo de Recuperación
                    </Button>
                    <Grid item xs={12} sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                        <span
                            style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => router.push("/auth/login")}
                        >
                            Volver al inicio de sesión
                        </span>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
