"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Container, CssBaseline, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, TextField } from "@mui/material";
import mensajes from "../../../components/Mensajes";
import CustomPagination from "../../../components/CustomPagination";
import MensajeConfirmacion from "../../../components/MensajeConfirmacion";

import { getMonitoringStationById } from "@/services/monitoringStation.service";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function NodesDashboard({ params }) {
    const { stationId } = params;
    const [nodes, setNodes] = useState([]);
    const [station, setStation] = useState(null);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const { token } = useAuth();
    const router = useRouter();

    // Estados para el modal de actualización
    const [openModal, setOpenModal] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [editName, setEditName] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editCode, setEditCode] = useState('');
    const [editStatus, setEditStatus] = useState('');

    const getNodes = async () => {
        try {
            const response = await fetch(`http://localhost:4000/ms2/nodes?monitoringStation=${stationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.customMessage || 'Network response was not ok');
            }

            const data = await response.json();
            
            setTotalCount(data.totalCount || data.length);
            setNodes(data.results || data);
            
        } catch (error) {
            console.error("Error fetching nodes:", error);
            mensajes("Error", error.message || "No se pudieron obtener los nodos", "error");
        }
    };

    const getStation = async () => {
        try {
            const stationData = await getMonitoringStationById(token, stationId);
            setStation(stationData);
        } catch (error) {
            console.error("Error fetching station:", error);
            mensajes("Error", "No se pudo obtener la información de la estación", "error");
        }
    };

    useEffect(() => {
        if (token && stationId) {
            getNodes();
            getStation();
        }
    }, [token, stationId, skip]);

    const handleCreateNode = () => {
        router.push(`/monitoringStation/node/createNode/${stationId}`);
    };

    const handleUpdateNode = (node) => {
        setSelectedNode(node);
        setEditName(node.name);
        setEditLocation(node.location);
        setEditCode(node.code);
        setEditStatus(node.status);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedNode(null);
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/ms2/nodes/${selectedNode._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    name: editName, 
                    location: editLocation, 
                    code: editCode, 
                    status: editStatus 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.customMessage || 'Error updating node');
            }

            const responseData = await response.json();
            mensajes("Éxito", responseData.customMessage, "success");
            getNodes();
            handleCloseModal();
        } catch (error) {
            console.error("Error updating node:", error);
            mensajes("Error", error.message || "No se ha podido actualizar el nodo", "error");
        }
    };

    const handleDeleteNode = async (nodeId) => {
        try {
            const confirmed = await MensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning");
    
            if (confirmed) {
                const response = await fetch(`http://localhost:4000/ms2/nodes/${nodeId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.customMessage || 'Error deleting node');
                }
    
                const responseData = await response.json();
                mensajes("Éxito", responseData.customMessage, "success");
                await getNodes();
            }
        } catch (error) {
            console.error("Error deleting node:", error);
            mensajes("Error", error.message || "No se ha podido eliminar el nodo", "error");
        }
    };  

    const handlePageChange = (newSkip) => {
        setSkip(newSkip);
    };

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography component="h1" variant="h5">
                            Nodos de la estación: {station?.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleCreateNode}>
                            Crear nuevo nodo
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Ubicación</TableCell>
                                <TableCell>Código</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {nodes.map((node) => (
                                <TableRow key={node._id}>
                                    <TableCell>{node._id}</TableCell>
                                    <TableCell>{node.name}</TableCell>
                                    <TableCell>{node.location}</TableCell>
                                    <TableCell>{node.code}</TableCell>
                                    <TableCell>{node.status}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleUpdateNode(node)}
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            Actualizar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteNode(node._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            Eliminar
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

            {/* Modal de actualización */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Actualizar Nodo
                    </Typography>
                    <form onSubmit={handleSubmitUpdate}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Ubicación"
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Código"
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Estado"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                            Actualizar
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Container>
    );
}