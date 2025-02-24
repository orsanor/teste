import { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";
import { TextField, Select, MenuItem, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditUserModal from "../components/EditUserModal";
import EditClientModal from "../components/EditClientModal";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function List() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewType, setViewType] = useState("users");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewType]);

    const getData = () => {
        setLoading(true);
        const endpoint = viewType === "users" ? "/users" : "/clients";
        axiosClient
            .get(endpoint)
            .then(({ data }) => {
                const responseData = Array.isArray(data.data)
                    ? data.data
                    : data;
                setData(responseData || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar dados:", err);
                toast.error("Erro ao carregar dados");
                setData([]);
                setLoading(false);
            });
    };

    console.log(data);

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (item) => {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            const endpoint =
                viewType === "users"
                    ? `/users/${item.id}`
                    : `/clients/${item.id}`;
            setLoading(true);
            axiosClient
                .delete(endpoint)
                .then(() => {
                    toast.success("Item excluído com sucesso!");
                    getData();
                })
                .catch((error) => {
                    console.error("Erro ao excluir:", error);
                    toast.error("Erro ao excluir item");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleEdit = (item) => {
        setSelectedClient(item);
        setSelectedUser(item);
        setModalOpen(true);
    };

    const handleSave = (formData) => {
        const endpoint =
            viewType === "users"
                ? `/users/${selectedUser.id}`
                : `/clients/${selectedUser.id}`;
        setLoading(true);
        axiosClient
            .put(endpoint, formData)
            .then(() => {
                toast.success("Dados atualizados com sucesso!");
                getData();
                setModalOpen(false);
            })
            .catch((error) => {
                console.error("Erro ao atualizar:", error);
                toast.error("Erro ao atualizar dados");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const renderTable = () => {
        if (viewType === "users") {
            return (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Data de Criação</th>
                                <th>Data de Atualização</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading}
                            {!loading &&
                                filteredData.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            {new Date(
                                                user.updated_at
                                            ).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() => handleEdit(user)}
                                                variant="contained"
                                                size="small"
                                            >
                                                Editar
                                            </Button>
                                            &nbsp;
                                            <Button
                                                onClick={() =>
                                                    handleDelete(user)
                                                }
                                                variant="contained"
                                                color="error"
                                                size="small"
                                            >
                                                Excluir
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <EditUserModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        user={selectedUser}
                        onSave={handleSave}
                    />
                </>
            );
        }

        return (
            <>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>CEP</th>
                            <th>Endereço</th>
                            <th>Telefone</th>
                            <th>Data de Criação</th>
                            <th>Data de Atualização</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading}
                        {!loading &&
                            filteredData.map((client) => (
                                <tr key={client.id}>
                                    <td>{client.name}</td>
                                    <td>{client.email}</td>
                                    <td>{client.cep}</td>
                                    <td>{client.address}</td>
                                    <td>{client.phone_number}</td>
                                    <td>
                                        {new Date(
                                            client.created_at
                                        ).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td>
                                        {new Date(
                                            client.updated_at
                                        ).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => handleEdit(client)}
                                            variant="contained"
                                            size="small"
                                        >
                                            Editar
                                        </Button>
                                        &nbsp;
                                        <Button
                                            onClick={() => handleDelete(client)}
                                            variant="contained"
                                            color="error"
                                            size="small"
                                        >
                                            Excluir
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <EditClientModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    client={selectedClient}
                    onSave={handleSave}
                />
            </>
        );
    };

    return (
        <div>
            <ToastContainer />
            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                        }}
                    >
                        <Select
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value)}
                            style={{ minWidth: "110px" }}
                            size="small"
                        >
                            <MenuItem value="users">Usuários</MenuItem>
                            <MenuItem value="clients">Clientes</MenuItem>
                        </Select>
                        <TextField
                            placeholder="Pesquisar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() =>
                                navigate(
                                    `/Forms?type=${
                                        viewType === "users" ? "user" : "client"
                                    }`
                                )
                            }
                        >
                            Novo {viewType === "users" ? "Usuário" : "Cliente"}{" "}
                            +
                        </Button>
                    </div>
                </div>
                <div className="card animated fadeIndown">{renderTable()}</div>
            </div>
        </div>
    );
}
