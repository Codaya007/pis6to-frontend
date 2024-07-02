"use client"
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        // Basic validation
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Correo electrónico inválido',
            }));
            return;
        }
        if (!password) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'La contraseña es requerida',
            }));
            return;
        }

        // Handle form submission logic (e.g., API call)
        console.log({ email, password });

        // Reset form fields
        setEmail('');
        setPassword('');
    };

    const handleForgotPassword = () => {
        // Logic for handling forgot password functionality
        console.log('Forgot password clicked');
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;

        // Basic validation onBlur
        switch (name) {
            case 'email':
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: /\S+@\S+\.\S+/.test(value) ? '' : 'Correo electrónico inválido',
                }));
                break;
            case 'password':
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: value.length >= 8 ? '' : 'La contraseña es requerida',
                }));
                break;
            default:
                break;
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
                    Iniciar sesión
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                                fullWidth
                                id="email"
                                label="Correo electrónico"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.password}
                                helperText={errors.password}
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={11} sm={5} style={{ textAlign: "rigth" }}>
                        <Link href="#" variant="body2" onClick={handleForgotPassword}>
                            Olvidé mi contraseña?
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Iniciar sesión
                        </Button>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                        No tienes una cuenta? <Link href="#" variant="body1" onClick={handleForgotPassword}>
                            Registrarse
                        </Link>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
