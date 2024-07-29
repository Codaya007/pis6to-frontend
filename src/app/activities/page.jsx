"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { getAllSystemActivities } from "@/services/systemActivity.service";
import { useAuth } from "@/context/AuthContext";
import CustomPagination from "../components/CustomPagination";
import mensajes from "../components/Mensajes";

export default function Activities() {
    const [activities, setActivities] = useState([]);
    const router = useRouter();
    const [totalCount, setTotalCount] = useState(null);
    const { token } = useAuth();
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);

    const getActivities = async () => {
        try {
            const { totalCount, results } = await getAllSystemActivities(token, skip, limit);

            setTotalCount(totalCount)
            setActivities(results);
        } catch (error) {
            mensajes("Error", error.response?.data?.customMessage || "No se ha podido obtener las actividades del sistema", "error");
        }
    }

    useEffect(() => {
        // Llamada a backend
        if (token) {
            getActivities();
        }

        // setResearchers(mockResearchers);
    }, [token, skip, limit]);


    const handleSeeActivity = (_id) => {
        // Lógica para dar de baja al usuario administrador
        console.log(`Ver actividad _id: ${_id}`);
        router.push(`/activities/${_id}`);
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
                            Actividades del sistema
                        </Typography>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tipo</TableCell>
                                {/* <TableCell>Modelo</TableCell> */}
                                <TableCell>Ruta</TableCell>
                                <TableCell>Contenido petición</TableCell>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activities.map((activity) => (
                                <TableRow key={activity._id}>
                                    <TableCell>{activity.type}</TableCell>
                                    {/* <TableCell>{activity.model}</TableCell> */}
                                    <TableCell>{activity.route}</TableCell>
                                    <TableCell>{JSON.stringify(activity.body)}</TableCell>
                                    <TableCell>{activity.user?.name || ""} {activity.user?.lastname || ""} ({activity.user?.email || ""})</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleSeeActivity(activity._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.875rem' }}
                                        >
                                            Ver detalle
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
