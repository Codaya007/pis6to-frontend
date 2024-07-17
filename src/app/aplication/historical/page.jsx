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
import HistoryIcon from "@mui/icons-material/History";
import Button from "@mui/material/Button";

const sampleRequests = [
    { id: 1, name: "Solicitud 1", date: "2023-06-01" },
    { id: 2, name: "Solicitud 2", date: "2023-06-15" },
    { id: 3, name: "Solicitud 3", date: "2023-07-01" },
    
];

export default function HistoricalRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Metodoss
    
        setRequests(sampleRequests);
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
                    <HistoryIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Solicitudes Históricas
                </Typography>
                <Box sx={{ mt: 3, width: '100%' }}>
                    <List>
                        {requests.map((request) => (
                            <React.Fragment key={request.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "primary.main" }}>
                                            <HistoryIcon />
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
