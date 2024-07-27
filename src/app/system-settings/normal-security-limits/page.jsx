"use client"
import { useEffect, useState } from 'react';
import { Container, TextField, Typography, Grid, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getNormalLimitsConfig } from '@/services/normalLimitsConfig.service';
import { useAuth } from '@/context/AuthContext';
import mensajes from '@/app/components/Mensajes';
import Loading from '@/app/components/Loading';

export default function SecurityLimitsPage() {
    const [limits, setLimits] = useState();
    const router = useRouter();
    const { token } = useAuth();

    const fetchNormalLimits = async () => {

        try {
            const { results } = await getNormalLimitsConfig(token);

            setLimits(results);
        } catch (error) {
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

    const handleEdit = () => {
        // Redirigir a la página /edit
        router.push('/system-settings/normal-security-limits/edit');
    };

    useEffect(() => {
        if (token) {
            fetchNormalLimits()
        }
    }, [token]);

    console.log({ limits })

    return limits ?
        <Container maxWidth="md" sx={{ marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Límites normales de datos climáticos
            </Typography>

            <Typography variant="body2" color="text.secondary">
                Estos límites son utilizados para identificar nodos con comportamientos anómalos y asegurar un ambiente controlado mediante la identificación de sensores dañados.
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Estos valores se utilizan para mantener el ambiente en condiciones óptimas y detectar cualquier anomalía que pueda afectar el funcionamiento normal de los sistemas.
            </Typography>

            <Grid container spacing={3} justifyContent="flex-end">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleEdit}>
                        Actualizar límites
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {["temp", "press", "hum", "co2", "heat"].map((param) => {
                    console.log({ param })

                    return <Grid item xs={12} key={param}>
                        <Typography variant="h6">{limits[param].displayName}</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={6}>
                                <TextField
                                    label="Mínimo"
                                    type="text"
                                    value={limits[param].values?.min}
                                    onChange={handleChange(param, 'min')}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true, // Esto hace que el campo no sea editable
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Máximo"
                                    type="text"
                                    value={limits[param].values?.max}
                                    onChange={handleChange(param, 'max')}
                                    fullWidth
                                    contentEditable={false}
                                    InputProps={{
                                        readOnly: true, // Esto hace que el campo no sea editable
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                })}
            </Grid>
        </Container > : <Loading />
}
