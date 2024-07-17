"use client";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  Modal,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAdmins(mockAdmins);
  }, []);

  const handleUpdateAdmin = (id) => {
    router.push(`/users/admins/update/${id}`);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
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
              Usuarios Particulares
            </Typography>
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.firstName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateAdmin(admin.id)}
                      sx={{ mr: 1 }}
                    >
                      Bloquear
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleViewUser(admin)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="user-modal-title"
        aria-describedby="user-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedUser && (
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={selectedUser.avatarUrl}
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {selectedUser.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ID: {selectedUser.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Nombre de usuario: {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
                
              </CardContent>
            </Card>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal}>Cerrar</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}