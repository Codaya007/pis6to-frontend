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
import { areasDeTrabajo } from "@/constants";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";

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

export default function ProfileUpdate() {
    const [userData, setUserData] = useState(fakeUserData);
    const [area, setArea] = useState(userData.area); // Estado para el área seleccionada en el select
    const router = useRouter();

    const handleSave = () => {
        // Aquí iría la lógica para guardar los cambios del perfil en el servidor
        // Normalmente se haría una petición al backend para actualizar los datos
        console.log('Guardando cambios...', userData);

        // Redirigir a la página de perfil o a otra página después de guardar
        router.push('/users/me');
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        console.log('Subiendo archivo...', file);

        // Simular carga de avatar y actualizar userData.avatarUrl
        try {
            const formData = new FormData();
            formData.append('image', file);

            // Aquí debes hacer la petición al servicio para subir el avatar
            // Replace 'https://your-avatar-upload-service' with your actual service URL
            const response = await fetch('https://your-avatar-upload-service', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al subir avatar');
            }

            const data = await response.json();
            console.log('Respuesta del servicio de avatar:', data);

            // Actualizar userData.avatarUrl con la URL devuelta por el servicio
            setUserData({ ...userData, avatarUrl: data.avatarUrl });

        } catch (error) {
            console.error('Error al subir avatar:', error.message);
        }
    };

    const handleAreaChange = (event) => {
        setArea(event.target.value);
    };

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Avatar del usuario */}
                <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 100, height: 100 }}>
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
                    Actualizar Perfil
                </Typography>
                <Box component="form" noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {/* Información básica */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="firstName"
                                label="Nombre"
                                defaultValue={userData.firstName}
                                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="lastName"
                                label="Apellido"
                                defaultValue={userData.lastName}
                                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="email"
                                label="Correo electrónico"
                                defaultValue={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="cedula"
                                label="Cédula"
                                defaultValue={userData.cedula}
                                onChange={(e) => setUserData({ ...userData, cedula: e.target.value })}
                            />
                        </Grid>
                    </Grid>

                    {/* Información académica */}
                    <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 2 }}>
                        Información Académica
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="occupation"
                                label="Ocupación"
                                defaultValue={userData.occupation}
                                onChange={(e) => setUserData({ ...userData, occupation: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="area-label">Área</InputLabel>
                                <Select
                                    labelId="area-label"
                                    id="area"
                                    value={area}
                                    label="Área"
                                    onChange={handleAreaChange}
                                >
                                    {areasDeTrabajo.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="position"
                                label="Cargo"
                                defaultValue={userData.position}
                                onChange={(e) => setUserData({ ...userData, position: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="institution"
                                label="Institución"
                                defaultValue={userData.institution}
                                onChange={(e) => setUserData({ ...userData, institution: e.target.value })}
                            />
                        </Grid>
                    </Grid>

                    {/* Subir Avatar */}
                    <input
                        accept="image/*"
                        id="avatar-upload"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="avatar-upload">
                        <Button
                            variant="contained"
                            component="span"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Subir Avatar
                        </Button>
                    </label>

                    {/* Botones de acción */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
