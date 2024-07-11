"use client"
import { useState } from 'react';
import { Container, TextField, Typography, Grid, Button } from '@mui/material';

// Estructura de límites inicial (simulación de datos del backend)
const initialLimits = {
    temp: { displayName: "Temperatura", values: { max: 30, min: 10 } },
    press: { displayName: "Presión", values: { max: 1000, min: 500 } },
    hum: { displayName: "Humedad", values: { max: 80, min: 20 } },
    co2: { displayName: "Dióxido de Carbono", values: { max: 2000, min: 800 } },
    heat: { displayName: "Calor", values: { max: 50, min: 5 } },
};

export default function SecurityLimitsPage() {
    const [limits, setLimits] = useState(initialLimits);

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

    const handleSave = () => {
        // TODO: enviar los nuevos límites al backend
        console.log('Nuevos límites:', limits);
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Actualizar límites de Seguridad
            </Typography>
            <Grid container spacing={3}>
                {Object.keys(limits).map((param) => (
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
        </Container>
    );
}
