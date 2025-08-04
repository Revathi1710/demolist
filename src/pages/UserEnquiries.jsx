import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./UserEnquiries.css";

const UserEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("No user ID found in localStorage");
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/getenquiriesbyuserid/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setEnquiries(data.data);
        } else {
          setError(data.message);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "status-badge status-pending",
      approved: "status-badge status-approved",
      rejected: "status-badge status-rejected",
      completed: "status-badge status-completed",
    };
    return statusClasses[status?.toLowerCase()] || "status-badge status-default";
  };

  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading your enquiries...</p>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Oops! Something went wrong</h3>
      <p>{message}</p>
    </div>
  );

  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">📋</div>
      <h3>No Enquiries Found</h3>
      <p>You haven't made any enquiries yet. Start exploring products to make your first enquiry!</p>
    </div>
  );

  return (
    <div className="user-enquiries-page">
      <Navbar />
      
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Enquiries</h1>
          <p className="page-subtitle">Track the status of your product enquiries</p>
        </div>

        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}
        
        {!loading && !error && enquiries.length === 0 && <EmptyState />}
        
        {!loading && !error && enquiries.length > 0 && (
          <div className="enquiries-grid">
            {enquiries.map((enquiry, index) => (
              <div key={index} className="enquiry-card">
                <div className="card-header">
                  <h3 className="product-name">{enquiry.productname}</h3>
                  <span className={getStatusBadge(enquiry.status)}>
                    {enquiry.status || 'Pending'}
                  </span>
                </div>
                
                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Price:</span>
                    <span className="info-value price">₹{enquiry.productPrice?.toLocaleString() || 'N/A'}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Vendor:</span>
                    <span className="info-value">{enquiry.vendorId?.businessName || "N/A"}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Enquiry Date:</span>
                    <span className="info-value">
                      {enquiry.createdAt 
                        ? new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="card-footer">
                  <button className="btn-secondary">View Details</button>
                  <button className="btn-primary">Contact Vendor</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEnquiries;