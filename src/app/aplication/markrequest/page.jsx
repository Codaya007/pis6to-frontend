"use client";
import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const samplePendingRequests = [
    { id: 1, name: "Solicitud Pendiente 1", date: "2023-07-08", status: "pending" },
    { id: 2, name: "Solicitud Pendiente 2", date: "2023-07-10", status: "pending" },
    { id: 3, name: "Solicitud Pendiente 3", date: "2023-07-12", status: "pending" },
    // Añade más solicitudes pendientes según sea necesario
];

export default function ManageRequests() {
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        // Aquí puedes hacer una llamada a tu API para obtener las solicitudes pendientes
        // Por ahora usaremos datos de ejemplo
        setPendingRequests(samplePendingRequests);
    }, []);

    const handleAccept = (id) => {
        // Aquí puedes agregar la lógica para marcar la solicitud como aceptada
        console.log(`Solicitud ${id} aceptada`);
        setPendingRequests(pendingRequests.map(request =>
            request.id === id ? { ...request, status: "accepted" } : request
        ));
    };

    const handleCancel = (id) => {
        // Aquí puedes agregar la lógica para marcar la solicitud como cancelada
        console.log(`Solicitud ${id} cancelada`);
        setPendingRequests(pendingRequests.map(request =>
            request.id === id ? { ...request, status: "cancelled" } : request
        ));
    };

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <PendingActionsIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Gestionar Solicitudes Pendientes
                </Typography>
                <Box sx={{ mt: 3, width: '100%' }}>
                    <List>
                        {pendingRequests.map((request) => (
                            <React.Fragment key={request.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{
                                        backgroundColor: request.status === "accepted" ? "#d4edda" :
                                            request.status === "cancelled" ? "#f8d7da" : "inherit",
                                        color: request.status !== "pending" ? "inherit" : "inherit"
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "primary.main" }}>
                                            <PendingActionsIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={request.name}
                                        secondary={`Fecha: ${request.date}`}
                                    />
                                    {request.status === "pending" && (
                                        <>
                                            <IconButton edge="end" aria-label="accept" onClick={() => handleAccept(request.id)}>
                                                <CheckCircleIcon color="success" />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="cancel" onClick={() => handleCancel(request.id)}>
                                                <CancelIcon color="error" />
                                            </IconButton>
                                        </>
                                    )}
                                    {request.status === "accepted" && (
                                        <Typography variant="body2" sx={{ color: "green", ml: 2 }}>
                                            Aceptada
                                        </Typography>
                                    )}
                                    {request.status === "cancelled" && (
                                        <Typography variant="body2" sx={{ color: "red", ml: 2 }}>
                                            Cancelada
                                        </Typography>
                                    )}
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
                
            </Box>
        </Container>
    );
}
