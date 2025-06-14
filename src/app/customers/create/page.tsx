"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCustomer } from "../../services/customerService";
import 'bootstrap/dist/css/bootstrap.min.css';


interface Customer {
  companyName: string;
  contactName: string;
  phoneNumber: string;
  faxNumber: string;
  country: string;
}


export default function CreateCustomerPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer>({
    companyName: "",
    contactName: "",
    phoneNumber: "",
    faxNumber: "",
    country: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await createCustomer(customer);
      setSuccess("Cliente creado exitosamente");
      
      setCustomer({
        companyName: "",
        contactName: "",
        phoneNumber: "",
        faxNumber: "",
        country: ""
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
      
    } catch (err: any) {
      setError(`Error al crear el cliente: ${err.response?.data?.message || err.message}`);
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
              <h2 className="mb-1">Crear Nuevo Cliente</h2>
              <p className="text-muted mb-0">Complete todos los campos obligatorios</p>
            </div>
            <Link href="/" className="btn btn-outline-secondary">
              Volver a Clientes
            </Link>
          </div>

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
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
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
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
              <h5 className="mb-0">Información del Cliente</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="companyName" className="form-label">
                      Nombre de la Compania <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="companyName"
                      name="companyName"
                      value={customer.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="contactName" className="form-label">
                      Nombre de Contacto <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contactName"
                      name="contactName"
                      value={customer.contactName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="faxNumber" className="form-label">
                    Numero de Fax <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="faxNumber"
                    name="faxNumber"
                    value={customer.faxNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Numero de Telefono <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={customer.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="country" className="form-label">
                      País <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={customer.country}
                      onChange={handleInputChange}
                      required
                    />
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
                    {loading ? "Guardando..." : "Crear Cliente"}
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