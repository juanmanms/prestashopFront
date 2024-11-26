import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OrdersService from './ordersService';
import { Table, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { stateMapping } from '../../common/utils/OrderUtils';


const TableOrdersPendientes = ({ cliente, setCliente }) => {
    const ordersService = OrdersService();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await ordersService.getPedidosReparto(cliente);
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };
        if (cliente) {
            fetchOrders();
        }
    }, [cliente]);

    const handleStateChange = async (id_order, state) => {
        console.log('Cambio de estado en el pedido', id_order, state);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'IDPedido',
            key: 'IDPedido',
        },
        {
            title: 'Cliente',
            dataIndex: 'Cliente',
            key: 'Cliente',
        },
        {
            title: 'Precio',
            dataIndex: 'TotalPagado',
            key: 'TotalPagado',
        },
        {
            title: 'Estado',
            dataIndex: 'Estado',
            key: 'Estado',
            render: (text, record) => {
                const menuItems = Object.keys(stateMapping).map((state) => ({
                    key: state,
                    label: stateMapping[state],
                }));
                const menuProps = {
                    items: menuItems,
                    onClick: ({ key }) => handleStateChange(record.IDPedido, key),
                };
                return (
                    <Dropdown menu={menuProps}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {stateMapping[text] || text} <DownOutlined />
                        </a>
                    </Dropdown>
                );
            },
        },
    ];

    const totalSum = orders.reduce((sum, order) => sum + parseFloat(order.TotalPagado || 0), 0);

    return (
        <div className='mt-4'>
            <h2 className='text-2xl font-semibold'>Pedidos pendientes por id de cliente: {cliente}</h2>
            {orders.length === 0 ? (
                <p>No hay pedidos pendientes</p>
            ) : (
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="IDPedido"
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={2}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>{totalSum.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={3} />
                        </Table.Summary.Row>
                    )}
                />
            )}
            <button
                onClick={() => setCliente(null)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Volver a Repartos pendientes
            </button>
        </div>
    );
};

TableOrdersPendientes.propTypes = {
    cliente: PropTypes.number,
    setCliente: PropTypes.func.isRequired,
};

export default TableOrdersPendientes;