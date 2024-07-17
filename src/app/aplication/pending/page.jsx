"use client";
import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
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

const samplePendingRequests = [
    { id: 1, name: "Solicitud Pendiente 1", date: "2023-07-08" },
    { id: 2, name: "Solicitud Pendiente 2", date: "2023-07-10" },
    { id: 3, name: "Solicitud Pendiente 3", date: "2023-07-12" },
    // Añade más solicitudes pendientes según sea necesario
];

export default function PendingRequests() {
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        // Aquí puedes hacer una llamada a tu API para obtener las solicitudes pendientes
        // Por ahora usaremos datos de ejemplo
        setPendingRequests(samplePendingRequests);
    }, []);

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
                    Solicitudes Pendientes
                </Typography>
                <Box sx={{ mt: 3, width: '100%' }}>
                    <List>
                        {pendingRequests.map((request) => (
                            <React.Fragment key={request.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "primary.main" }}>
                                            <PendingActionsIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={request.name}
                                        secondary={`Fecha: ${request.date}`}
                                    />
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
