"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Mic, Volume2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/lib/i18n';
import { speechService, languageToSpeechCode } from '@/lib/speech';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HealthData {
  stressLevel?: number;
  bloodPressure?: string;
  glucose?: number;
  heartRate?: number;
  sleepHours?: number;
}

interface AIAssistantProps {
  healthData?: HealthData;
  onClose?: () => void;
  autoOpen?: boolean;
}

export function AIAssistant({ healthData, onClose, autoOpen = false }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);

  const { language, voiceInputEnabled, voiceOutputEnabled } = useSettings();
  const { t } = useTranslation(language);

  // Auto-open and analyze when stress is high
  useEffect(() => {
    if (autoOpen && healthData?.stressLevel && healthData.stressLevel >= 7 && messages.length === 0) {
      analyzeHealth();
    }
  }, [autoOpen, healthData]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const analyzeHealth = () => {
    if (!healthData) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      let analysis = '';
      let medications: string[] = [];

      // High stress analysis
      if (healthData.stressLevel && healthData.stressLevel >= 7) {
        analysis += `I notice your stress level is quite high (${healthData.stressLevel}/10). `;

        if (healthData.sleepHours && healthData.sleepHours < 6) {
          analysis += `Combined with only ${healthData.sleepHours} hours of sleep, this could impact your mental and physical health. `;
        }

        analysis += `\n\n**Recommendations:**\n`;
        analysis += `• Practice deep breathing exercises (4-7-8 technique)\n`;
        analysis += `• Consider meditation or mindfulness apps\n`;
        analysis += `• Maintain consistent sleep schedule\n`;
        analysis += `• Regular physical activity\n\n`;
        analysis += `If symptoms persist, please consult a mental health professional.`;
      }

      // High blood pressure
      if (healthData.bloodPressure) {
        const [systolic] = healthData.bloodPressure.split('/').map(Number);
        if (systolic >= 140) {
          analysis += `\n\n⚠️ **High Blood Pressure Detected (${healthData.bloodPressure} mmHg)**\n\n`;
          analysis += `Your blood pressure is elevated. Based on smart contract analysis:\n\n`;
          medications.push('Amlodipine 5mg');
          analysis += `• **Suggested Medication:** Amlodipine 5mg (Calcium channel blocker)\n`;
          analysis += `• Reduce sodium intake\n`;
          analysis += `• Regular exercise\n`;
          analysis += `• Monitor daily\n\n`;
        }
      }

      // High glucose
      if (healthData.glucose && healthData.glucose >= 180) {
        analysis += `\n\n⚠️ **Elevated Blood Glucose (${healthData.glucose} mg/dL)**\n\n`;
        analysis += `Your glucose levels are high. Based on smart contract analysis:\n\n`;
        medications.push('Metformin 500mg');
        analysis += `• **Suggested Medication:** Metformin 500mg\n`;
        analysis += `• Follow diabetic diet plan\n`;
        analysis += `• Check glucose regularly\n`;
        analysis += `• Stay hydrated\n\n`;
      }

      // Add disclaimer
      analysis += `\n\n---\n⚠️ **Medical Disclaimer:** This is AI-generated advice for demonstration purposes only. `;
      analysis += `The medication suggestions come from blockchain smart contract analysis of your health data. `;
      analysis += `**Please consult a licensed healthcare professional before taking any medication or making health decisions.**`;

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: analysis,
        timestamp: new Date()
      };

      setMessages([assistantMessage]);
      setIsAnalyzing(false);

      // Speak response if voice output is enabled
      if (voiceOutputEnabled) {
        const speechText = analysis.replace(/[*_#\n]/g, ' ').substring(0, 500);
        speechService.speak(speechText, languageToSpeechCode[language]);
      }
    }, 2000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsAnalyzing(true);

    // Simulate AI response
    setTimeout(() => {
      let response = '';

      // Simple keyword-based responses
      if (input.toLowerCase().includes('stress') || input.toLowerCase().includes('anxiety')) {
        response = `I understand you're feeling stressed. Here are some immediate techniques:\n\n`;
        response += `• **4-7-8 Breathing:** Inhale for 4 seconds, hold for 7, exhale for 8\n`;
        response += `• **Progressive Muscle Relaxation:** Tense and release muscle groups\n`;
        response += `• **Grounding Technique:** Name 5 things you see, 4 you hear, 3 you feel\n\n`;
        response += `If stress is severe or persistent, please reach out to a mental health professional.`;
      } else if (input.toLowerCase().includes('medication') || input.toLowerCase().includes('medicine')) {
        response = `Based on your health data analysis:\n\n`;
        if (healthData?.bloodPressure) {
          response += `• For blood pressure: Amlodipine 5mg may be recommended\n`;
        }
        if (healthData?.glucose && healthData.glucose > 180) {
          response += `• For glucose: Metformin 500mg may be recommended\n`;
        }
        response += `\n⚠️ **These are smart contract-suggested medications. You MUST consult your doctor before taking any medication.**`;
      } else if (input.toLowerCase().includes('sleep')) {
        response = `Good sleep hygiene tips:\n\n`;
        response += `• Maintain consistent sleep schedule\n`;
        response += `• Avoid screens 1 hour before bed\n`;
        response += `• Keep bedroom cool and dark\n`;
        response += `• Avoid caffeine after 2 PM\n`;
        response += `• Try relaxation techniques before bed`;
      } else {
        response = `I'm here to help with health guidance. I can provide information about:\n\n`;
        response += `• Stress management techniques\n`;
        response += `• Medication information (with disclaimers)\n`;
        response += `• Sleep improvement tips\n`;
        response += `• General wellness advice\n\n`;
        response += `What would you like to know more about?`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsAnalyzing(false);

      // Speak response if voice output is enabled
      if (voiceOutputEnabled) {
        const speechText = response.replace(/[*_#\n]/g, ' ').substring(0, 500);
        speechService.speak(speechText, languageToSpeechCode[language]);
      }
    }, 1500);
  };

  const startVoiceInput = () => {
    if (!voiceInputEnabled) {
      toast.error('Voice input is disabled', {
        description: 'Enable it in Settings to use this feature'
      });
      return;
    }

    setIsListening(true);
    stopListeningRef.current = speechService.startListening(
      (transcript) => {
        setInput(transcript);
        setIsListening(false);
        toast.success('Voice input captured');
      },
      (error) => {
        setIsListening(false);
        toast.error('Voice input failed', {
          description: error
        });
      },
      languageToSpeechCode[language]
    );
  };

  const stopVoiceInput = () => {
    if (stopListeningRef.current) {
      stopListeningRef.current();
      stopListeningRef.current = null;
    }
    setIsListening(false);
  };

  const speakMessage = (message: string) => {
    if (!voiceOutputEnabled) {
      toast.error('Voice output is disabled', {
        description: 'Enable it in Settings to use this feature'
      });
      return;
    }

    setIsSpeaking(true);
    const cleanText = message.replace(/[*_#\n]/g, ' ').substring(0, 500);
    speechService.speak(
      cleanText,
      languageToSpeechCode[language],
      () => setIsSpeaking(false)
    );
  };

  return (
    <Card className="glass-card gradient-border flex flex-col h-[600px]">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('aiHealthAssistant')}</CardTitle>
              <p className="text-xs text-muted-foreground">Powered by Flare Network</p>
            </div>
          </div>
          {onClose &&
          <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          }
        </div>
        {healthData?.stressLevel && healthData.stressLevel >= 7 &&
        <Badge variant="destructive" className="gap-1 mt-2">
            <AlertTriangle className="h-3 w-3" />
            High Stress Detected
          </Badge>
        }
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4 min-h-0">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 &&
            <div className="text-center py-8 space-y-4">
                <motion.div
                className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}>

                  <Bot className="h-10 w-10 text-primary" />
                </motion.div>
                <p className="text-sm text-muted-foreground">
                  {t('askAboutHealth')}
                </p>
                {healthData &&
              <Button onClick={analyzeHealth} variant="outline" className="gap-2">
                    <Bot className="h-4 w-4" />
                    Analyze My Health Data
                  </Button>
              }
              </div>
            }

            <AnimatePresence>
              {messages.map((message) =>
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                  {message.role === 'assistant' &&
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                }
                  <div
                  className={`rounded-lg p-3 !w-4/5 !h-full !max-w-[80%] ${
                  message.role === 'user' ?
                  'bg-primary text-primary-foreground' :
                  'bg-muted'}`
                  }>

                    <p className="whitespace-pre-line !w-[500px] !h-[741px] !text-[10px] !text-left !italic !opacity-40 !flex !flex-col !items-stretch !font-normal !italic">{message.content}</p>
                    {message.role === 'assistant' && voiceOutputEnabled &&
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-6 text-xs"
                    onClick={() => speakMessage(message.content)}
                    disabled={isSpeaking}>

                        <Volume2 className="h-3 w-3 mr-1" />
                        {isSpeaking ? 'Speaking...' : 'Play'}
                      </Button>
                  }
                  </div>
                  {message.role === 'user' &&
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                }
                </motion.div>
              )}
            </AnimatePresence>

            {isAnalyzing &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3">

                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{t('analyzing')}</p>
                </div>
              </motion.div>
            }
          </div>
        </ScrollArea>

        {/* Disclaimer */}
        <div className="flex-shrink-0 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-[10px] text-muted-foreground text-center">
            {t('disclaimer')}
          </p>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('askAboutHealth')}
            disabled={isAnalyzing}
            className="flex-1" />

          {voiceInputEnabled &&
          <Button
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            disabled={isAnalyzing}>

              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
          }
          <Button onClick={handleSend} disabled={!input.trim() || isAnalyzing} className="neon-glow">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>);

}