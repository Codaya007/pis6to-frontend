"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardMedia, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ACTIVE_MONITORING_STATION, INACTIVE_MONITORING_STATION } from "@/constants";
import { deleteNodeById, getAllNodes, updateNodeById } from "@/services/nodes.service";
import mensajes from "@/app/components/Mensajes";
import CustomPagination from "@/app/components/CustomPagination";
import { getAllMonitoringStation } from "@/services/monitoring-station.service";
import MensajeConfirmacion from "@/app/components/MensajeConfirmacion";

export default function Nodes() {
    const [nodes, setNodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const { token } = useAuth();
    const router = useRouter();

    const getNodes = async () => {
        setIsLoading(true);
        try {
            const { data } = await getAllNodes(token, skip, limit);
            const { results } = await getAllMonitoringStation(token, skip, limit);
            
            if (Array.isArray(data) && Array.isArray(results)) {
                const nodosConNombreEstacion = data.map((nodo) => {
                    const estacion = results.find(
                        (estacion) => estacion._id == nodo.monitoringStation
                    );

                    return {
                        ...nodo,
                        nombreEstacion: estacion ? estacion.name : 'Nombre no encontrado',
                    };
                });
                setNodes(nodosConNombreEstacion);
            } else {
                setNodes([]);
            }
        } catch (error) {
            console.error('Error fetching nodes:', error);
            mensajes("Error", error.response?.data?.customMessage || "No se han podido obtener los nodos", "error");
            setNodes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            getNodes();
        }
    }, [token, skip, limit]);

    const handleCreateNode = () => {
        router.push("/monitoringStation/node/createNode");
    };

    const handleUpdateNodeById = (id) => {
        router.push(`/monitoringStation/node/update/${id}`);
    };

    const handleUpdateNodeByIdStatus = async (id, state) => {
        try {
            await updateNodeById(token, id, { status: state });
            await getNodes();
            mensajes("Éxito", "Nodo actualizado exitosamente");
        } catch (error) {
            console.error('Error updating node:', error);
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
                    console.error('Error deleting node:', error);
                    mensajes("Error en eliminación", error.response?.data?.customMessage || "No se ha podido eliminar el nodo", "error");
                }
            })
            .catch((error) => {
                console.error('Confirmation error:', error);
            });
    };

    const handlePageChange = (newSkip) => {
        setSkip(newSkip);
    };

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 8, mb: 4 }}>
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
            <TableContainer component={Paper}>
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7}>Cargando...</TableCell>
                            </TableRow>
                        ) : Array.isArray(nodes) && nodes.length > 0 ? (
                            nodes.map((node) => (
                                <TableRow key={node._id}>
                                    <TableCell>{node.name}</TableCell>
                                    <TableCell>{node.code}</TableCell>
                                    <TableCell>{node.location}</TableCell>
                                    <TableCell>{node.nombreEstacion}</TableCell>
                                    <TableCell>
                                        {node.photos && node.photos.length > 0 ? (
                                            <CardMedia
                                                sx={{ height: 80, width: 100 }}
                                                image={node.photos[0]}
                                                title="green iguana"
                                            />
                                        ) : (
                                            "No hay fotos"
                                        )}
                                    </TableCell>
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
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7}>No hay nodos disponibles</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomPagination
                skip={skip}
                limit={limit}
                onPageChange={handlePageChange}
            />
        </Container>
    );
}