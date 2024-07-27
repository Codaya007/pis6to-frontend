"use client"
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Avatar, Box, Link, } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useParams, useRouter } from 'next/navigation';
import { getAlertById } from '@/services/alert.service';
import { useAuth } from "@/context/AuthContext";
import { getAllNodes } from '@/services/nodes.service';
import { getAllUsers } from '@/services/user.service';

// TODO: Completar los datos faltantes

export default function SeeAlertDetail() {
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const { token, user } = useAuth();
    const [alertData, setAlertData] = useState({
        title: "",
        description: "",
        url: "",
        type: "",
        node: "",
        resolved: true,
        resolvedBy: "",
        emitSound: true,
    });
    const router = useRouter();
    const { id } = useParams();
    

    const handleReturn = () => {
        // Redirigir a la página /edit
        router.push('/alerts');
    };

    useEffect(() => {
        
        const fetchAlert = async () => {
            try {
                const alert = await getAlertById(token, id);
                const nodes = await getAllNodes(token, skip, limit);
                const users = await getAllUsers(token, skip, limit);
                console.log('ALERTTSSSS');
                console.log(alert);
                console.log(`idddd ${alert.results.resolvedBy}`);
                const nodoEncontrado = nodes.data.find(node => node._id === alert.results.node);
                const userEncontrado = users.results.find(user => user._id === alert.results.resolvedBy);

                setAlertData(alert.results); // Actualiza el estado con los datos del usuario
                setAlertData( (prev) => ({
                    ...prev,
                    node: nodoEncontrado.name,
                    resolvedBy: `${userEncontrado.name} ${userEncontrado.lastname}`
                }));
            } catch (error) {
                console.error('Error al obtener a informacion:', error);
            }
        };

        fetchAlert();
    }, [token]); // Ejecuta la consulta solo una vez al montar el componente

    if (!alertData) {
        return <Typography>Cargando alerta...</Typography>; // Muestra un mensaje mientras se carga el perfil
    }

    const handlePageChange = (newSkip) => {
        setSkip(newSkip);
    };

    return (
        <Container component="main" maxWidth="md" sx={{marginTop: 2, paddingBottom:5, borderRadius:5, border: '4px solid black', alignItems: 'center' }}>
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Avatar del usuario */}
                <Avatar sx={{ width: 100, height: 100, mb: 2, overflow: 'visible' }}>
                        <img
                            src='data:image/png;base64,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'
                            alt="Avatar del usuario"
                            style={{ width: '100%', height: 'auto', borderRadius: '50%' }}
                        />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Detalle de la alerta
                </Typography>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    {/* Información básica */}
                    <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 3, textAlign: 'center' }} >
                         {alertData.title}
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={12} >
                            <Typography variant="subtitle1"><strong>Titulo:</strong> {alertData.title}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} >
                            <Typography variant="subtitle1"><strong>Descripción:</strong> {alertData.description}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} >
                            <Typography variant="subtitle1"><strong>Url:</strong> {alertData.url}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography variant="subtitle1"><strong>Tipo:</strong> {alertData.type}</Typography>
                        </Grid>
                        <Grid item xs={12}  sm={12}>
                            <Typography variant="subtitle1"><strong>Node:</strong> {alertData.node}</Typography>
                        </Grid>
                        <Grid item xs={12}  sm={12}>
                            <Typography variant="subtitle1"><strong>¿Esta resuelta?:</strong> {alertData.resolved == true ? "Si" : "No"}</Typography>
                        </Grid>
                        <Grid item xs={12}  sm={12}>
                            <Typography variant="subtitle1"><strong>Resuelta por:</strong> {alertData.resolvedBy}</Typography>
                        </Grid>
                        <Grid item xs={12}  sm={12}>
                            <Typography variant="subtitle1"><strong>Silenciada:</strong> {alertData.emitSound == true ? "Si" : "No"}</Typography>
                        </Grid>
                    </Grid>


                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        {/* Botón para editar perfil */}
                        <Button variant="contained" color="secondary" sx={{ mt: 1 }} onClick={handleReturn}>
                            Regresar
                        </Button>
                        {/* Botón para cambiar contraseña */}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
