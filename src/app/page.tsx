"use client";
import React, { useState } from "react";
import { seachCustomerByCountry } from "./services/customerService";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

interface Customer {
  customerId: number;
  companyName: string;
  contactName: string;
  phoneNumber: string;
  faxNumber: string;
  country: string;
}

export default function CustomerSearchPage() {
  const [country, setCountry] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!country.trim()) {
      setError("Por favor ingrese un país para buscar.");
      return;
    }

    setError("");
    setHasSearched(true);

    try {
      const data = await seachCustomerByCountry(country.trim());
      setCustomers(data || []);

      if (!data || data.length === 0) {
        setError(`No se encontraron clientes para el país: "${country}"`);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Error al obtener los clientes. Por favor intente nuevamente.");
      setCustomers([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setCountry("");
    setCustomers([]);
    setError("");
    setHasSearched(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2 className="mb-4 text-center">Buscar Clientes por País</h2>

          <div className="card mb-4">
            <div className="card-body">
              <div className="mb-3 d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese el pais"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSearch}
                  disabled={!country.trim()}
                >
                  Buscar
                </button>
                {hasSearched && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={clearSearch}
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <Link href={`/customers/create`} className="text-decoration-none fw-bold">Crear nuevo Cliente</Link>
            </div>
          </div>

          {error && (
            <div
              className="alert alert-warning alert-dismissible fade show"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
                aria-label="Close"
              ></button>
            </div>
          )}

          {customers.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-people-fill me-2"></i>
                  Resultados encontrados: {customers.length} cliente
                  {customers.length !== 1 ? "s" : ""}
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Contacto</th>
                        <th>Teléfono</th>
                        <th>Fax</th>
                        <th>País</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.customerId}>
                          <td>
                            <Link
                              href={`/customers/${customer.customerId}`}
                              className="text-decoration-none fw-bold"
                            >
                              {customer.customerId}
                            </Link>
                          </td>
                          <td>
                            <strong>{customer.companyName}</strong>
                          </td>
                          <td>{customer.contactName || "N/A"}</td>
                          <td>
                            {customer.phoneNumber ? (
                              <a
                                href={`tel:${customer.phoneNumber}`}
                                className="text-decoration-none"
                              >
                                {customer.phoneNumber}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td>{customer.faxNumber || "N/A"}</td>
                          <td>
                            <span className="badge bg-primary">
                              {customer.country}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {hasSearched && customers.length === 0 && !error && (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <p className="text-muted">Intente con otro país</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
