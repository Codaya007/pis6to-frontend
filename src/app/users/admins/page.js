"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { deleteUserById, getAllUsers, updateUser } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";
import mensajes from "@/app/components/Mensajes";
import MensajeConfirmacion from "@/app/components/MensajeConfirmacion";
import { ACTIVE_USER_STATUS, BLOQUED_USER_STATUS } from "@/constants";
import CustomPagination from "@/app/components/CustomPagination";

export default function AdminUsers() {
    const [admins, setAdmins] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const { token } = useAuth();
    const router = useRouter();

    const getAdmins = async () => {
        const { totalCount, results } = await getAllUsers(token, skip, limit);
        setTotalCount(totalCount);
        setAdmins(results);
    };

    useEffect(() => {
        if (token) {
            getAdmins();
        }
    }, [token, skip]);

    const handleCreateAdmin = () => {
        router.push("/users/admins/create");
    };

    const handleUpdateAdmin = (id) => {
        router.push(`/users/admins/update/${id}`);
    };

    const handleUpdateUserStatus = async (id, state) => {
        try {
            await updateUser(id, { state }, token);
            await getAdmins();
            mensajes("Éxito", "Usuario actualizado exitosamente", "info");
        } catch (error) {
            console.log(error);
            console.log(error?.response?.data || error.message);
            mensajes("Error en actualización", error.response?.data?.customMessage || "No se ha podido actualizar el usuario", "error");
        }
    };

    const handleDeleteAdmin = async (id) => {
        MensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning")
            .then(async () => {
                try {
                    await deleteUserById(token, id);
                    await getAdmins();
                    mensajes("Éxito", "Usuario eliminado exitosamente", "info");
                } catch (error) {
                    console.log(error);
                    console.log(error?.response?.data || error.message);
                    mensajes("Error en eliminación", error.response?.data?.customMessage || "No se ha podido eliminar el usuario", "error");
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
                            Usuarios Administradores
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleCreateAdmin}>
                            Crear Administrador
                        </Button>
                    </Grid>
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
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins.map((admin) => (
                                <TableRow key={admin._id}>
                                    <TableCell>
                                        <Avatar src={admin.avatar} alt={admin.firstName} />
                                    </TableCell>
                                    <TableCell>{admin.name}</TableCell>
                                    <TableCell>{admin.lastname}</TableCell>
                                    <TableCell>{admin.state}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleUpdateAdmin(admin._id)}
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            Actualizar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() =>
                                                handleUpdateUserStatus(admin._id, admin.state === BLOQUED_USER_STATUS ? ACTIVE_USER_STATUS : BLOQUED_USER_STATUS)
                                            }
                                            sx={{ mr: 1, mb: 1, textTransform: "none", fontSize: "0.875rem" }}
                                        >
                                            {admin.state === BLOQUED_USER_STATUS ? "Desbloquear" : "Bloquear"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeleteAdmin(admin._id)}
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
