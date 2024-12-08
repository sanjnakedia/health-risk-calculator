import React from 'react';

const ResultDisplay = ({ riskData }) => {
  return (
    <div className="result-container">
      <h2>Risk Results</h2>
      {riskData ? (
        <>
          <p>Lifetime ASCVD Risk: {riskData.lifetimeRisk}</p>
          <p>10-Year ASCVD Risk: {riskData.tenYearRisk}</p>
        </>
      ) : (
        <p>No data to display.</p>
      )}
    </div>
  );
};

export default ResultDisplay;
