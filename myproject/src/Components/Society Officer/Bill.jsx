import React, { useState } from "react";

const BillForm = () => {
  const [formData, setFormData] = useState({
    accountNo: "",
    meterNo: "",
    name: "",
    address: "",
    date: "",
    presentReading: "",
    previousReading: "",
    unitConsumed: "",
    fixedAmount: "",
    totalBill: "",
    additionalCharges: "",
    surcharge: "",
    otherCharges: "",
    balanceDue: "",
    totalAmountDue: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}>
      <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md w-[80%] max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-4">Bill Generate</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <label className="block text-gray-700">Account No.:</label>
              <input type="text" name="accountNo" value={formData.accountNo} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Address:</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Present Reading:</label>
              <input type="text" name="presentReading" value={formData.presentReading} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Previous Reading:</label>
              <input type="text" name="previousReading" value={formData.previousReading} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Unit Consumed:</label>
              <input type="text" name="unitConsumed" value={formData.unitConsumed} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Fixed Amount:</label>
              <input type="text" name="fixedAmount" value={formData.fixedAmount} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Total Water Bill:</label>
              <input type="text" name="totalBill" value={formData.totalBill} onChange={handleChange} className="input-field" />
            </div>

            {/* Right Column */}
            <div>
              <label className="block text-gray-700">Meter No.:</label>
              <input type="text" name="meterNo" value={formData.meterNo} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" />

              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-700">IOT Device:</span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-600">Active</span>
              </div>

              <label className="block text-gray-700">Additional Charges:</label>
              <input type="text" name="additionalCharges" value={formData.additionalCharges} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Surcharge:</label>
              <input type="text" name="surcharge" value={formData.surcharge} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Other Charges:</label>
              <input type="text" name="otherCharges" value={formData.otherCharges} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Balance Due at Date:</label>
              <input type="text" name="balanceDue" value={formData.balanceDue} onChange={handleChange} className="input-field" />

              <label className="block text-gray-700">Total Amount Due:</label>
              <input type="text" name="totalAmountDue" value={formData.totalAmountDue} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillForm;
