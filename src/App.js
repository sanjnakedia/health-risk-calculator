import React, { useState } from 'react';
import RiskForm from './components/RiskForm';
import ResultDisplay from './components/ResultDisplay';
import { computeTenYearScore, computeLifetimeRisk, computeLowestLifetime, computeLowestTenYear, computePotentialRisk } from './utils/riskCalculator';

const App = () => {
  const [riskData, setRiskData] = useState(null);

  const handleFormSubmit = (data) => {
    const { age, gender, totalCholesterol, systolicBloodPressure, hdl, relatedFactors } = data;

    // Compute ASCVD risks
    const lifetimeRisk = computeLifetimeRisk(age, gender, totalCholesterol, systolicBloodPressure, hdl, relatedFactors);
    const tenYearRisk = computeTenYearScore(age, gender, totalCholesterol, systolicBloodPressure, hdl, relatedFactors);
    const lowestLifetimeRisk = computeLowestLifetime(age, gender);
    const lowestTenYearRisk = computeLowestTenYear(age, gender);
    
    const reductions = ['statin', 'sysBP']; // Example reductions
    const potentialRiskReduction = computePotentialRisk(reductions, 'lifetime', age, gender, totalCholesterol, systolicBloodPressure, hdl, relatedFactors);

    setRiskData({
      lifetimeRisk,
      tenYearRisk,
      lowestLifetimeRisk,
      lowestTenYearRisk,
      potentialRiskReduction,
    });
  };

  return (
    <div className="container">
      <h1>ASCVD Risk Calculator</h1>
      <RiskForm onSubmit={handleFormSubmit} />
      <ResultDisplay riskData={riskData} />
    </div>
  );
};

export default App;
