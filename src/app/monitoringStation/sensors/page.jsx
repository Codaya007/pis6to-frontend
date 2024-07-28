"use client";
import { useAuth } from "@/context/AuthContext";
// import { deleteNode, getAllNodes } from "@/services/nodes.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import mensajeConfirmacion from "../components/MensajeConfirmacion";
// import { WithAuth } from "../components/WithAuth";
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, CardMedia, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { deleteMonitoringStationById, getAllMonitoringStations, updateMonitoringStationById } from "@/services/monitoringStation.service";
import { ACTIVE_MONITORING_STATION, INACTIVE_MONITORING_STATION } from "@/constants";
import MensajeConfirmacion from "@/app/components/MensajeConfirmacion";
import mensajes from "@/app/components/Mensajes";
import CustomPagination from "@/app/components/CustomPagination";
import { deleteSensorById, getAllSensors, updateSensor } from "@/services/sensor.service";

export default function CreateSensor() {
    const [sensors, setSensors] = useState([]);

    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const { token } = useAuth();
    const router = useRouter();

    const getSensors = async () => {
        const { totalCount, results } = await getAllSensors(token, skip, limit);
        const transformedResults = results.map(sensor => {
            const { node, ...rest } = sensor;
            return {
                ...rest,
                node: node.name // Extraemos el nombre del nodo y lo asignamos a nodeName
            };
        });
        setTotalCount(totalCount);
        setSensors(transformedResults);
        
    };

    useEffect(() => {
        if (token) {
            getSensors();
        }
    }, [token, skip]);

    const handleCreateSensor = () => {
        router.push("/monitoringStation/sensors/createSensors/");
    };

    const handleUpdateSensorById = (id) => {
        router.push(`/monitoringStation/sensors/update/${id}`);
    };

    const handleUpdateSensorStatusById = async (id, state) => {
        try {
            console.log(token);
            console.log('idddd');
            console.log(id);
            await updateSensor(id, { status: state }, token);
            await getSensors();
            mensajes("Éxito", "Estacion de monitoreo actualizada exitosamente", "success");
        } catch (error) {
            console.log(error);
            console.log(error?.response?.data || error.message);
            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar el usuario", "error");
        }
    };

    const handleDeleteSensor = async (id) => {
        MensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning")
            .then(async () => {
                try {
                    await deleteSensorById(token, id);
                    await getSensors();
                    mensajes("Éxito", "Sensor eliminado exitosamente", "success");
                } catch (error) {
                    console.log(error);
                    console.log(error?.response?.data || error.message);
                    mensajes("Error en eliminación", error.response?.data?.customMessage || "No se ha podido eliminar el sensor", "error");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handlePageChange = (newSkip) => {
        setSkip(newSkip);
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
                            Sensores
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleCreateSensor}>
                            Agregar sensor
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Nodo</TableCell>
                                <TableCell>Codigo</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sensors.map((sensor) => (
                                <TableRow key={sensor._id}>
                                    <TableCell>
                                        {sensor.type}
                                    </TableCell>
                                    <TableCell>
                                        {sensor.node}
                                    </TableCell>
                                    <TableCell>
                                        {sensor.code}
                                    </TableCell>
                                    <TableCell>{sensor.status}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleUpdateSensorById(sensor._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            Actualizar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() =>
                                                handleUpdateSensorStatusById(sensor._id, sensor.status === INACTIVE_MONITORING_STATION ? ACTIVE_MONITORING_STATION : INACTIVE_MONITORING_STATION)
                                            }
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            {sensor.status === INACTIVE_MONITORING_STATION ? "Activar" : "Desactivar"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteSensor(sensor._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            Dar de baja
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

// export default WithAuth(MonitoringStationDashboard)  