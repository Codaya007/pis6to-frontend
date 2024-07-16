"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

// Mock data para ejemplo
const mockActivities = [
    {
        id: 1,
        type: 'Tipo 1',
        model: 'Modelo 1',
        route: 'Ruta 1',
        body: 'body 1',
    },
    {
        id: 2,
        type: 'Tipo 2',
        model: 'Modelo 2',
        route: 'Ruta 2',
        body: 'body 2',
    },
];

export default function Activities() {
    const [activities, setActivities] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // TODO: Reemplazar con una llamada a backend
        setActivities(mockActivities);
    }, []);


    const handleSeeActivity = (id) => {
        // Lógica para dar de baja al usuario administrador
        console.log(`Ver actividad id: ${id}`);
        // TODO:  llamada al backend para eliminar al usuario
        router.push(`/activities/${id}`);
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
                            Actividades
                        </Typography>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Modelo</TableCell>
                                <TableCell>Ruta</TableCell>
                                <TableCell>Contenido</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activities.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell>
                                        {activity.id}
                                    </TableCell>
                                    <TableCell>{activity.type}</TableCell>
                                    <TableCell>{activity.model}</TableCell>
                                    <TableCell>{activity.route}</TableCell>
                                    <TableCell>{activity.body}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleSeeActivity(activity.id)}
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
