"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Badge, Box, CardMedia, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import mensajes from "../components/Mensajes";
import CustomPagination from "../components/CustomPagination";
import { deleteMonitoringStationById, getAllMonitoringStations, updateMonitoringStationById } from "@/services/monitoringStation.service";
import { ACTIVE_MONITORING_STATION, INACTIVE_MONITORING_STATION } from "@/constants";
import MensajeConfirmacion from "../components/MensajeConfirmacion";

export default function MonitoringStationDashboard() {
    const [monitoringStations, setMonitoringStations] = useState([]);
    const [campus, setCampus] = useState('');
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const { token } = useAuth();
    const router = useRouter();

    const getMonitoringStations = async () => {
        try {
            const { totalCount, results } = await getAllMonitoringStations(token, skip, limit);
            setTotalCount(totalCount);
            setMonitoringStations(results);
        } catch (error) {
            console.log(error);
            console.log(error?.response?.data || error.message);
            mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener las estaciones de monitoreo", "error");
        }
    };

    useEffect(() => {
        if (token) {
            getMonitoringStations();
        }
    }, [token, skip]);

    const handleCreateAdmin = () => {
        router.push("/monitoringStation/create");
    };

    const handleUpdateMonitoringStationById = (id) => {
        router.push(`/monitoringStation/update/${id}`);
    };

    const handleUpdateMonitoringStationByIdStatus = async (id, state) => {
        try {
            console.log(token);
            await updateMonitoringStationById(token, id, { status: state },);
            await getMonitoringStations();
            mensajes("Éxito", "Estacion de monitoreo actualizada exitosamente");
        } catch (error) {
            console.log(error);
            console.log(error?.response?.data || error.message);
            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar el usuario", "error");
        }
    };

    const handleDeleteMonitoringStation = async (id) => {
        MensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning")
            .then(async () => {
                try {
                    await deleteMonitoringStationById(token, id);
                    await getMonitoringStations();
                    mensajes("Éxito", "Estación de monitoreo eliminada exitosamente");
                } catch (error) {
                    console.log(error);
                    console.log(error?.response?.data || error.message);
                    mensajes("Error en eliminación", error.response?.data?.customMessage || "No se ha podido eliminar la estación de monitoreo", "error");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handlePageChange = (newSkip) => {
        setSkip(newSkip);
    };

    const handleShowNodes = (stationId) => {
        router.push(`/monitoringStation/node/${stationId}`);
    };

    return (
        <Container component="main" maxWidth="xl">
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
                            Estaciones de monitoreo
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleCreateAdmin}>
                            Crear estación de monitoreo
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Dirección</TableCell>
                                <TableCell>Fotos</TableCell>
                                <TableCell>Información</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monitoringStations.map((monitoringStation) => (
                                <TableRow key={monitoringStation._id}>
                                    <TableCell>
                                        {monitoringStation.name}
                                    </TableCell>
                                    <TableCell>{monitoringStation.address}</TableCell>
                                    <TableCell>
                                        <CardMedia
                                            sx={{ height: 80, width: 100 }}
                                            image={monitoringStation.photos[0]}
                                            title="green iguana"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        Campus: {monitoringStation.nomenclature.campus} <br />
                                        Bloque: {monitoringStation.nomenclature.bloque} <br />
                                        Piso: {monitoringStation.nomenclature.piso}
                                    </TableCell>
                                    <TableCell>{monitoringStation.status}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleUpdateMonitoringStationById(monitoringStation._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            Actualizar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() =>
                                                handleUpdateMonitoringStationByIdStatus(monitoringStation._id, monitoringStation.status === INACTIVE_MONITORING_STATION ? ACTIVE_MONITORING_STATION : INACTIVE_MONITORING_STATION)
                                            }
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            {monitoringStation.status === INACTIVE_MONITORING_STATION ? "Activar" : "Desactivar"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteMonitoringStation(monitoringStation._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            Dar de baja
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleShowNodes(monitoringStation._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            Gestionar nodos
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <CustomPagination
                    skip={skip}
                    limit={limit}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                />
            </Box>
        </Container>
    );
}