"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { getAllDownloadRequests, updateDownloadRequestById } from "@/services/downloadRequest.service";
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
        router.push(`/download-request/view/${id}`);
    };

    const handleAcceptRequest = async (id) => {
        try {
            await updateDownloadRequestById(token, id, { status: "Aceptada" });
            await getDownloadRequests();

            mensajes("Éxito", "Solicitud de descarga aceptada exitosamente", "info");
        } catch (error) {
            console.log(error)
            console.log(error?.response?.data || error.message);

            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar el solicitud de descarga", "error");
        }
    }

    const handleDennyRequest = async (id) => {
        try {
            await updateDownloadRequestById(token, id, { status: "Denegada" },);
            await getDownloadRequests();

            mensajes("Éxito", "Solicitud de descarga denegada exitosamente", "info");
        } catch (error) {
            console.log(error)
            console.log(error?.response?.data || error.message);

            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar el solicitud de descarga", "error");
        }
    }

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
                                    <TableCell>{downloadrequest.researcher?.user?.name}</TableCell>
                                    <TableCell>{downloadrequest.researcher?.user?.lastname}</TableCell>
                                    <TableCell>{downloadrequest.researcher?.user?.email}</TableCell>
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
                                        {downloadrequest.status === "Pendiente" ?
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => handleAcceptRequest(downloadrequest._id)}
                                                    sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.875rem' }}
                                                >
                                                    Aceptar solicitud
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => handleDennyRequest(downloadrequest._id)}
                                                    sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.875rem' }}
                                                >
                                                    Denegar solicitud
                                                </Button>
                                            </> : <></>
                                        }

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
