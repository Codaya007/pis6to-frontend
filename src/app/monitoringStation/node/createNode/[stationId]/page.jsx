"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { Box, Button, Container, CssBaseline, TextField, Typography } from '@mui/material';
import mensajes from "../../../../components/Mensajes";
import { BACKEND_BASEURL } from '@/constants';

export default function CreateNode({ params }) {
    const { stationId } = params;
    const router = useRouter();
    const { token } = useAuth();

    const [nodeData, setNodeData] = useState({
        name: '',
        location: '',
        code: '',
        monitoringStation: stationId,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNodeData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_BASEURL}/ms2/nodes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Asume que necesitas un token para autenticación
                },
                body: JSON.stringify(nodeData)
            });

            if (!response.ok) {
                throw new Error('Error al crear el nodo');
            }

            const data = await response.json();
            mensajes("Éxito", "Nodo creado exitosamente", "success");
            router.push(`/monitoringStation/node/${stationId}`);
        } catch (error) {
            console.error("Error creating node:", error);
            mensajes("Error", "No se pudo crear el nodo", "error");
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
                <Typography component="h1" variant="h5">
                    Crear Nuevo Nodo
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nombre del Nodo"
                        name="name"
                        autoFocus
                        value={nodeData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="location"
                        label="Ubicación"
                        name="location"
                        value={nodeData.location}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="code"
                        label="Código"
                        name="code"
                        value={nodeData.code}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Crear Nodo
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}