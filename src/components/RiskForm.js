import React, { useState } from 'react';

const RiskForm = ({ onSubmit }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [totalCholesterol, setTotalCholesterol] = useState('');
  const [systolicBloodPressure, setSystolicBloodPressure] = useState('');
  const [hdl, setHdl] = useState('');
  const [diabetic, setDiabetic] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [hypertensive, setHypertensive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const relatedFactors = {
      smoker,
      diabetic,
      hypertensive,
      race: 'aa',  // Or get it from a dropdown field if needed
    };
  
    onSubmit({ age, gender, totalCholesterol, systolicBloodPressure, hdl, relatedFactors });
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input className="input-field" type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
      <select className="input-field" value={gender} onChange={(e) => setGender(e.target.value)} required>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input className="input-field" type="number" placeholder="Total Cholesterol" value={totalCholesterol} onChange={(e) => setTotalCholesterol(e.target.value)} required />
      <input className="input-field" type="number" placeholder="Systolic Blood Pressure" value={systolicBloodPressure} onChange={(e) => setSystolicBloodPressure(e.target.value)} required />
      <input className="input-field" type="number" placeholder="HDL" value={hdl} onChange={(e) => setHdl(e.target.value)} required />
      
      <div>
        <label className="input-checkbox">
          <input type="checkbox" checked={diabetic} onChange={() => setDiabetic(!diabetic)} /> Diabetic
        </label>
        <label className="input-checkbox">
          <input type="checkbox" checked={smoker} onChange={() => setSmoker(!smoker)} /> Smoker
        </label>
        <label className="input-checkbox">
          <input type="checkbox" checked={hypertensive} onChange={() => setHypertensive(!hypertensive)} /> Hypertensive
        </label>
      </div>

      <button type="submit">Calculate Risk</button>
    </form>
  );
};

export default RiskForm;
