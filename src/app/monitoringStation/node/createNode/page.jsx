"use client";
import React, { useState } from "react";
import {
  CssBaseline,
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function NodeManagement() {
  const [nodes, setNodes] = useState([]);
  const [newNode, setNewNode] = useState({
    name: "",
    location: "",
    status: "active",
    code: "",
    photos: [],
  });
  const [editingNode, setEditingNode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingNode, setViewingNode] = useState(null);

  const handleNodeInputChange = (e) => {
    const { name, value } = e.target;
    setNewNode({ ...newNode, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewNode({ ...newNode, photos: files });
  };

  const handleNodeSubmit = (e) => {
    e.preventDefault();
    setNodes([...nodes, { ...newNode, id: Date.now(), photos: newNode.photos.map(photo => URL.createObjectURL(photo)) }]);
    setNewNode({
      name: "",
      location: "",
      status: "active",
      code: "",
      photos: [],
    });
  };

  const handleEdit = (node) => {
    setEditingNode(node);
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingNode({ ...editingNode, [name]: value });
  };

  const handleEditSubmit = () => {
    setNodes(nodes.map(node => node.id === editingNode.id ? editingNode : node));
    setIsEditModalOpen(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setNodes(nodes.map(node => node.id === id ? { ...node, status: newStatus } : node));
  };

  const handleView = (node) => {
    setViewingNode(node);
    setIsViewModalOpen(true);
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">
          Gestión de Nodos
        </Typography>

        {/* Formulario para crear nuevo nodo */}
        <Paper elevation={3} sx={{ p: 4, mt: 4, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Crear Nuevo Nodo
          </Typography>
          <form onSubmit={handleNodeSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Nombre del Nodo"
                  value={newNode.name}
                  onChange={handleNodeInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="location"
                  label="Ubicación"
                  value={newNode.location}
                  onChange={handleNodeInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="status"
                    value={newNode.status}
                    onChange={handleNodeInputChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="active">Activo</MenuItem>
                    <MenuItem value="inactive">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="code"
                  label="Código"
                  value={newNode.code}
                  onChange={handleNodeInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="contained" component="span">
                    Subir Fotos
                  </Button>
                </label>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {newNode.photos.length} foto(s) seleccionada(s)
                </Typography>
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Crear Nodo
            </Button>
          </form>
        </Paper>

        {/* Tabla de nodos */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
            Nodos
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Fotos</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell>{node.name}</TableCell>
                  <TableCell>{node.location}</TableCell>
                  <TableCell>{node.status}</TableCell>
                  <TableCell>{node.code}</TableCell>
                  <TableCell>{node.photos.length} foto(s)</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(node)}>Editar</Button>
                    <Button onClick={() => handleView(node)}>Ver</Button>
                    {node.status === 'active' ? (
                      <Button onClick={() => handleStatusChange(node.id, 'inactive')}>Desactivar</Button>
                    ) : (
                      <Button onClick={() => handleStatusChange(node.id, 'active')}>Activar</Button>
                    )}
                    <Button onClick={() => handleStatusChange(node.id, 'retired')}>Dar de baja</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <DialogTitle>Editar Nodo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Nombre"
            value={editingNode?.name || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="location"
            label="Ubicación"
            value={editingNode?.location || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="code"
            label="Código"
            value={editingNode?.code || ''}
            onChange={handleEditInputChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              name="status"
              value={editingNode?.status || ''}
              onChange={handleEditInputChange}
            >
              <MenuItem value="active">Activo</MenuItem>
              <MenuItem value="inactive">Inactivo</MenuItem>
              <MenuItem value="retired">Dado de baja</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleEditSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de visualización */}
      <Dialog open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <DialogTitle>Detalles del Nodo</DialogTitle>
        <DialogContent>
          <Typography>Nombre: {viewingNode?.name}</Typography>
          <Typography>Ubicación: {viewingNode?.location}</Typography>
          <Typography>Estado: {viewingNode?.status}</Typography>
          <Typography>Código: {viewingNode?.code}</Typography>
          <Typography>Número de fotos: {viewingNode?.photos.length}</Typography>
          {/* Aquí podrías añadir una galería de imágenes para mostrar las fotos */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}