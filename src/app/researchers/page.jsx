"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { deleteResearcherById, getAllResearchers, updateResearcher } from "@/services/researcher.service";
import { useAuth } from "@/context/AuthContext";
import mensajes from "@/app/components/Mensajes";
import MensajeConfirmacion from "@/app/components/MensajeConfirmacion";
import { ACTIVE_USER_STATUS, BLOQUED_USER_STATUS } from "@/constants";
import { useRouter } from "next/navigation";
import CustomPagination from "../components/CustomPagination";

export default function Researchers() {
    const [researchers, setResearchers] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(null);
    const { token } = useAuth();
    const router = useRouter();

    const getResearchers = async () => {
        try {
            const { totalCount, results } = await getAllResearchers(token, skip, limit);

            setTotalCount(totalCount)
            setResearchers(results);
        } catch (error) {
            mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener los investigadores", "error");
        }
    }

    useEffect(() => {
        // Llamada a backend
        if (token) {
            getResearchers();
        }

        // setResearchers(mockResearchers);
    }, [token, skip, limit]);

    const handleViewResearcher = (id) => {
        // Lógica para actualizar el investigador researcheristrador
        router.push(`/researchers/view/${id}`);
    };

    const handleUpdateResearcherStatus = async (id, state) => {
        try {
            await updateResearcher(id, { state }, token);
            await getResearchers();

            mensajes("Éxito", "Investigador actualizado exitosamente", "info");
        } catch (error) {
            console.log(error)
            console.log(error?.response?.data || error.message);

            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar el investigador", "error");
        }
    }

    const handleDeleteResearcher = async (id) => {
        // Lógica para dar de baja al investigador researcheristrador
        console.log(`Dando de baja al researcheristrador con ID: ${id}`);

        // setResearchers(researchers.filter(researcher => researcher_.id !== id));
        MensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning").then(async () => {
            try {
                await deleteResearcherById(token, id);
                await getResearchers();

                mensajes("Éxito", "Investigador eliminado exitosamente", "info");
            } catch (error) {
                console.log(error)
                console.log(error?.response?.data || error.message);

                mensajes("Error en eliminación", error.response?.data?.customMessage || "No se ha podido eliminar el investigador", "error");
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
                            Investigadores
                        </Typography>
                    </Grid>
                    {/* <Grid item>
                        <Button variant="contained" onClick={handleCreateResearcher}>
                            Crear Investigador
                        </Button>
                    </Grid> */}
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Avatar</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Apellido</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Ocupación</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Cargo</TableCell>
                                <TableCell>Institución</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {researchers.map((researcher) => (
                                <TableRow key={researcher._id}>
                                    <TableCell>
                                        <Avatar src={researcher.avatar} alt={researcher.firstName} />
                                    </TableCell>
                                    <TableCell>{researcher.user.name}</TableCell>
                                    <TableCell>{researcher.user.lastname}</TableCell>
                                    <TableCell>{researcher.user.state}</TableCell>
                                    <TableCell>{researcher.user.email}</TableCell>
                                    <TableCell>{researcher.occupation}</TableCell>
                                    <TableCell>{researcher.area}</TableCell>
                                    <TableCell>{researcher.position}</TableCell>
                                    <TableCell>{researcher.institution}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleViewResearcher(researcher._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.875rem' }}
                                        >
                                            Ver
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleUpdateResearcherStatus(researcher._id, researcher.user.state === BLOQUED_USER_STATUS ? ACTIVE_USER_STATUS : BLOQUED_USER_STATUS)}
                                            sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.875rem' }}
                                        >
                                            {researcher.user.state === BLOQUED_USER_STATUS ? "Desbloquear" : "Bloquear"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteResearcher(researcher._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.875rem' }}
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
