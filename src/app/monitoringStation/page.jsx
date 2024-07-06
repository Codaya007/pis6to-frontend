"use client";
import { useAuth } from "@/context/AuthContext";
// import { deleteNode, getAllNodes } from "@/services/nodes.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import mensajeConfirmacion from "../components/MensajeConfirmacion";
// import { WithAuth } from "../components/WithAuth";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
const MonitoringStationCard = ({ nombre, reference, photos, nomenclature, estado: connected, id, token, refreshMotas }) => {
  const router = useRouter();

  const handleUpdateStation = () => {
    router.push(`/monitoringStation/update/${id}`);
  }

  const handleDeleteStation = async () => {
    try {
      const confirmation = await mensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning");

      if (confirmation) {
        // await deleteNode(id, token);

        // await refreshMotas();
      }
    } catch (error) {
      console.log({ error });
    }
  }

  return <article className="user-card">
    <div className="buttons">
      <button onClick={handleUpdateStation}>Editar</button>
      <button style={{ color: "#a31818" }} onClick={handleDeleteStation}>Eliminar</button>
    </div>
    <h2>{nombre}</h2>
    <p className="text-primary">{reference}</p>
    <p className="text-primary">Nomenclatura: {nomenclature}</p>
    <p className="text-primary">Fotos: {photos}</p>
    <div className="container-dot">
      <span className="dot" style={{ backgroundColor: connected ? "green" : "red" }}></span>
      <p>{connected ? "Conectado" : "Desconectado"}</p>
    </div>
  </article>
}
const ImgMediaCard = ({ nombre, reference, photos, nomenclature, estado: connected, id, token, refreshMotas }) => {
    const router = useRouter();
    const handleUpdateMota = () => {
        router.push(`/monitoringStation/update/${id}`);
    }

    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
        //   image="../../utils/estacionPrueba.jpg"
        image="https://integracionav.com/wp-content/uploads/2020/03/centro-de-monitoreo.jpeg"

        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Referencia: {reference}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nomenclatura: {nomenclature}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" color="success" onClick={handleUpdateMota}>Editar</Button>
          <Button size="small" variant="contained" color="error">Eliminar</Button>
        </CardActions>
      </Card>
    );
}

export default function MonitoringStationDashboard() {
  const { token } = useAuth();
  const [stations, setStations] = useState([]);
  const router = useRouter();
  const fetchNodes = async () => {
//     const { results: allNodes } = await getAllNodes(token)

//     setNodes(allNodes);
  }

  useEffect(() => {
    if (token) {

    //   fetchNodes()
    } else {
    //   setStations([])
      setStations([{id: 1, name: "Station 1", reference: "Ref1", photos:"Ph1", nomenclature: "nomen1" },
        {id: 2, name: "Station 2", reference: "Ref2", photos:"Ph2", nomenclature: "nomen2" }
      ])
    }
  }, [token]);
  const addMonitoringStation = (e) => {
    e.preventDefault();
    router.push("/monitoringStation/create");
  }
  return (
    <div className="main-container vertical-top">
      <section className="buttons">
        <Button type="button" fullWidth variant="contained" onClick={addMonitoringStation} sx={{ mt: 3, mb: 2 }}>
                + Nueva estación de monitoreo
        </Button> 
      </section>
      <section className="items-container">
        {
          stations.map(station => <ImgMediaCard {...station} token={token} refreshMotas={fetchNodes} key={station.id} />)
        }
      </section>
    </div>
  );
}

// export default WithAuth(MonitoringStationDashboard)