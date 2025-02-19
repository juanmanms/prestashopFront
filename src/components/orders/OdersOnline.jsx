import { useEffect, useState } from 'react';
import { Button, Table, message } from 'antd';
import { useSelector } from "react-redux";
import OrdersService from './ordersService';
import { stateMapping } from '../../common/utils/OrderUtils';

export const OdersOnline = () => {
    const user = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [lineasPedido, setLineasPedido] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            const ordersService = OrdersService();
            let data;
            try {
                if (user.id_seller === "") {
                    data = await ordersService.getOrdersOnline();
                } else {
                    data = await ordersService.getOrdersOnlineBySeller(user.id_seller);
                }
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                message.error('Error fetching orders');
            }
        };

        fetchOrders();
    }, [user]);

    const fetchLineasPedido = async (idPedido) => {
        const ordersService = OrdersService();
        try {
            const data = await ordersService.getLineasPedido(idPedido);
            setLineasPedido(prevState => ({
                ...prevState,
                [idPedido]: data
            }));
        } catch (error) {
            console.error('Error fetching lineas pedido:', error);
            message.error('Error fetching lineas pedido');
        }
    };

    const columns = [
        {
            title: "ID Pedido",
            dataIndex: "IDPedido",
            key: "IDPedido",
        },
        {
            title: "Fecha Pedido",
            dataIndex: "FechaPedido",
            key: "FechaPedido",
            render: (text) => new Date(text).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        },
        {
            title: "Cliente",
            dataIndex: "Cliente",
            key: "Cliente",
        },
        {
            title: "Total sin portes",
            dataIndex: "TotalSinIva",
            key: "TotalSinIva",
            render: (value) => parseFloat(value).toFixed(2),
        },
        {
            title: "Total con portes",
            dataIndex: "TotalPagadoconIVA",
            key: "TotalPagadoconIVA",
            render: (value) => parseFloat(value).toFixed(2),
        },
        {
            title: "Portes",
            dataIndex: "TotalEnvíoconIVA",
            key: "TotalEnvíoconIVA",
            render: (value) => parseFloat(value).toFixed(2),
        },
        {
            title: "Estado Pedido",
            dataIndex: "EstadoPedido",
            key: "EstadoPedido",
            render: (state, IDPedido) => {
                const isDisabled = [6, 26, 27, 30].includes(state);
                return (
                    <Button
                        disabled={isDisabled}
                        className={`px-2 py-1 rounded ${isDisabled ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                        onClick={() => {
                            console.log(IDPedido);
                            // changeState(order['Id Pedido']);
                        }}
                    >
                        {stateMapping[state] || 'Desconocido'}
                    </Button>
                );
            }
        },
    ];

    const lineasColumns = [
        {
            title: "ID Producto",
            dataIndex: "IDProducto",
            key: "IDProducto",
        },
        {
            title: "Nombre Producto",
            dataIndex: "NombreProducto",
            key: "NombreProducto",
        },
        {
            title: "Cantidad",
            dataIndex: "Cantidad",
            key: "Cantidad",
        },
        {
            title: "Precio Unitario (sin IVA)",
            dataIndex: "PrecioUnitario",
            key: "PrecioUnitario",
            render: (value) => parseFloat(value).toFixed(2),
        },
        {
            title: "Total con IVA",
            dataIndex: "PrecioTotal",
            key: "PrecioTotal",
            render: (value) => parseFloat(value).toFixed(2),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="IDPedido"
                pagination={false}
                scroll={{ x: 1000 }}
                expandable={{
                    expandedRowRender: record => {
                        if (!lineasPedido[record.IDPedido]) {
                            fetchLineasPedido(record.IDPedido);
                        }
                        const lineas = lineasPedido[record.IDPedido] || [];
                        const totalPrecioTotal = lineas.reduce((sum, item) => sum + parseFloat(item.PrecioTotal), 0).toFixed(2);
                        return (
                            <Table
                                columns={lineasColumns}
                                dataSource={lineas}
                                pagination={false}
                                rowKey="IDProducto"
                                summary={() => (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell colSpan={4}>Total</Table.Summary.Cell>
                                        <Table.Summary.Cell>{totalPrecioTotal}</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )}
                            />
                        );
                    },
                }}
            />
        </div>
    );
};