"use client"
import { useEffect, useState } from 'react';
import { Container, TextField, Typography, Grid, Button } from '@mui/material';
import Loading from '@/app/components/Loading';
import { useAuth } from '@/context/AuthContext';
import mensajes from '@/app/components/Mensajes';
import { getNormalLimitsConfig, updateNormalLimitsConfigById } from '@/services/normalLimitsConfig.service';
import { useRouter } from 'next/navigation';

export default function SecurityLimitsPage() {
    const [limits, setLimits] = useState(null);
    const { token } = useAuth();
    const router = useRouter();
    const [id, setId] = useState(null);

    const fetchNormalLimits = async () => {
        try {
            const { results } = await getNormalLimitsConfig(token);

            setId(results._id);
            setLimits(results);
        } catch (error) {
            console.log(error);

            mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener los límites normales de datos ambientales", "error");
        }
    }

    const handleChange = (param, type) => (event) => {
        const value = Number(event.target.value);

        setLimits({
            ...limits,
            [param]: {
                ...limits[param],
                values: {
                    ...limits[param].values,
                    [type]: value,
                },
            },
        });
    };

    const handleSave = async () => {
        try {
            // Quito _id y __v
            delete limits.deletedAt;
            delete limits.createdAt;
            delete limits.__v;
            delete limits._id;

            await updateNormalLimitsConfigById(token, id, limits);
            mensajes("Exito", "Los límites se han actualizado correctamente");

            router.push('/system-settings/normal-security-limits');
        } catch (error) {
            console.log(error)
            mensajes("Error", error.response?.data?.customMessage || "No se ha podido actualizar los límites normales de datos ambientales", "error");
        }
    };

    useEffect(() => {
        if (token) {
            fetchNormalLimits()
        }
    }, [token]);

    return (
        limits ?
            <Container maxWidth="md" sx={{ marginTop: '20px' }}>
                <Typography variant="h5" gutterBottom>
                    Actualizar límites normales de Seguridad
                </Typography>
                <Grid container spacing={3}>
                    {["temp", "press", "hum", "co2", "heat"].map((param) => (
                        <Grid item xs={12} key={param}>
                            <Typography variant="h6">{limits[param].displayName}</Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mínimo"
                                        type="number"
                                        value={limits[param].values.min}
                                        onChange={handleChange(param, 'min')}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Máximo"
                                        type="number"
                                        value={limits[param].values.max}
                                        onChange={handleChange(param, 'max')}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSave}>
                        Guardar
                    </Button>
                </Grid>
            </Container> :
            <Loading />
    );
}
