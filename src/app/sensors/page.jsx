"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

// Mock data para ejemplo
const mockSensors = [
    {
        id: 1,
        type: "Temperaturas",
        code: "001",
        state: true,
        environmentalParameter: {
            name: 'Calor',
            description: 'Descripcion del calor',
            range: {
                minimum: '10',
                maximum: '100'
            },
            measurementUnit: 'Celcius',
            measurementSymbol: 'C'
        },
        model: 'DHT-11',
        manufacturer: 'Itachi'
    },
    {
        id: 2,
        type: "Humedad",
        code: "002",
        state: true,
        environmentalParameter: {
            name: 'Humedad',
            description: 'Descripcion del humedad',
            range: {
                minimum: '10',
                maximum: '100'
            },
            measurementUnit: 'pmm',
            measurementSymbol: 'P'
        },
        model: 'DHT-11',
        manufacturer: 'Itachi'
    },
];

export default function Sensors() {
    const [sensors, setSensors] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // TODO: Reemplazar con una llamada a backend
        setSensors(mockSensors);
    }, []);

    const handleCreateSensor = () => {
        router.push("/sensors/create");
    };

    const handleUpdateSensor = (id) => {
        // Lógica para actualizar el usuario administrador
        router.push(`/sensors/update/${id}`);
    };

    const handleDeleteSensor = (id) => {
        // Lógica para dar de baja al usuario administrador
        console.log(`Dando de baja al sensor con ID: ${id}`);
        // TODO:  llamada al backend para eliminar al usuario
        setSensors(sensors.filter(sensor => sensor.id !== id));
    };

    const handleSeeSensor = (id) => {
        // Lógica para dar de baja al usuario administrador
        console.log(`Ver sensor id: ${id}`);
        // TODO:  llamada al backend para eliminar al usuario
        router.push(`/sensors/${id}`);
    };

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography component="h1" variant="h5">
                            Sensores
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleCreateSensor}>
                            Crear sensors
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fabricante</TableCell>
                                <TableCell>Modelo</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Parametro a medir</TableCell>
                                <TableCell>Simbolo de medida</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sensors.map((sensor) => (
                                <TableRow key={sensor.id}>
                                    <TableCell>{sensor.manufacturer}</TableCell>
                                    <TableCell>{sensor.model}</TableCell>
                                    <TableCell>{sensor.type}</TableCell>
                                    <TableCell>{sensor.state == true ? "Activado": "Desactivado"}</TableCell>
                                    <TableCell>{sensor.environmentalParameter.name}</TableCell>
                                    <TableCell>{sensor.environmentalParameter.measurementSymbol}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSeeSensor(sensor.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            Ver detalle
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdateSensor(sensor.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            Actualizar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteSensor(sensor.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            Dar de baja
                                        </Button>
                                        
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}
