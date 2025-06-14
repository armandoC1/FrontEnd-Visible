"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getByCustomerId } from "../../services/orderService";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Order {
  orderId: number;
  customerId: number;
  orderDate: string;
  shippedDate: string;
}

export default function CustomerOrdersPage() {
  const params = useParams();
  const customerId = (params.customerId || params.id || params.customer) as string;
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [customerIdNumber, setCustomerIdNumber] = useState<number>(0);

  useEffect(() => {
    if (customerId) {
      const id = parseInt(customerId);
      if (!isNaN(id)) {
        setCustomerIdNumber(id);
        fetchCustomerOrders(id);
      } else {
        setError("ID de cliente inválido");
      }
    } else {
      setError("No se encontró ID de cliente en la URL");
    }
  }, [customerId, params]);

  const fetchCustomerOrders = async (id: number) => {
    try {
      setError("");
      const data = await getByCustomerId(id);
      
      if (data && Array.isArray(data) && data.length > 0) {
        const sortedOrders = data.sort((a: Order, b: Order) => {
          if (!a.shippedDate && !b.shippedDate) return 0;
          if (!a.shippedDate) return 1;
          if (!b.shippedDate) return -1;
          return new Date(b.shippedDate).getTime() - new Date(a.shippedDate).getTime();
        });
        setOrders(sortedOrders);
      } else {
        setOrders([]);
        setError(`No se encontraron órdenes para el cliente ID: ${id}`);
      }
    } catch (err: any) {
      setError(`Error al obtener las órdenes: ${err.response?.data?.message || err.message}`);
      setOrders([]);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Pendiente";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Órdenes del Cliente</h2>
              <p className="text-muted mb-0">Cliente ID: {customerIdNumber}</p>
            </div>
            <Link href="/" className="btn btn-outline-secondary">
              Volver a Búsqueda
            </Link>
          </div>

          {error && (
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError("")}
                aria-label="Close"
              ></button>
            </div>
          )}

          {orders.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Órdenes encontradas: {orders.length}</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer ID</th>
                        <th>Fecha de Orden</th>
                        <th>Fecha de Envío</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.orderId}>
                          <td>
                            <strong className="text-primary">{order.orderId}</strong>
                          </td>
                          <td>
                            <span className="badge bg-secondary">{order.customerId}</span>
                          </td>
                          <td>{formatDate(order.orderDate)}</td>
                          <td>{formatDate(order.shippedDate)}</td>
                          <td>
                            {order.shippedDate ? (
                              <span className="badge bg-success">Enviado</span>
                            ) : (
                              <span className="badge bg-warning text-dark">Pendiente</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {orders.length === 0 && !error && (
            <div className="text-center py-5">
              <p className="text-muted">Este cliente no tiene órdenes registradas</p>
              <Link href="/" className="btn btn-primary mt-3">
                Buscar otro cliente
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}