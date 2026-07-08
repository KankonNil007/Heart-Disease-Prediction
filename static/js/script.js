async function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const placeholderState = document.getElementById('placeholderState');
    const resultState = document.getElementById('resultState');
    const gaugeCircle = document.getElementById('gaugeCircle');
    const riskPercent = document.getElementById('riskPercent');
    const riskBadge = document.getElementById('riskBadge');
    const resultTitle = document.getElementById('resultTitle');
    const resultDesc = document.getElementById('resultDesc');
    
    // Set loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    const formData = new FormData(event.target);
    
    // Prepare numerical inputs
    const age = parseFloat(formData.get('Age'));
    const restingBP = parseFloat(formData.get('RestingBP'));
    const cholesterol = parseFloat(formData.get('Cholesterol'));
    const fastingBS = parseInt(formData.get('FastingBS'));
    const maxHR = parseFloat(formData.get('MaxHR'));
    const oldpeak = parseFloat(formData.get('Oldpeak'));

    // Categorical mapping helper functions
    const sex = formData.get('Sex');
    const sex_M = sex === 'M' ? 1.0 : 0.0;

    const chestPain = formData.get('ChestPainType');
    const chestPainType_ATA = chestPain === 'ATA' ? 1.0 : 0.0;
    const chestPainType_NAP = chestPain === 'NAP' ? 1.0 : 0.0;

    const restingECG = formData.get('RestingECG');
    const restingECG_Normal = restingECG === 'Normal' ? 1.0 : 0.0;
    const restingECG_ST = restingECG === 'ST' ? 1.0 : 0.0;

    const exerciseAngina = formData.get('ExerciseAngina');
    const exerciseAngina_Y = exerciseAngina === 'Y' ? 1.0 : 0.0;

    const stSlope = formData.get('ST_Slope');
    const stSlope_Flat = stSlope === 'Flat' ? 1.0 : 0.0;
    const stSlope_Up = stSlope === 'Up' ? 1.0 : 0.0;

    // Build the request payload matching the Pydantic schema
    const payload = {
        Age: age,
        RestingBP: restingBP,
        Cholesterol: cholesterol,
        FastingBS: fastingBS,
        MaxHR: maxHR,
        Oldpeak: oldpeak,
        Sex_M: sex_M,
        ChestPainType_ATA: chestPainType_ATA,
        ChestPainType_NAP: chestPainType_NAP,
        RestingECG_Normal: restingECG_Normal,
        RestingECG_ST: restingECG_ST,
        ExerciseAngina_Y: exerciseAngina_Y,
        ST_Slope_Flat: stSlope_Flat,
        ST_Slope_Up: stSlope_Up
    };

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        // Show result panel and hide default placeholder state
        placeholderState.style.display = 'none';
        resultState.style.display = 'flex';
        
        // Update percentage risk label
        const probability = data.probability;
        riskPercent.innerText = probability + '%';
        
        // Calculate stroke dashoffset for radial gauge transition (Circumference = 440)
        const offset = 440 - (440 * (probability / 100));
        gaugeCircle.style.strokeDashoffset = offset;
        
        // Apply colors and messages based on dynamic risk levels
        if (data.prediction === 1) {
            // High Risk Profile
            document.documentElement.style.setProperty('--primary', 'var(--danger)');
            document.documentElement.style.setProperty('--primary-glow', 'var(--danger-glow)');
            document.documentElement.style.setProperty('--card-border-hover', 'rgba(239, 68, 68, 0.2)');
            
            riskBadge.className = 'badge badge-risk';
            riskBadge.innerText = 'HIGH RISK';
            resultTitle.innerText = 'Cardiac Risk Detected';
            resultDesc.innerText = 'Clinical indicators strongly suggest a risk of heart disease. The patient should seek professional cardiovascular evaluation promptly.';
        } else if (probability >= 30) {
            // Moderate Risk Profile
            document.documentElement.style.setProperty('--primary', 'var(--warning)');
            document.documentElement.style.setProperty('--primary-glow', 'var(--warning-glow)');
            document.documentElement.style.setProperty('--card-border-hover', 'rgba(245, 158, 11, 0.2)');
            
            riskBadge.className = 'badge badge-warning';
            riskBadge.innerText = 'MODERATE RISK';
            resultTitle.innerText = 'Elevated Cardiac Risk';
            resultDesc.innerText = 'The model predicts no immediate disease, but the risk index is elevated. A healthy lifestyle transition and follow-ups are recommended.';
        } else {
            // Low Risk Profile
            document.documentElement.style.setProperty('--primary', '#06b6d4');
            document.documentElement.style.setProperty('--primary-glow', 'rgba(6, 182, 212, 0.3)');
            document.documentElement.style.setProperty('--card-border-hover', 'rgba(6, 182, 212, 0.2)');
            
            riskBadge.className = 'badge badge-safe';
            riskBadge.innerText = 'LOW RISK';
            resultTitle.innerText = 'Patient Health Normal';
            resultDesc.innerText = 'The indicators align with a normal, low-risk cardiac profile. Maintain periodic wellness exams and standard physical routine.';
        }
        
    } catch (err) {
        alert('Error making prediction. Ensure the backend server is running and responsive.');
        console.error(err);
    } finally {
        // Reset button states
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}
