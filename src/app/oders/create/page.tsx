"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrders } from "../../services/orderService";
import { getAllCustomers } from "../../services/customerService";
import "bootstrap/dist/css/bootstrap.min.css";

interface Order {
  orderDate: string;
  shippedDate: string;
  customerId: number;
}

interface Customer {
  customerId: number;
  companyName: string;
  contactName: string;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order>({
    orderDate: "",
    shippedDate: "",
    customerId: 0,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await getAllCustomers();
        setCustomers(customersData);
      } catch (error) {
        setError("Error al cargar la lista de clientes");
      }
    };

    fetchCustomers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "orderDate" || name === "shippedDate") {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const dateTime = `${value}T${hours}:${minutes}:${seconds}`;

      setOrder((prev) => ({
        ...prev,
        [name]: dateTime,
      }));
    } else {
      setOrder((prev) => ({
        ...prev,
        [name]: name === "customerId" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!order.orderDate || !order.shippedDate || order.customerId === 0) {
      setError("Por favor complete todos los campos obligatorios");
      setLoading(false);
      return;
    }

    if (new Date(order.shippedDate) <= new Date(order.orderDate)) {
      setError("La fecha de envío debe ser posterior a la fecha de orden");
      setLoading(false);
      return;
    }

    try {
      const result = await createOrders(order);
      setSuccess("Orden creada exitosamente");

      setOrder({
        orderDate: "",
        shippedDate: "",
        customerId: 0,
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(
        `Error al crear la orden: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Crear Nueva Orden</h2>
              <p className="text-muted mb-0">
                Complete todos los campos obligatorios
              </p>
            </div>
            <Link href="/" className="btn btn-outline-secondary">
              Volver
            </Link>
          </div>

          {success && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess("")}
                aria-label="Close"
              ></button>
            </div>
          )}

          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
                aria-label="Close"
              ></button>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Información de la Orden</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="customerId" className="form-label">
                      Cliente <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="customerId"
                      name="customerId"
                      value={order.customerId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={0}>Seleccione un cliente</option>
                      {customers.map((customer) => (
                        <option
                          key={`customer-${customer.customerId}`}
                          value={customer.customerId}
                        >
                          {customer.companyName} - {customer.contactName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="orderDate" className="form-label">
                      Fecha de Orden <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="orderDate"
                      name="orderDate"
                      value={order.orderDate.split('T')[0] || ""}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="shippedDate" className="form-label">
                    Fecha de Envío <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="shippedDate"
                    name="shippedDate"
                    value={order.shippedDate.split('T')[0] || ""}
                    onChange={handleInputChange}
                    min={
                      order.orderDate || new Date().toISOString().split("T")[0]
                    }
                    required
                  />
                  <div className="form-text">
                    La fecha de envío debe ser posterior a la fecha de orden
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link href="/" className="btn btn-secondary me-md-2">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Crear Orden"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
