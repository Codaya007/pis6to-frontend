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
import { Avatar, Badge, Box, CardMedia, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ACTIVE_MONITORING_STATION, INACTIVE_MONITORING_STATION } from "@/constants";
import { deleteNodeById, getAllNodes, updateNodeById } from "@/services/nodes.service";
import mensajes from "@/app/components/Mensajes";
import CustomPagination from "@/app/components/CustomPagination";
import { getAllMonitoringStation } from "@/services/monitoring-station.service";
import MensajeConfirmacion from "@/app/components/MensajeConfirmacion";

export default function Nodes() {
    const [nodes, setNodes] = useState([]);

    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const { token } = useAuth();
    const router = useRouter();

    const getNodes = async () => {
        const { data } = await getAllNodes(token, skip, limit);
        const {results} = await getAllMonitoringStation(token, skip, limit);
        console.log('RESULTSSSS');
        console.log(data);
        const nodosConNombreEstacion = data.map((nodo) => {
            const estacion = results.find(
              (estacion) => estacion._id == nodo.monitoringStation
            );
            
            return {
              ...nodo,
              nombreEstacion: estacion ? estacion.name : 'Nombre no encontrado',
            };
          });
        console.log('Nodos con estaciones');
        console.log(nodosConNombreEstacion);
        setNodes(nodosConNombreEstacion);
    };

    useEffect(() => {
        if (token) {
            getNodes();
        }
    }, [token, skip]);

    const handleCreateNode = () => {
        router.push("/monitoringStation/node/createNode");
    };

    const handleUpdateNodeById = (id) => {
        router.push(`/monitoringStation/node/update/${id}`);
    };

    const handleUpdateNodeByIdStatus = async (id, state) => {
        try {
            console.log(token);
            await updateNodeById(token, id, { status: state },);
            await getNodes();
            mensajes("Éxito", "Nodo actualizado exitosamente");
        } catch (error) {
            console.log(error);
            console.log(error?.response?.data || error.message);
            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar el nodo", "error");
        }
    };

    const handleDeleteNode = async (id) => {
        MensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning")
            .then(async () => {
                try {
                    await deleteNodeById(token, id);
                    await getNodes();
                    mensajes("Éxito", "Sensor eliminado exitosamente");
                } catch (error) {
                    console.log(error);
                    console.log(error?.response?.data || error.message);
                    mensajes("Error en eliminación", error.response?.data?.customMessage || "No se ha podido eliminar el nodo", "error");
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
                            Nodos
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleCreateNode}>
                            Crear nodo
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Codigo</TableCell>
                                <TableCell>Ubicacion</TableCell>
                                <TableCell>Estación de monitoreo</TableCell>
                                <TableCell>Fotos</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {nodes.map((node) => (
                                <TableRow key={node._id}>
                                    <TableCell>
                                        {node.name}
                                    </TableCell>
                                    <TableCell>{node.code}</TableCell>
                                    <TableCell>{node.location}</TableCell>
                                    <TableCell>{node.nombreEstacion}</TableCell>
                                    {node.photos.length > 0 ? <TableCell>
                                        <CardMedia
                                            sx={{ height: 80, width: 100 }}
                                            image={node.photos[0]}
                                            title="green iguana"
                                        />
                                    </TableCell> : 
                                    <TableCell> No hay fotos</TableCell>}
                                    
                                    <TableCell>{node.status}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleUpdateNodeById(node._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            Actualizar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() =>
                                                handleUpdateNodeByIdStatus(node._id, node.status === INACTIVE_MONITORING_STATION ? ACTIVE_MONITORING_STATION : INACTIVE_MONITORING_STATION)
                                            }
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            {node.status === INACTIVE_MONITORING_STATION ? "Activar" : "Desactivar"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteNode(node._id)}
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
                    // totalCount={totalCount}
                    onPageChange={handlePageChange}
                />
            </Box>
        </Container>
    );
}

// export default WithAuth(MonitoringStationDashboard)