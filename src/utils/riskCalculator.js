// src/utils/riskCalculator.js

// Function to compute the 10-year ASCVD risk score
export const computeTenYearScore = (age, gender, totalCholesterol, systolicBloodPressure, hdl, relatedFactors) => {
    if (age < 40 || age > 79) { return null; }
    
    const lnAge = Math.log(age);
    const lnTotalChol = Math.log(totalCholesterol);
    const lnHdl = Math.log(hdl);
    
    const trlnsbp = relatedFactors.hypertensive ? Math.log(systolicBloodPressure) : 0;
    const ntlnsbp = relatedFactors.hypertensive ? 0 : Math.log(systolicBloodPressure);
  
    const ageTotalChol = lnAge * lnTotalChol;
    const ageHdl = lnAge * lnHdl;
    const agetSbp = lnAge * trlnsbp;
    const agentSbp = lnAge * ntlnsbp;
    const ageSmoke = relatedFactors.smoker ? lnAge : 0;
  
    const isAA = relatedFactors.race === 'aa';
    const isMale = gender === 'male';
  
    let s010Ret = 0;
    let mnxbRet = 0;
    let predictRet = 0;
  
    const calculateScore = () => {
      if (isAA && !isMale) {
        s010Ret = 0.95334;
        mnxbRet = 86.6081;
        predictRet = (17.1141 * lnAge) + (0.9396 * lnTotalChol) + (-18.9196 * lnHdl)
          + (4.4748 * ageHdl) + (29.2907 * trlnsbp) + (-6.4321 * agetSbp) + (27.8197 * ntlnsbp) +
          (-6.0873 * agentSbp) + (0.6908 * Number(relatedFactors.smoker))
          + (0.8738 * Number(relatedFactors.diabetic));
      } else if (!isAA && !isMale) {
        s010Ret = 0.96652;
        mnxbRet = -29.1817;
        predictRet = (-29.799 * lnAge) + (4.884 * (lnAge ** 2)) + (13.54 * lnTotalChol) +
          (-3.114 * ageTotalChol) + (-13.578 * lnHdl) + (3.149 * ageHdl) + (2.019 * trlnsbp) +
          (1.957 * ntlnsbp) + (7.574 * Number(relatedFactors.smoker)) +
          (-1.665 * ageSmoke) + (0.661 * Number(relatedFactors.diabetic));
      } else if (isAA && isMale) {
        s010Ret = 0.89536;
        mnxbRet = 19.5425;
        predictRet = (2.469 * lnAge) + (0.302 * lnTotalChol) + (-0.307 * lnHdl) +
          (1.916 * trlnsbp) + (1.809 * ntlnsbp) + (0.549 *
          Number(relatedFactors.smoker)) +
          (0.645 * Number(relatedFactors.diabetic));
      } else {
        s010Ret = 0.91436;
        mnxbRet = 61.1816;
        predictRet = (12.344 * lnAge) + (11.853 * lnTotalChol) + (-2.664 * ageTotalChol) +
          (-7.99 * lnHdl) + (1.769 * ageHdl) + (1.797 * trlnsbp) + (1.764 * ntlnsbp) +
          (7.837 * Number(relatedFactors.smoker)) + (-1.795 * ageSmoke) +
          (0.658 * Number(relatedFactors.diabetic));
      }
  
      const pct = (1 - (s010Ret ** Math.exp(predictRet - mnxbRet)));
      return Math.round((pct * 100) * 10) / 10;
    };
  
    return calculateScore();
  };
  

// Function to compute the lifetime ASCVD risk score
export const computeLifetimeRisk = (age, gender, totalCholesterol, systolicBloodPressure, hdl, diabetic, smoker, hypertensive) => {
    if (age < 20 || age > 59) { return null; }
    let ascvdRisk = 0;
    const params = {
      male: {
        major2: 69,
        major1: 50,
        elevated: 46,
        notOptimal: 36,
        allOptimal: 5,
      },
      female: {
        major2: 50,
        major1: 39,
        elevated: 39,
        notOptimal: 27,
        allOptimal: 8,
      },
    };
  
    const major = (totalCholesterol >= 240 ? 1 : 0) +
      ((systolicBloodPressure >= 160 ? 1 : 0) +
      (hypertensive ? 1 : 0)) +
      (smoker ? 1 : 0) +
      (diabetic ? 1 : 0);
    const elevated = ((((totalCholesterol >= 200 && totalCholesterol < 240) ? 1 : 0) +
      ((systolicBloodPressure >= 140 && systolicBloodPressure < 160 && !hypertensive) ? 1 : 0)) >= 1 ? 1 : 0) *
      (major === 0 ? 1 : 0);
    const allOptimal = (((totalCholesterol < 180 ? 1 : 0) +
      ((systolicBloodPressure < 120 ? 1 : 0) *
      (hypertensive ? 0 : 1))) === 2 ? 1 : 0) *
      (major === 0 ? 1 : 0);
    const notOptimal = ((((totalCholesterol >= 180 && totalCholesterol < 200) ? 1 : 0) +
      ((systolicBloodPressure >= 120 && systolicBloodPressure < 140 && !hypertensive) ? 1 : 0)) *
      (elevated === 0 ? 1 : 0) * (major === 0 ? 1 : 0)) >= 1 ? 1 : 0;
  
    if (major > 1) { ascvdRisk = params[gender].major2; }
    if (major === 1) { ascvdRisk = params[gender].major1; }
    if (elevated === 1) { ascvdRisk = params[gender].elevated; }
    if (notOptimal === 1) { ascvdRisk = params[gender].notOptimal; }
    if (allOptimal === 1) { ascvdRisk = params[gender].allOptimal; }
  
    return ascvdRisk;
  };
  
  // Function to compute the lowest 10-year risk under optimal conditions
  export const computeLowestTenYear = (age, gender) => {
    const systolicBloodPressure = 90;
    const totalCholesterol = 130;
    const hdl = 100;
    const diabetic = false;
    const smoker = false;
    const hypertensive = false;
    return computeTenYearScore(age, gender, totalCholesterol, systolicBloodPressure, hdl, diabetic, smoker, hypertensive);
  };
  
  // Function to compute the lowest lifetime risk under optimal conditions
  export const computeLowestLifetime = (age, gender) => {
    const systolicBloodPressure = 90;
    const totalCholesterol = 130;
    const hdl = 100;
    const diabetic = false;
    const smoker = false;
    const hypertensive = false;
    return computeLifetimeRisk(age, gender, totalCholesterol, systolicBloodPressure, hdl, diabetic, smoker, hypertensive);
  };
  
  // Function to compute the potential risk reduction based on provided factors
  export const computePotentialRisk = (reductions, score, age, gender, totalCholesterol, systolicBloodPressure, hdl, diabetic, smoker, hypertensive) => {
    let computedScore;
    let lowestScore;
    let reducedTotalScore = 0;
    if (score === 'ten') {
      computedScore = computeTenYearScore(age, gender, totalCholesterol, systolicBloodPressure, hdl, diabetic, smoker, hypertensive);
      lowestScore = computeLowestTenYear(age, gender);
    } else {
      computedScore = computeLifetimeRisk(age, gender, totalCholesterol, systolicBloodPressure, hdl, diabetic, smoker, hypertensive);
      lowestScore = computeLowestLifetime(age, gender);
    }
    for (let i = 0; i < reductions.length; i += 1) {
      if (reductions[i] === 'statin') {
        reducedTotalScore += (computedScore * 0.25);
      } else if (reductions[i] === 'sysBP') {
        const sysBPCalculation = computedScore - (computedScore *
          (0.7 ** ((systolicBloodPressure - 140) / 10)));
        reducedTotalScore += sysBPCalculation;
      } else if (reductions[i] === 'aspirin') {
        reducedTotalScore += (computedScore * 0.1);
      } else if (reductions[i] === 'smoker') {
        reducedTotalScore += (computedScore * 0.15);
      }
    }
    if (Math.round((computedScore - reducedTotalScore) * 10) / 10 <= lowestScore) {
      return Math.round((computedScore - lowestScore) * 10) / 10;
    }
    return Math.round(reducedTotalScore * 10) / 10;
  };
  