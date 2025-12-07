// Mock patient database for doctor portal demo
export interface PatientVitals {
  patientId: string
  patientName: string
  lastAccessed?: Date
  riskScore: number
  vitals: {
    heartRate: number
    bloodPressure: string
    glucose: number
    bmi: number
    stressLevel: number
  }
  medications: string[]
  allergies: string[]
  lastVisit?: Date
}

export const mockPatients: PatientVitals[] = [
  {
    patientId: 'FLR-2024-9834',
    patientName: 'John Anderson',
    riskScore: 82,
    vitals: {
      heartRate: 88,
      bloodPressure: '145/95',
      glucose: 185,
      bmi: 31.2,
      stressLevel: 8
    },
    medications: ['Metformin 500mg', 'Amlodipine 5mg'],
    allergies: ['Penicillin', 'NSAIDs'],
    lastVisit: new Date('2024-12-01')
  },
  {
    patientId: 'FLR-2024-7821',
    patientName: 'Sarah Chen',
    riskScore: 75,
    vitals: {
      heartRate: 92,
      bloodPressure: '150/98',
      glucose: 95,
      bmi: 26.8,
      stressLevel: 9
    },
    medications: ['Atorvastatin 20mg', 'SSRIs'],
    allergies: ['Sulfa drugs'],
    lastVisit: new Date('2024-11-28')
  },
  {
    patientId: 'FLR-2024-5612',
    patientName: 'Michael Rodriguez',
    riskScore: 68,
    vitals: {
      heartRate: 78,
      bloodPressure: '138/88',
      glucose: 165,
      bmi: 29.5,
      stressLevel: 6
    },
    medications: ['Metformin 850mg'],
    allergies: ['None reported'],
    lastVisit: new Date('2024-12-03')
  },
  {
    patientId: 'FLR-2024-3401',
    patientName: 'Emily Watson',
    riskScore: 45,
    vitals: {
      heartRate: 72,
      bloodPressure: '125/82',
      glucose: 98,
      bmi: 24.1,
      stressLevel: 4
    },
    medications: [],
    allergies: ['Latex'],
    lastVisit: new Date('2024-11-25')
  },
  {
    patientId: 'FLR-2024-1289',
    patientName: 'David Kim',
    riskScore: 38,
    vitals: {
      heartRate: 68,
      bloodPressure: '118/76',
      glucose: 92,
      bmi: 22.8,
      stressLevel: 3
    },
    medications: [],
    allergies: ['None reported'],
    lastVisit: new Date('2024-12-05')
  }
]

// Calculate sub-risk scores based on vitals
export function calculateSubRisks(vitals: PatientVitals['vitals']) {
  const cardiac = calculateCardiacRisk(vitals)
  const diabetes = calculateDiabetesRisk(vitals)
  const hypertension = calculateHypertensionRisk(vitals)
  const obesity = calculateObesityRisk(vitals)
  const mentalStress = calculateMentalStressRisk(vitals)

  return {
    cardiac,
    diabetes,
    hypertension,
    obesity,
    mentalStress
  }
}

function calculateCardiacRisk(vitals: PatientVitals['vitals']): { score: number; level: 'low' | 'medium' | 'high'; color: string; explanation: string } {
  const [systolic] = vitals.bloodPressure.split('/').map(Number)
  let score = 0
  
  if (vitals.heartRate > 85) score += 25
  if (systolic > 140) score += 35
  if (vitals.bmi > 30) score += 20
  if (vitals.stressLevel > 7) score += 20

  const level = score < 40 ? 'low' : score < 70 ? 'medium' : 'high'
  const color = level === 'low' ? 'text-green-500' : level === 'medium' ? 'text-yellow-500' : 'text-red-500'
  
  return {
    score,
    level,
    color,
    explanation: level === 'high' 
      ? 'Elevated heart rate and blood pressure indicate increased cardiovascular risk. Lifestyle changes and medication review recommended.'
      : level === 'medium'
      ? 'Moderate cardiac indicators. Monitor blood pressure and maintain healthy lifestyle.'
      : 'Cardiac health appears stable. Continue regular monitoring.'
  }
}

function calculateDiabetesRisk(vitals: PatientVitals['vitals']): { score: number; level: 'low' | 'medium' | 'high'; color: string; explanation: string } {
  let score = 0
  
  if (vitals.glucose > 180) score += 60
  else if (vitals.glucose > 140) score += 40
  else if (vitals.glucose > 100) score += 20
  
  if (vitals.bmi > 30) score += 25

  const level = score < 30 ? 'low' : score < 60 ? 'medium' : 'high'
  const color = level === 'low' ? 'text-green-500' : level === 'medium' ? 'text-yellow-500' : 'text-red-500'
  
  return {
    score,
    level,
    color,
    explanation: level === 'high'
      ? 'Glucose levels significantly elevated. Immediate diabetes management and medication adjustment needed.'
      : level === 'medium'
      ? 'Pre-diabetic range detected. Dietary modifications and regular glucose monitoring advised.'
      : 'Blood glucose within normal range. Maintain healthy diet and exercise.'
  }
}

function calculateHypertensionRisk(vitals: PatientVitals['vitals']): { score: number; level: 'low' | 'medium' | 'high'; color: string; explanation: string } {
  const [systolic, diastolic] = vitals.bloodPressure.split('/').map(Number)
  let score = 0
  
  if (systolic >= 140 || diastolic >= 90) score += 60
  else if (systolic >= 130 || diastolic >= 85) score += 40
  else if (systolic >= 120) score += 20

  const level = score < 30 ? 'low' : score < 50 ? 'medium' : 'high'
  const color = level === 'low' ? 'text-green-500' : level === 'medium' ? 'text-yellow-500' : 'text-red-500'
  
  return {
    score,
    level,
    color,
    explanation: level === 'high'
      ? 'Stage 2 hypertension detected. Antihypertensive medication and lifestyle intervention required.'
      : level === 'medium'
      ? 'Elevated blood pressure. Reduce sodium intake and increase physical activity.'
      : 'Blood pressure within healthy range. Continue preventive measures.'
  }
}

function calculateObesityRisk(vitals: PatientVitals['vitals']): { score: number; level: 'low' | 'medium' | 'high'; color: string; explanation: string } {
  let score = 0
  
  if (vitals.bmi >= 35) score = 85
  else if (vitals.bmi >= 30) score = 65
  else if (vitals.bmi >= 25) score = 40
  else score = 20

  const level = score < 40 ? 'low' : score < 70 ? 'medium' : 'high'
  const color = level === 'low' ? 'text-green-500' : level === 'medium' ? 'text-yellow-500' : 'text-red-500'
  
  return {
    score,
    level,
    color,
    explanation: level === 'high'
      ? 'BMI indicates class II obesity. Comprehensive weight management program needed.'
      : level === 'medium'
      ? 'Overweight or obese range. Dietary counseling and exercise program recommended.'
      : 'Healthy weight range. Maintain balanced diet and regular activity.'
  }
}

function calculateMentalStressRisk(vitals: PatientVitals['vitals']): { score: number; level: 'low' | 'medium' | 'high'; color: string; explanation: string } {
  const score = vitals.stressLevel * 10

  const level = score < 50 ? 'low' : score < 70 ? 'medium' : 'high'
  const color = level === 'low' ? 'text-green-500' : level === 'medium' ? 'text-yellow-500' : 'text-red-500'
  
  return {
    score,
    level,
    color,
    explanation: level === 'high'
      ? 'Severe stress levels detected. Mental health evaluation and stress management therapy recommended.'
      : level === 'medium'
      ? 'Moderate stress indicators. Consider relaxation techniques and workload management.'
      : 'Stress levels within manageable range. Continue self-care practices.'
  }
}

// Mock medication interaction checker
export function checkMedicationSafety(vitals: PatientVitals['vitals'], medications: string[]) {
  const warnings: Array<{ severity: 'warning' | 'caution'; message: string }> = []

  const [systolic] = vitals.bloodPressure.split('/').map(Number)

  // NSAIDs and hypertension
  if (systolic >= 140 && medications.some(med => med.toLowerCase().includes('nsaid'))) {
    warnings.push({
      severity: 'warning',
      message: '⚠️ Caution: NSAIDs can elevate blood pressure. Consider alternative pain management.'
    })
  }

  // Steroids and diabetes
  if (vitals.glucose > 140 && medications.some(med => med.toLowerCase().includes('steroid') || med.toLowerCase().includes('prednisone'))) {
    warnings.push({
      severity: 'warning',
      message: '⚠️ Caution: Steroids may worsen glucose control. Monitor blood sugar closely.'
    })
  }

  // Metformin and kidney function (simulated)
  if (medications.some(med => med.toLowerCase().includes('metformin')) && vitals.bmi > 35) {
    warnings.push({
      severity: 'caution',
      message: '⚡ Note: Monitor kidney function with Metformin in high BMI patients.'
    })
  }

  // SSRIs and monitoring
  if (medications.some(med => med.toLowerCase().includes('ssri')) && vitals.stressLevel > 7) {
    warnings.push({
      severity: 'caution',
      message: '⚡ Note: Monitor for SSRI effectiveness. Consider therapy combination if stress remains high.'
    })
  }

  return warnings
}
