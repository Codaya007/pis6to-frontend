"use client"
import { useState } from 'react';
import { Container, TextField, Typography, Grid, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const initialLimits = {
    temp: { displayName: "Temperatura", values: { max: 30, min: 10 } },
    press: { displayName: "Presión", values: { max: 1000, min: 500 } },
    hum: { displayName: "Humedad", values: { max: 80, min: 20 } },
    co2: { displayName: "Dióxido de Carbono", values: { max: 2000, min: 800 } },
    heat: { displayName: "Calor", values: { max: 50, min: 5 } },
};

export default function SecurityLimitsPage() {
    const [limits, setLimits] = useState(initialLimits);
    const router = useRouter();

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
        router.push('/system-settings/security-limits/edit');
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Límites de Seguridad
            </Typography>
            {/* Resto de tu contenido */}
            <Grid container spacing={3} justifyContent="flex-end">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleEdit}>
                        Actualizar límites
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {Object.keys(limits).map((param) => (
                    <Grid item xs={12} key={param}>
                        <Typography variant="h6">{limits[param].displayName}</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={6}>
                                <TextField
                                    label="Mínimo"
                                    type="text"
                                    value={limits[param].values.min}
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
                                    value={limits[param].values.max}
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
                ))}
            </Grid>
        </Container >
    );
}
