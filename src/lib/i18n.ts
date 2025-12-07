import { Language } from '@/contexts/SettingsContext'

export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    depinMap: 'DePIN Map',
    zkVerifier: 'ZK Verifier',
    serenityAI: 'Serenity AI',
    healthPassport: 'Health Passport',
    profile: 'Profile',
    doctorPortal: 'Doctor Portal',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    patientLogin: 'Patient Login',
    doctorLogin: 'Doctor Login',
    signIn: 'Sign In',
    invalidCredentials: 'Invalid credentials. Please try again.',
    loginSuccess: 'Login successful!',
    
    // Passport
    globalHealthPassport: 'Global Health Passport',
    verifiedMedicalIdentity: 'Your verified medical identity on Flare Network',
    generateAccessQR: 'Generate Access QR',
    shareAllergies: 'Share Allergies',
    shareMedHistory: 'Share Medical History',
    shareInsurance: 'Share Insurance Info',
    generateSecureQR: 'Generate Secure QR',
    oneTimeAccessToken: 'One-Time Access Token Active',
    readyForDoctorScan: 'Ready for Doctor Scan',
    expiresIn: 'Expires in',
    minutes: 'minutes',
    cancelGenerate: 'Cancel & Generate New',
    doctorScannerMode: 'Doctor Scanner Mode',
    positionQRCode: 'Position QR code within the frame',
    startScanning: 'Start Scanning',
    decryptingData: 'Decrypting Data...',
    areYouDoctor: 'Are you a Doctor? Switch to Scanner',
    backToPassport: 'Back to Passport',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    voiceInput: 'Voice Input',
    voiceOutput: 'Voice Output',
    enableVoiceInput: 'Enable Voice Input',
    enableVoiceOutput: 'Enable Voice Output',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    
    // AI Assistant
    aiHealthAssistant: 'AI Health Assistant',
    askAboutHealth: 'Ask about your health...',
    analyzing: 'Analyzing your health data...',
    disclaimer: 'This is AI-generated advice for demo purposes. Always consult a real healthcare professional.',
    
    // Common
    connectWallet: 'Connect Wallet',
    welcome: 'Welcome back',
    patient: 'Patient',
    doctor: 'Doctor',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close'
  },
  
  ta: {
    // Navigation
    dashboard: 'டாஷ்போர்டு',
    depinMap: 'DePIN வரைபடம்',
    zkVerifier: 'ZK சரிபார்ப்பு',
    serenityAI: 'செரினிட்டி AI',
    healthPassport: 'சுகாதார பாஸ்போர்ட்',
    profile: 'சுயவிவரம்',
    doctorPortal: 'மருத்துவர் போர்டல்',
    
    // Auth
    login: 'உள்நுழைவு',
    logout: 'வெளியேறு',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    patientLogin: 'நோயாளி உள்நுழைவு',
    doctorLogin: 'மருத்துவர் உள்நுழைவு',
    signIn: 'உள்நுழைக',
    invalidCredentials: 'தவறான விவரங்கள். மீண்டும் முயற்சிக்கவும்.',
    loginSuccess: 'உள்நுழைவு வெற்றிகரமாக!',
    
    // Passport
    globalHealthPassport: 'உலகளாவிய சுகாதார பாஸ்போர்ட்',
    verifiedMedicalIdentity: 'Flare நெட்வொர்க்கில் உங்கள் சரிபார்க்கப்பட்ட மருத்துவ அடையாளம்',
    generateAccessQR: 'அணுகல் QR உருவாக்கு',
    shareAllergies: 'ஒவ்வாமைகளை பகிர்',
    shareMedHistory: 'மருத்துவ வரலாற்றை பகிர்',
    shareInsurance: 'காப்பீட்டு தகவலை பகிர்',
    generateSecureQR: 'பாதுகாப்பான QR உருவாக்கு',
    oneTimeAccessToken: 'ஒரு முறை அணுகல் டோக்கன் செயலில்',
    readyForDoctorScan: 'மருத்துவர் ஸ்கேனுக்கு தயார்',
    expiresIn: 'காலாவதியாகும்',
    minutes: 'நிமிடங்கள்',
    cancelGenerate: 'ரத்து செய் & புதியதை உருவாக்கு',
    doctorScannerMode: 'மருத்துவர் ஸ்கேனர் பயன்முறை',
    positionQRCode: 'QR குறியீட்டை சட்டத்திற்குள் வைக்கவும்',
    startScanning: 'ஸ்கேனிங் தொடங்கு',
    decryptingData: 'தரவை மறைகுறியாக்குகிறது...',
    areYouDoctor: 'நீங்கள் மருத்துவரா? ஸ்கேனருக்கு மாறவும்',
    backToPassport: 'பாஸ்போர்ட்டுக்கு திரும்பு',
    
    // Settings
    settings: 'அமைப்புகள்',
    language: 'மொழி',
    voiceInput: 'குரல் உள்ளீடு',
    voiceOutput: 'குரல் வெளியீடு',
    enableVoiceInput: 'குரல் உள்ளீட்டை இயக்கு',
    enableVoiceOutput: 'குரல் வெளியீட்டை இயக்கு',
    theme: 'தீம்',
    lightMode: 'வெளிச்ச பயன்முறை',
    darkMode: 'இருண்ட பயன்முறை',
    
    // AI Assistant
    aiHealthAssistant: 'AI சுகாதார உதவியாளர்',
    askAboutHealth: 'உங்கள் சுகாதாரத்தைப் பற்றி கேளுங்கள்...',
    analyzing: 'உங்கள் சுகாதார தரவை பகுப்பாய்வு செய்கிறது...',
    disclaimer: 'இது டெமோ நோக்கங்களுக்காக AI-உருவாக்கப்பட்ட ஆலோசனை. எப்போதும் உண்மையான சுகாதார நிபுணரை அணுகவும்.',
    
    // Common
    connectWallet: 'வாலட்டை இணைக்கவும்',
    welcome: 'மீண்டும் வரவேற்கிறோம்',
    patient: 'நோயாளி',
    doctor: 'மருத்துவர்',
    cancel: 'ரத்து செய்',
    save: 'சேமி',
    close: 'மூடு'
  },
  
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    depinMap: 'DePIN मानचित्र',
    zkVerifier: 'ZK सत्यापनकर्ता',
    serenityAI: 'सेरेनिटी AI',
    healthPassport: 'स्वास्थ्य पासपोर्ट',
    profile: 'प्रोफ़ाइल',
    doctorPortal: 'डॉक्टर पोर्टल',
    
    // Auth
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    patientLogin: 'रोगी लॉगिन',
    doctorLogin: 'डॉक्टर लॉगिन',
    signIn: 'साइन इन करें',
    invalidCredentials: 'अमान्य क्रेडेंशियल। कृपया पुनः प्रयास करें।',
    loginSuccess: 'लॉगिन सफल!',
    
    // Passport
    globalHealthPassport: 'वैश्विक स्वास्थ्य पासपोर्ट',
    verifiedMedicalIdentity: 'Flare नेटवर्क पर आपकी सत्यापित चिकित्सा पहचान',
    generateAccessQR: 'एक्सेस QR बनाएं',
    shareAllergies: 'एलर्जी साझा करें',
    shareMedHistory: 'चिकित्सा इतिहास साझा करें',
    shareInsurance: 'बीमा जानकारी साझा करें',
    generateSecureQR: 'सुरक्षित QR बनाएं',
    oneTimeAccessToken: 'एकबारगी एक्सेस टोकन सक्रिय',
    readyForDoctorScan: 'डॉक्टर स्कैन के लिए तैयार',
    expiresIn: 'समाप्त होगा',
    minutes: 'मिनट',
    cancelGenerate: 'रद्द करें और नया बनाएं',
    doctorScannerMode: 'डॉक्टर स्कैनर मोड',
    positionQRCode: 'QR कोड को फ्रेम के भीतर रखें',
    startScanning: 'स्कैनिंग शुरू करें',
    decryptingData: 'डेटा डिक्रिप्ट हो रहा है...',
    areYouDoctor: 'क्या आप डॉक्टर हैं? स्कैनर पर स्विच करें',
    backToPassport: 'पासपोर्ट पर वापस जाएं',
    
    // Settings
    settings: 'सेटिंग्स',
    language: 'भाषा',
    voiceInput: 'वॉयस इनपुट',
    voiceOutput: 'वॉयस आउटपुट',
    enableVoiceInput: 'वॉयस इनपुट सक्षम करें',
    enableVoiceOutput: 'वॉयस आउटपुट सक्षम करें',
    theme: 'थीम',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    
    // AI Assistant
    aiHealthAssistant: 'AI स्वास्थ्य सहायक',
    askAboutHealth: 'अपने स्वास्थ्य के बारे में पूछें...',
    analyzing: 'आपके स्वास्थ्य डेटा का विश्लेषण कर रहा है...',
    disclaimer: 'यह डेमो उद्देश्यों के लिए AI-जनित सलाह है। हमेशा वास्तविक स्वास्थ्य पेशेवर से परामर्श लें।',
    
    // Common
    connectWallet: 'वॉलेट कनेक्ट करें',
    welcome: 'वापसी पर स्वागत है',
    patient: 'रोगी',
    doctor: 'डॉक्टर',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    close: 'बंद करें'
  }
}

export function useTranslation(language: Language) {
  return {
    t: (key: keyof typeof translations.en): string => {
      return translations[language][key] || translations.en[key] || key
    }
  }
}