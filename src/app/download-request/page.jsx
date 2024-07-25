"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { deleteDownloadRequestById, getAllDownloadRequests, updateDownloadRequest } from "@/services/downloadRequest.service";
import { useAuth } from "@/context/AuthContext";
import mensajes from "@/app/components/Mensajes";
import MensajeConfirmacion from "@/app/components/MensajeConfirmacion";
import { ACTIVE_USER_STATUS, BLOQUED_USER_STATUS } from "@/constants";
import { useRouter } from "next/navigation";
import CustomPagination from "../components/CustomPagination";

export default function DownloadRequests() {
    const [downloadrequests, setDownloadRequests] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(null);
    const { token } = useAuth();
    const router = useRouter();

    const getDownloadRequests = async () => {
        try {
            const { totalCount, results } = await getAllDownloadRequests(token, skip, limit);

            setTotalCount(totalCount)
            setDownloadRequests(results);
        } catch (error) {
            mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener los solicitud de descargaes", "error");
        }
    }

    useEffect(() => {
        // Llamada a backend
        if (token) {
            getDownloadRequests();
        }

        // setDownloadRequests(mockDownloadRequests);
    }, [token, skip, limit]);

    const handleViewDownloadRequest = (id) => {
        // Lógica para actualizar el solicitud de descarga downloadrequestistrador
        router.push(`/downloadrequests/view/${id}`);
    };

    const handleUpdateDownloadRequestStatus = async (id, state) => {
        try {
            await updateDownloadRequest(id, { state }, token);
            await getDownloadRequests();

            mensajes("Éxito", "Solicitud de descarga actualizado exitosamente", "info");
        } catch (error) {
            console.log(error)
            console.log(error?.response?.data || error.message);

            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar el solicitud de descarga", "error");
        }
    }

    const handleDeleteDownloadRequest = async (id) => {
        // Lógica para dar de baja al solicitud de descarga downloadrequestistrador
        console.log(`Dando de baja al downloadrequestistrador con ID: ${id}`);

        // setDownloadRequests(downloadrequests.filter(downloadrequest => downloadrequest_.id !== id));
        MensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning").then(async () => {
            try {
                await deleteDownloadRequestById(token, id);
                await getDownloadRequests();

                mensajes("Éxito", "Solicitud de descarga eliminado exitosamente", "info");
            } catch (error) {
                console.log(error)
                console.log(error?.response?.data || error.message);

                mensajes("Error en eliminación", error.response?.data?.customMessage || "No se ha podido eliminar el solicitud de descarga", "error");
            }
        }).catch((error) => {
            console.error(error);
        })
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
                            Solicitudes de descarga
                        </Typography>
                    </Grid>
                    {/* <Grid item>
                        <Button variant="contained" onClick={handleCreateDownloadRequest}>
                            Crear Solicitud de descarga
                        </Button>
                    </Grid> */}
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre solicitante</TableCell>
                                <TableCell>Apellido solicitante</TableCell>
                                <TableCell>Email solicitante</TableCell>
                                <TableCell>Estado</TableCell>
                                {/* <TableCell>Ocupación</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Cargo</TableCell>
                                <TableCell>Institución</TableCell> */}
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {downloadrequests.map((downloadrequest) => (
                                <TableRow key={downloadrequest._id}>
                                    <TableCell>{downloadrequest.user.name}</TableCell>
                                    <TableCell>{downloadrequest.user.lastname}</TableCell>
                                    <TableCell>{downloadrequest.user.email}</TableCell>
                                    <TableCell>{downloadrequest.status}</TableCell>
                                    {/* <TableCell>{downloadrequest.occupation}</TableCell>
                                    <TableCell>{downloadrequest.area}</TableCell>
                                    <TableCell>{downloadrequest.position}</TableCell>
                                    <TableCell>{downloadrequest.institution}</TableCell> */}
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleViewDownloadRequest(downloadrequest._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.875rem' }}
                                        >
                                            Ver detalle
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleUpdateDownloadRequestStatus(downloadrequest._id, downloadrequest.user.state === BLOQUED_USER_STATUS ? ACTIVE_USER_STATUS : BLOQUED_USER_STATUS)}
                                            sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.875rem' }}
                                        >
                                            {downloadrequest.user.state === BLOQUED_USER_STATUS ? "Desbloquear" : "Bloquear"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteDownloadRequest(downloadrequest._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.875rem' }}
                                        >
                                            Aceptar solicitud
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
