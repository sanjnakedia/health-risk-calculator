"use client"

import { useState } from "react"

export default function HealthRiskCalculator() {
  const [metrics, setMetrics] = useState({
    age: 0,
    gender: "",
    race: "",
    bloodPressure_systolic: 0,
    bloodPressure_diastolic: 0,
    bloodSugar: 0,
    cholesterol_HDL: 0,
    cholesterol_LDL: 0,
    cholesterol_TOT: 0,
    smokingStatus: "",
    smokingFreq: "",
    diabetesStatus: "",
    hypertensionTreatment: "",
  })
  const [riskScore, setRiskScore] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setMetrics((prev) => ({
      ...prev,
      [name]: ["age", "bloodPressure_systolic", "bloodPressure_diastolic", "bloodSugar", "cholesterol_HDL", "cholesterol_LDL", "cholesterol_TOT"].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  const computeTenYearScore = () => {
    const {
      age,
      gender,
      race,
      bloodPressure_systolic,
      cholesterol_TOT,
      cholesterol_HDL,
      smokingStatus,
      diabetesStatus,
      hypertensionTreatment,
    } = metrics

    if (!age || !gender || !race || !bloodPressure_systolic || 
        !cholesterol_TOT || !cholesterol_HDL || !smokingStatus || 
        !diabetesStatus || !hypertensionTreatment) {
      return null;
    }

    if (age < 40 || age > 79) {
      return null;
    }

    const lnAge = Math.log(age);
    const lnTotalChol = Math.log(cholesterol_TOT);
    const lnHdl = Math.log(cholesterol_HDL);
    const lnSbp = Math.log(bloodPressure_systolic);
    
    const trlnsbp = hypertensionTreatment === "yes" ? lnSbp : 0;
    const ntlnsbp = hypertensionTreatment === "yes" ? 0 : lnSbp;

    const ageTotalChol = lnAge * lnTotalChol;
    const ageHdl = lnAge * lnHdl;
    const agetSbp = lnAge * trlnsbp;
    const agentSbp = lnAge * ntlnsbp;
    const ageSmoke = smokingStatus === "current" ? lnAge : 0;

    let s010Ret, mnxbRet, predictRet

    if (race === "black" && gender === "female") {
      s010Ret = 0.95334
      mnxbRet = 86.6081
      predictRet = (
        17.1141 * lnAge +
        0.9396 * lnTotalChol +
        -18.9196 * lnHdl +
        4.4748 * ageHdl +
        29.2907 * trlnsbp +
        -6.4321 * agetSbp +
        27.8197 * ntlnsbp +
        -6.0873 * agentSbp +
        (smokingStatus === "current" ? 0.6908 : 0) +
        (diabetesStatus === "yes" ? 0.8738 : 0)
      )
    } else if (race !== "black" && gender === "female") {
      s010Ret = 0.96652
      mnxbRet = -29.1817
      predictRet = (
        -29.799 * lnAge +
        4.884 * Math.pow(lnAge, 2) +
        13.54 * lnTotalChol +
        -3.114 * ageTotalChol +
        -13.578 * lnHdl +
        3.149 * ageHdl +
        2.019 * trlnsbp +
        1.957 * ntlnsbp +
        (smokingStatus === "current" ? 7.574 : 0) +
        -1.665 * ageSmoke +
        (diabetesStatus === "yes" ? 0.661 : 0)
      )
    } else if (race === "black" && gender === "male") {
      s010Ret = 0.89536
      mnxbRet = 19.5425
      predictRet = (
        2.469 * lnAge +
        0.302 * lnTotalChol +
        -0.307 * lnHdl +
        1.916 * trlnsbp +
        1.809 * ntlnsbp +
        (smokingStatus === "current" ? 0.549 : 0) +
        (diabetesStatus === "yes" ? 0.645 : 0)
      )
    } else {
      s010Ret = 0.91436
      mnxbRet = 61.1816
      predictRet = (
        12.344 * lnAge +
        11.853 * lnTotalChol +
        -2.664 * ageTotalChol +
        -7.99 * lnHdl +
        1.769 * ageHdl +
        1.797 * trlnsbp +
        1.764 * ntlnsbp +
        (smokingStatus === "current" ? 7.837 : 0) +
        -1.795 * ageSmoke +
        (diabetesStatus === "yes" ? 0.658 : 0)
      )
    }

    const pct = 1 - Math.pow(s010Ret, Math.exp(predictRet - mnxbRet))
    return Math.round(pct * 1000) / 10
  }

  const calculateRiskScore = (e) => {
    e.preventDefault()
    const score = computeTenYearScore()
    setRiskScore(score)
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Health Risk Calculator</h2>
      <p className="text-gray-600 mb-6">Enter your health metrics to calculate your risk score</p>
      <form
        onSubmit={calculateRiskScore}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={metrics.gender}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="race" className="block text-sm font-medium text-gray-700 mb-1">
              Race
            </label>
            <select
              id="race"
              name="race"
              value={metrics.race}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select race</option>
              <option value="black">Black</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              placeholder="Enter your age"
              value={metrics.age || ""}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="bloodPressure_systolic" className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure (Systolic)
            </label>
            <input
              id="bloodPressure_systolic"
              name="bloodPressure_systolic"
              type="number"
              placeholder="Enter systolic blood pressure"
              value={metrics.bloodPressure_systolic || ""}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="cholesterol_TOT" className="block text-sm font-medium text-gray-700 mb-1">
              Cholesterol (Total)
            </label>
            <input
              id="cholesterol_TOT"
              name="cholesterol_TOT"
              type="number"
              placeholder="Enter total cholesterol"
              value={metrics.cholesterol_TOT || ""}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="cholesterol_HDL" className="block text-sm font-medium text-gray-700 mb-1">
              Cholesterol (HDL)
            </label>
            <input
              id="cholesterol_HDL"
              name="cholesterol_HDL"
              type="number"
              placeholder="Enter HDL cholesterol"
              value={metrics.cholesterol_HDL || ""}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="smokingStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Smoking Status
            </label>
            <select
              id="smokingStatus"
              name="smokingStatus"
              value={metrics.smokingStatus}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select smoking status</option>
              <option value="never">Never smoked</option>
              <option value="former">Former smoker</option>
              <option value="current">Current smoker</option>
            </select>
          </div>
          <div>
            <label htmlFor="diabetesStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Diabetes Status
            </label>
            <select
              id="diabetesStatus"
              name="diabetesStatus"
              value={metrics.diabetesStatus}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select diabetes status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="hypertensionTreatment" className="block text-sm font-medium text-gray-700 mb-1">
              On Blood Pressure Medicine
            </label>
            <select
              id="hypertensionTreatment"
              name="hypertensionTreatment"
              value={metrics.hypertensionTreatment}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select treatment status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Calculate Risk Score
        </button>
      </form>
      {riskScore !== null ? (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Your Health Risk Score</h3>
          <p>
            Based on the information provided, your 10-year risk of cardiovascular disease is:{' '}
            <span className="font-bold">{riskScore}%</span>.
          </p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-yellow-100 rounded-md">
          <p className="text-yellow-800">
            Please fill in all required fields with valid values. Age must be between 40 and 79 years.
          </p>
        </div>
      )}
    </div>
  )
}