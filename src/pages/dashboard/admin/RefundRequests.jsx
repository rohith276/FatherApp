import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const RefundRequests = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        const response = await axiosSecure.get("/refund");
        setRefundRequests(response.data.data || []);
      } catch (error) {
        setError("Error fetching refund requests. Please try again later.");
      }
    };

    fetchRefundRequests();
  }, [axiosSecure]);

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Refund <span className="text-green">Requests</span>
      </h2>
      {error && <p className="text-red">{error}</p>}
      {refundRequests.length === 0 && !error ? (
        <p className="text-center mt-10 text-secondary">No refund requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-green text-white rounded-sm">
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
                <th>Email</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {refundRequests.map((request, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{request.transactionId}</td>
                  <td>{request.email || "N/A"}</td>
                  <td>{request.status || "pending"}</td>
                  <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RefundRequests;
