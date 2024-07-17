"use client"
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/services/auth.service';
import mensajes from '@/app/components/Mensajes';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const router = useRouter();
    const { loginUser, user } = useAuth();

    const handleSubmit = async (event) => {
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
        try {
            const { user, token } = await login({ email, password })

            // Lo guardo en el contexto global
            loginUser(user, token);

            mensajes("Has ingresado al sistema", "Bienvenido usuario");
            router.push("/");

            // Reset form fields
            setEmail('');
            setPassword('');
        } catch (error) {
            console.log(error?.response?.data || error.message);
            mensajes("Error en inicio de sesion", error.response?.data?.customMessage || "No se ha podido iniciar sesión", "error");
        }
    };


    useEffect(() => {
        if (!user) {
            const userData = window.localStorage.getItem("user")
            const token = window.localStorage.getItem("token")

            // Si ya hay sesión, logueo al usuario, sino, lo mando al login
            if (userData && token) {
                loginUser(JSON.parse(userData), token)

                router.push("/")
            }
        }
    }, []);

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
                    <Grid item xs={11} sm={5} style={{ textAlign: "right" }}>
                        <span
                            style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => router.push("/auth/forgot-password")}
                        >
                            Olvidé mi contraseña?
                        </span>
                    </Grid>

                    <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Iniciar sesión
                        </Button>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                        No tienes una cuenta? <span
                            style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => router.push("/auth/register")}
                        >
                            Registrarse
                        </span>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
