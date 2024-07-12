"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

// Mock data para ejemplo
const mockAlerts = [
    {
        id: 1,
        title: "Alerta 1",
        type: 'Falla de nodo 1',
        severity: 'Alta',
        description: 'Alta',
        date: '2020/10/20',
        isResolve: false,
    },
    {
        id: 2,
        title: "Alerta 2",
        type: 'Falla de nodo 2',
        severity: 'Media',
        description: 'Alta',
        date: '2020/10/20',
        isResolve: true,
    },
];

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // TODO: Reemplazar con una llamada a backend
        setAlerts(mockAlerts);
    }, []);


    const handleSeeAlert = (id) => {
        // Lógica para dar de baja al usuario administrador
        console.log(`Ver alerta id: ${id}`);
        // TODO:  llamada al backend para eliminar al usuario
        router.push(`/alerts/${id}`);
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
                            Alertas
                        </Typography>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Identificador</TableCell>
                                <TableCell>Titulo</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Severidad</TableCell>
                                <TableCell>Descripcion</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Resuelta</TableCell>
                                <TableCell>Ver detalle</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alerts.map((alert) => (
                                <TableRow key={alert.id}>
                                    <TableCell>
                                        {alert.id}
                                    </TableCell>
                                    <TableCell>{alert.title}</TableCell>
                                    <TableCell>{alert.type}</TableCell>
                                    <TableCell>{alert.severity}</TableCell>
                                    <TableCell>{alert.description}</TableCell>
                                    <TableCell>{alert.date}</TableCell>
                                    <TableCell>{alert.isResolve == true ? 'No' : 'Si'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleSeeAlert(alert.id)}
                                        >
                                            Ver detalle
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
