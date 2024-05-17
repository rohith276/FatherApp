import React, { useState, useEffect } from "react";
import axios from "axios";

const RefundRequests = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        const response = await axios.get("http://localhost:6001/refund");

        setRefundRequests(response.data);
      } catch (error) {
        setError("Error fetching refund requests. Please try again later.");
      }
    };

    fetchRefundRequests();
  }, []);

  return (
    <div>
      <h1>Refund Requests</h1>
      {error && <p>{error}</p>}
      <ul>
        {refundRequests.map((request, index) => (
          <li key={index}>
            <p>Transaction ID: {request.transactionId}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RefundRequests;
