// src/Components/Complaint.tsx

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { AlertCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

interface ComplaintForm {
  subject: string;
  description: string;
  telephoneNo: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const Complaint: React.FC = () => {
  const [form, setForm] = useState<ComplaintForm>({
    subject: "",
    description: "",
    telephoneNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Typed change handler for both <input> and <textarea>
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Typed submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Get the stored token

      const res = await axios.post<ApiResponse>(
        "http://localhost:8082/api/complaint/save",
        {
          subject: form.subject,
          description: form.description,
          telephoneNo: form.telephoneNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setSuccess("Complaint submitted successfully! We will address it soon.");
        setForm({ subject: "", description: "", telephoneNo: "" });
      } else {
        setError(res.data.message || "Failed to submit complaint.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 gap-8 p-8">
        {/* Left: Form Section */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center mb-4">
            <AlertCircle className="text-blue-600 h-8 w-8 mr-2" />
            <h2 className="text-3xl font-bold text-blue-700">
              Submit a Complaint
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            We value your feedback. Please describe your issue below and our team
            will address it promptly.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="subject"
                className="block text-gray-700 font-medium mb-1"
              >
                Subject <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Eg: Water supply issue"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-1"
              >
                Complaint Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                placeholder="Describe your complaint in detail..."
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-gray-700 font-medium mb-1"
              >
                Contact Number <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="contact"
                name="telephoneNo"
                type="text"
                value={form.telephoneNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Eg: 07X XXX XXXX"
              />
            </div>
            {error && <div className="text-red-600 font-medium">{error}</div>}
            {success && (
              <div className="text-green-600 font-medium">{success}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-60"
            >
              <Send className="mr-2 h-5 w-5" />
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
          <div className="mt-6 text-sm text-gray-500">
            <Link to="/home" className="text-blue-600 hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
        {/* Right: Illustration Section */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src="https://cdn.pixabay.com/photo/2016/11/29/03/53/architecture-1868667_1280.jpg"
            alt="Complaint Illustration"
            className="rounded-2xl shadow-lg object-cover w-full h-96"
          />
        </div>
      </div>
    </div>
  );
};

export default Complaint;
