"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { getAllAlerts, muteAlert, resolveAlert } from "@/services/alert.service";
import { useAuth } from "@/context/AuthContext";
import { getAllNodes } from "@/services/nodes.service";
import mensajes from "../components/Mensajes";


export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(null);
    const [modifiedAlert, setModifiedAlert] = useState(true);
    const { token, user } = useAuth();
    const router = useRouter();

    const getAlerts = async () => {
        try {
            const { totalCount, results } = await getAllAlerts(token, skip, limit);
            const nodes = await getAllNodes(token, skip, limit);
            console.log(nodes.results);
            const nodesMap = new Map();
            nodes.results.forEach(node => {
                nodesMap.set(node._id, node); // Mapear el _id del nodo al nodo completo
            });
            console.log(nodesMap);

            // Añadir el nombre del nodo a cada alerta
            const alertsWithNodeNames = results.map(alert => {
                const nodeId = nodesMap.get(alert.node); // Buscar el nodo correspondiente
                console.log(alert);
                return {
                    ...alert,
                    nodeName: nodeId ? nodeId.name : null // Agregar el nombre del nodo a la alerta
                };
            });
            console.log(alertsWithNodeNames);
            setTotalCount(totalCount)
            setAlerts(alertsWithNodeNames);
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
    }, [token, skip, limit, modifiedAlert]);


    const handleSeeAlert = (id) => {
        // Lógica para dar de baja al usuario administrador
        console.log(`Ver alerta id: ${id}`);
        // TODO:  llamada al backend para eliminar al usuario
        router.push(`/alerts/${id}`);
    };

    const handleMuteAlert = async (id, emitSound) => {
        try {
            await muteAlert(id, { emitSound }, token);
            setModifiedAlert(!modifiedAlert);

            mensajes("Éxito", "Alerta actualizada exitosamente", "info");
        } catch (error) {
            console.log(error)
            console.log(error?.response?.data || error.message);

            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar la alerta", "error");
        }
    }

    const handleResolveAlert = async (id, resolved) => {
        try {
            const item = {
                resolved : resolved,
                resolvedBy: user._id
            }
            await resolveAlert(id, item , token);
            setModifiedAlert(!modifiedAlert);

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
                                {/* <TableCell>Identificador</TableCell> */}
                                <TableCell>Titulo</TableCell>
                                <TableCell>Descripcion</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Nodo</TableCell>
                                <TableCell>Silenciada</TableCell>
                                <TableCell>Resuelta</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alerts.map((alert) => (
                                <TableRow key={alert.id}>
                                    {/* <TableCell>
                                        {alert.id}
                                    </TableCell> */}
                                    <TableCell>{alert.title}</TableCell>
                                    <TableCell>{alert.description}</TableCell>
                                    <TableCell>{alert.type}</TableCell>
                                    <TableCell>{alert.nodeName}</TableCell>
                                    <TableCell>{alert.emitSound == true ? "Si" : "No"}</TableCell>
                                    <TableCell>{alert.resolved == true ? 'Si' : 'No'}</TableCell>
                                    <TableCell>
                                        <Button
                                            style={{marginLeft: 10}}    
                                            variant="contained"
                                            color="info"
                                            onClick={() => handleSeeAlert(alert.id)}
                            
                                        >
                                            Ver detalle
                                        </Button>
                                        <Button
                                            style={{marginLeft: 10}}
                                            variant="contained"
                                            color= {alert.emitSound == true ? 'secondary' : 'inherit'}
                                            onClick={() => handleMuteAlert(alert._id, !alert.emitSound)}
                                        >
                                            {alert.emitSound == true ? 'Desmutear' : 'Silenciar'}
                                        </Button>
                                        <Button
                                            style={{marginLeft: 10}}
                                            variant="contained"
                                            color={alert.resolved == true ? 'secondary' : 'inherit'}
                                            onClick={() => handleResolveAlert(alert._id, !alert.resolved)}
                                        >
                                            {alert.resolved == true ? 'No resuelta' : 'Resuelta'}
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
