"use client"
import React, { useState, useEffect, useRef } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper, Modal, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import mensajes from "../components/Mensajes";
import CustomPagination from "../components/CustomPagination";
import { getAllAlerts, muteAlert, resolveAlert } from "@/services/alert.service";
import { getAllNodes } from "@/services/nodes.service";
import io from "socket.io-client";
import { SOCKETS_BASEURL } from "@/constants";

// const initialAlerts = [
//     {
//         _id: "1",
//         title: "Alerta de temperatura alta",
//         description: "La temperatura ha superado el umbral",
//         type: "Crítica",
//         node: { name: "Nodo 1", monitoringStation: { name: "Estación 1" } },
//         emitSound: true,
//         resolved: false
//     },
//     {
//         _id: "2",
//         title: "Alerta de humedad baja",
//         description: "La humedad está por debajo del nivel aceptable",
//         type: "Advertencia",
//         node: { name: "Nodo 2", monitoringStation: { name: "Estación 2" } },
//         emitSound: false,
//         resolved: false
//     },
//     {
//         _id: "3",
//         title: "Alerta de presión alta",
//         description: "La presión ha superado el umbral",
//         type: "Crítica",
//         node: { name: "Nodo 3", monitoringStation: { name: "Estación 3" } },
//         emitSound: true,
//         resolved: true
//     }
// ];

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [modifiedAlert, setModifiedAlert] = useState(true);
    const { token, user } = useAuth();
    const router = useRouter();
    const socketRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [currentAlertId, setCurrentAlertId] = useState(null);
    const [appliedActions, setAppliedActions] = useState("");

    const getAlerts = async () => {
        try {
            const { totalCount, results } = await getAllAlerts(token, skip, limit);

            setTotalCount(totalCount)
            setAlerts(results);
        } catch (error) {
            mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener las alertas", "error");
        }
    }

    useEffect(() => {
        // Llamada a backend
        if (token) {
            getAlerts();
        }

        // setResearchers(mockResearchers);
    }, [token, skip, limit]);


    const handleMuteAlert = async (id, emitSound) => {
        try {
            await muteAlert(id, { emitSound }, token);
            setModifiedAlert(!modifiedAlert);
            getAlerts();

            mensajes("Éxito", "Alerta actualizada exitosamente", "info");
        } catch (error) {
            console.log(error)
            console.log(error?.response?.data || error.message);

            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar la alerta", "error");
        }
    }

    // const handleResolveAlert = async (id, resolved) => {
    //     try {
    //         const item = {
    //             resolved: resolved,
    //             resolvedBy: user._id
    //         }
    //         await resolveAlert(id, item, token);
    //         setModifiedAlert(!modifiedAlert);

    //         mensajes("Éxito", "Alerta actualizada exitosamente", "info");
    //     } catch (error) {
    //         console.log(error)
    //         console.log(error?.response?.data || error.message);

    //         mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar la alerta", "error");
    //     }
    // }

    const handleSeeAlert = (id) => {
        console.log(`Ver alerta id: ${id}`);
        router.push(`/alerts/${id}`);
    };

    // const handleMuteAlert = (id, emitSound) => {
    //     setAlerts(alerts.map(alert => alert._id === id ? { ...alert, emitSound } : alert));
    //     setModifiedAlert(!modifiedAlert);
    //     mensajes("Éxito", "Alerta actualizada exitosamente", "info");
    // }

    const handleResolveAlert = (id) => {
        setCurrentAlertId(id);
        setOpen(true);
    }

    const handleSubmitActions = async () => {
        // setAlerts(alerts.map(alert => alert._id === currentAlertId ? { ...alert, resolved: true, appliedActions } : alert));
        // setModifiedAlert(!modifiedAlert);
        // mensajes("Éxito", "Alerta actualizada exitosamente", "info");

        try {
            setModifiedAlert(!modifiedAlert);

            setOpen(false);
            setAppliedActions("");

            await resolveAlert(currentAlertId, { appliedActions }, token);
            getAlerts();

            mensajes("Éxito", "Alerta actualizada exitosamente", "info");
        } catch (error) {
            console.log(error)
            console.log(error?.response?.data || error.message);

            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar la alerta", "error");
        }
    }

    const handlePageChange = (newSkip) => {
        setSkip(newSkip);
    };

    // console.log({ currentAlertId })
    const CLIMATEDATA_SOCKET_URL = `${SOCKETS_BASEURL}:5005`

    useEffect(() => {
        try {
            socketRef.current = io(CLIMATEDATA_SOCKET_URL, {
                transports: ['websocket'],
            });

            const chanelName = "alerts"

            socketRef.current.on(chanelName, ({ alert }) => {
                if (token)
                    getAlerts();
            });

        } catch (error) {
            console.error(error)
        }

        return () => {
            socketRef.current?.disconnect();
        };
    }, [token]);

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
                                <TableCell>Titulo</TableCell>
                                <TableCell>Descripcion</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Nodo</TableCell>
                                <TableCell>Estación</TableCell>
                                <TableCell>Silenciada</TableCell>
                                <TableCell>Resuelta</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alerts.map((alert) => (
                                <TableRow key={alert._id}>
                                    <TableCell>{alert.title}</TableCell>
                                    <TableCell>{alert.description}</TableCell>
                                    <TableCell>{alert.type}</TableCell>
                                    <TableCell>{alert.node?.name || ""}</TableCell>
                                    <TableCell>{alert.node?.monitoringStation?.name || ""}</TableCell>
                                    <TableCell>{alert.emitSound == true ? "Si" : "No"}</TableCell>
                                    <TableCell>{alert.resolved == true ? 'Si' : 'No'}</TableCell>
                                    <TableCell>
                                        <Box display="flex" flexDirection="column" gap={1}>
                                            <Button
                                                variant="contained"
                                                color="info"
                                                onClick={() => handleSeeAlert(alert._id)}
                                            >
                                                Ver detalle
                                            </Button>
                                            {!alert.resolved && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color={alert.emitSound == true ? 'secondary' : 'inherit'}
                                                        onClick={() => handleMuteAlert(alert._id, !alert.emitSound)}
                                                    >
                                                        {alert.emitSound === false ? 'Activar sonido' : 'Silenciar'}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="inherit"
                                                        onClick={() => handleResolveAlert(alert._id)}
                                                    >
                                                        Resolver
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
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
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Acciones Tomadas
                    </Typography>
                    <TextField
                        id="modal-description"
                        label="Describa las acciones tomadas"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={appliedActions}
                        onChange={(e) => setAppliedActions(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitActions}
                        style={{ marginTop: 20 }}
                    >
                        Guardar
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}
