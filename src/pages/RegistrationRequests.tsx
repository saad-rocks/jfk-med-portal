import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useRole } from "../hooks/useRole";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserPlus, CheckCircle, XCircle, Clock, Mail, Phone, GraduationCap, Briefcase, Calendar } from "lucide-react";
import type { RegistrationRequest } from "../types";

export default function RegistrationRequests() {
  const { role } = useRole();
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const callable = httpsCallable(functions, "getRegistrationRequests");
      const response = await callable({ status: filter === "all" ? null : filter, limit: 100 });
      const data = response.data as any;

      if (data?.ok && Array.isArray(data.requests)) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error loading registration requests:", error);
      setMessage({ text: "Failed to load registration requests", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: RegistrationRequest) => {
    if (!request.id) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const callable = httpsCallable(functions, "approveRegistrationRequest");
      await callable({ requestId: request.id, approvalNotes });

      setMessage({ text: `Successfully approved registration for ${request.name}`, type: 'success' });
      setSelectedRequest(null);
      setApprovalNotes("");
      loadRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      setMessage({ text: "Failed to approve registration request", type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (request: RegistrationRequest) => {
    if (!request.id || !rejectionReason.trim()) {
      setMessage({ text: "Please provide a reason for rejection", type: 'error' });
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const callable = httpsCallable(functions, "rejectRegistrationRequest");
      await callable({ requestId: request.id, rejectionReason });

      setMessage({ text: `Registration request rejected for ${request.name}`, type: 'success' });
      setSelectedRequest(null);
      setRejectionReason("");
      loadRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      setMessage({ text: "Failed to reject registration request", type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "teacher":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { icon: <Clock size={14} />, color: "bg-yellow-100 text-yellow-800", text: "Pending" };
      case "approved":
        return { icon: <CheckCircle size={14} />, color: "bg-green-100 text-green-800", text: "Approved" };
      case "rejected":
        return { icon: <XCircle size={14} />, color: "bg-red-100 text-red-800", text: "Rejected" };
      default:
        return { icon: <Clock size={14} />, color: "bg-gray-100 text-gray-800", text: status };
    }
  };

  if (role !== "admin") {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Access denied. This page is only accessible to administrators.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserPlus className="text-blue-600" size={32} />
            Registration Requests
          </h1>
          <p className="text-gray-600 mt-1">Review and manage user registration requests</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No {filter !== "all" ? filter : ""} registration requests found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => {
            const statusBadge = getStatusBadge(request.status);

            return (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Name and Status */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{request.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(request.role)}`}>
                          {request.role.charAt(0).toUpperCase() + request.role.slice(1)}
                        </span>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                          {statusBadge.icon}
                          {statusBadge.text}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={16} className="text-gray-400" />
                          {request.email}
                        </div>
                        {request.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={16} className="text-gray-400" />
                            {request.phone}
                          </div>
                        )}
                      </div>

                      {/* Role-Specific Info */}
                      {request.role === "student" && (
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <GraduationCap size={16} className="text-gray-400" />
                            <span>MD Year: {request.mdYear || "N/A"}</span>
                          </div>
                          {request.studentId && <span>Student ID: {request.studentId}</span>}
                          {request.gpa && <span>GPA: {request.gpa}</span>}
                        </div>
                      )}

                      {request.role === "teacher" && (
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-gray-400" />
                            <span>Department: {request.department || "N/A"}</span>
                          </div>
                          {request.specialization && <span>Specialization: {request.specialization}</span>}
                          {request.employeeId && <span>Employee ID: {request.employeeId}</span>}
                        </div>
                      )}

                      {/* Timestamps */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} />
                        Requested: {formatDate(request.requestedAt)}
                        {request.reviewedAt && (
                          <span className="ml-4">
                            Reviewed: {formatDate(request.reviewedAt)}
                            {request.reviewerName && ` by ${request.reviewerName}`}
                          </span>
                        )}
                      </div>

                      {/* Rejection Reason */}
                      {request.status === "rejected" && request.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                          <strong>Rejection Reason:</strong> {request.rejectionReason}
                        </div>
                      )}

                      {/* Approval Notes */}
                      {request.status === "approved" && request.approvalNotes && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                          <strong>Approval Notes:</strong> {request.approvalNotes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedRequest(request)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedRequest(request);
                            setRejectionReason("");
                          }}
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <XCircle size={16} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Approval/Rejection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedRequest.status === "pending" && rejectionReason === "" ? "Approve" : "Reject"} Registration Request
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Name:</strong> {selectedRequest.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Email:</strong> {selectedRequest.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Role:</strong> {selectedRequest.role}
                </p>
              </div>

              {rejectionReason === "" && selectedRequest.status === "pending" ? (
                <>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Approval Notes (Optional)
                    </label>
                    <textarea
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      placeholder="Add any notes about this approval..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setSelectedRequest(null);
                        setApprovalNotes("");
                      }}
                      variant="outline"
                      className="flex-1"
                      disabled={actionLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedRequest)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Processing..." : "Confirm Approval"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Rejection Reason *
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a reason for rejection..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setSelectedRequest(null);
                        setRejectionReason("");
                      }}
                      variant="outline"
                      className="flex-1"
                      disabled={actionLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedRequest)}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={actionLoading || !rejectionReason.trim()}
                    >
                      {actionLoading ? "Processing..." : "Confirm Rejection"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
