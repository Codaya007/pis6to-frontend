"use client";
import { useAuth } from "@/context/AuthContext";
import { deleteNode, getAllNodes } from "@/services/nodes.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import mensajeConfirmacion from "../components/MensajeConfirmacion";
import { WithAuth } from "../components/WithAuth";

const MotaCard = ({ tag, detail: description, ip, estado: connected, id, token, refreshMotas }) => {
  const router = useRouter();

  const handleUpdateMota = () => {
    router.push(`/mota/update/${id}`);
  }

  const handleDeleteMota = async () => {
    try {
      const confirmation = await mensajeConfirmacion("Esta acción es irreversible. ¿Desea continuar?", "Confirmación", "warning");

      if (confirmation) {
        await deleteNode(id, token);

        await refreshMotas();
      }
    } catch (error) {
      console.log({ error });
    }
  }

  return <article className="user-card">
    <div className="buttons">
      <button onClick={handleUpdateMota}>Editar</button>
      <button style={{ color: "#a31818" }} onClick={handleDeleteMota}>Eliminar</button>
    </div>
    <h2>{tag}</h2>
    <p className="text-primary">{description}</p>
    <p className="text-primary">IP: {ip}</p>
    <div className="container-dot">
      <span className="dot" style={{ backgroundColor: connected ? "green" : "red" }}></span>
      <p>{connected ? "Conectado" : "Desconectado"}</p>
    </div>
  </article>
}

function MotaDashboard() {
  const { token } = useAuth();
  const [nodes, setNodes] = useState([]);

  const fetchNodes = async () => {
    const { results: allNodes } = await getAllNodes(token)

    setNodes(allNodes);
  }

  useEffect(() => {
    if (token) {

      fetchNodes()
    } else {
      setNodes([])
    }
  }, [token]);

  return (
    <div className="main-container vertical-top">
      <section className="buttons">
        <button className="button-primary">
          <Link href={"mota/create"}>+ Nueva conexión</Link>
        </button>
      </section>
      <section className="items-container">
        {
          nodes.map(mota => <MotaCard {...mota} token={token} refreshMotas={fetchNodes} key={mota.id} />)
        }
      </section>
    </div>
  );
}

export default WithAuth(MotaDashboard)