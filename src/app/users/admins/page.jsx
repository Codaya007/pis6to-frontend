"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { deleteUserById, getAllUsers } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";
import mensajes from "@/app/components/Mensajes";
import MensajeConfirmacion from "@/app/components/MensajeConfirmacion";

// // Mock data para ejemplo
// const mockAdmins = [
//     {
//         id: 1,
//         avatar: "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png",
//         firstName: "John",
//         lastName: "Doe",
//         email: "john.doe@example.com"
//     },
//     {
//         id: 2,
//         avatar: "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png",
//         firstName: "Jane",
//         lastName: "Doe",
//         email: "jane.doe@example.com"
//     },
// ];

export default function AdminUsers() {
    const [admins, setAdmins] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(null);
    const { token } = useAuth();
    const router = useRouter();

    const getAdmins = async () => {
        const { totalCount, results } = await getAllUsers(token, skip, limit);

        setTotalCount(totalCount)
        setAdmins(results);
    }

    useEffect(() => {
        // Llamada a backend
        if (token) {
            getAdmins();
        }

        // setAdmins(mockAdmins);
    }, [token]);

    const handleCreateAdmin = () => {
        router.push("/users/admins/create");
    };

    const handleUpdateAdmin = (id) => {
        // Lógica para actualizar el usuario administrador
        router.push(`/users/admins/update/${id}`);
    };

    const handleDeleteAdmin = async (id) => {
        // Lógica para dar de baja al usuario administrador
        console.log(`Dando de baja al administrador con ID: ${id}`);

        // setAdmins(admins.filter(admin => admin_.id !== id));
        MensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning").then(async () => {
            try {
                await deleteUserById(token, id);
                await getAdmins();

                mensajes("Éxito", "Usuario eliminado exitosamente", "info");
            } catch (error) {
                console.log(error)
                console.log(error?.response?.data || error.message);

                mensajes("Error en eliminación", error.response?.data?.customMessage || "No se ha podido eliminar el usuario", "error");
            }
        }).catch((error) => {
            console.error(error);
        })
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
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdateAdmin(admin._id)}
                                            sx={{ mr: 1 }}
                                        >
                                            Actualizar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteAdmin(admin._id)}
                                        >
                                            Dar de baja
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
