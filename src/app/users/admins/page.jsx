"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Container, Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

// Mock data para ejemplo
const mockAdmins = [
    {
        id: 1,
        avatarUrl: "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com"
    },
    {
        id: 2,
        avatarUrl: "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com"
    },
];

export default function AdminUsers() {
    const [admins, setAdmins] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // TODO: Reemplazar con una llamada a backend
        setAdmins(mockAdmins);
    }, []);

    const handleCreateAdmin = () => {
        router.push("/users/admins/create");
    };

    const handleUpdateAdmin = (id) => {
        // Lógica para actualizar el usuario administrador
        router.push(`/users/admins/update/${id}`);
    };

    const handleDeleteAdmin = (id) => {
        // Lógica para dar de baja al usuario administrador
        console.log(`Dando de baja al administrador con ID: ${id}`);
        // TODO:  llamada al backend para eliminar al usuario
        setAdmins(admins.filter(admin => admin.id !== id));
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
                                <TableRow key={admin.id}>
                                    <TableCell>
                                        <Avatar src={admin.avatarUrl} alt={admin.firstName} />
                                    </TableCell>
                                    <TableCell>{admin.firstName}</TableCell>
                                    <TableCell>{admin.lastName}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdateAdmin(admin.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            Actualizar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteAdmin(admin.id)}
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
