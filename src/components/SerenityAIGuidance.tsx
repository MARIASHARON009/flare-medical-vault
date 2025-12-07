import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Thermometer, Activity, Droplets, Wind, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { motion } from "framer-motion"
import type { HealthMetric } from "./HealthDashboard"

interface GuidanceItem {
  title: string
  description: string
  type: "lifestyle" | "action" | "emergency" | "monitoring"
}

interface MetricGuidance {
  icon: any
  color: string
  normal: GuidanceItem[]
  warning: GuidanceItem[]
  critical: GuidanceItem[]
}

const healthGuidance: Record<string, MetricGuidance> = {
  "heart-rate": {
    icon: Heart,
    color: "text-red-500",
    normal: [
      {
        title: "Continue Regular Exercise",
        description: "Aim for 150 minutes of moderate aerobic activity per week. Walking, swimming, or cycling are excellent choices.",
        type: "lifestyle"
      },
      {
        title: "Practice Stress Management",
        description: "Try deep breathing exercises, meditation, or yoga to maintain healthy stress levels and heart rate.",
        type: "action"
      },
      {
        title: "Monitor During Activity",
        description: "Track your heart rate during exercise to ensure you're in your target zone (50-85% of max heart rate).",
        type: "monitoring"
      }
    ],
    warning: [
      {
        title: "Reduce Caffeine Intake",
        description: "Limit coffee, energy drinks, and caffeinated beverages to 2-3 cups per day if experiencing elevated heart rate.",
        type: "lifestyle"
      },
      {
        title: "Practice Box Breathing",
        description: "Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 5 times to lower heart rate naturally.",
        type: "action"
      },
      {
        title: "Ensure Adequate Rest",
        description: "Get 7-9 hours of quality sleep. Poor sleep can elevate resting heart rate significantly.",
        type: "lifestyle"
      },
      {
        title: "Contact Doctor If Persistent",
        description: "If elevated heart rate continues for more than 2-3 days or is accompanied by chest discomfort, schedule a check-up.",
        type: "emergency"
      }
    ],
    critical: [
      {
        title: "⚠️ SEEK IMMEDIATE MEDICAL ATTENTION",
        description: "Heart rate above 120 bpm at rest or below 40 bpm requires immediate evaluation. Call emergency services or visit ER.",
        type: "emergency"
      },
      {
        title: "Stop All Physical Activity",
        description: "Sit or lie down immediately. Do not engage in any strenuous activity until evaluated by a healthcare provider.",
        type: "action"
      },
      {
        title: "Monitor for Additional Symptoms",
        description: "Watch for chest pain, shortness of breath, dizziness, fainting, or palpitations. Report all symptoms to emergency responders.",
        type: "monitoring"
      }
    ]
  },
  "temperature": {
    icon: Thermometer,
    color: "text-orange-500",
    normal: [
      {
        title: "Maintain Hydration",
        description: "Drink 8-10 glasses of water daily to support your body's natural thermoregulation.",
        type: "lifestyle"
      },
      {
        title: "Dress Appropriately",
        description: "Wear layers that can be adjusted based on your environment and activity level.",
        type: "action"
      },
      {
        title: "Track Daily Patterns",
        description: "Body temperature naturally fluctuates throughout the day. Morning temps are typically lowest, evening highest.",
        type: "monitoring"
      }
    ],
    warning: [
      {
        title: "Increase Fluid Intake",
        description: "Drink clear fluids every 1-2 hours if experiencing mild fever (37.3-38.5°C). Water, herbal tea, and broth are ideal.",
        type: "action"
      },
      {
        title: "Rest and Cool Down",
        description: "Rest in a cool room. Use cool (not cold) compresses on forehead and neck to help reduce elevated temperature.",
        type: "action"
      },
      {
        title: "Monitor Temperature Every 4 Hours",
        description: "Keep a temperature log. Take readings at consistent times to track trends.",
        type: "monitoring"
      },
      {
        title: "Contact Doctor If Prolonged",
        description: "Fever lasting more than 2-3 days or accompanied by severe symptoms requires medical evaluation.",
        type: "emergency"
      }
    ],
    critical: [
      {
        title: "⚠️ SEEK EMERGENCY CARE IMMEDIATELY",
        description: "Temperature above 39.4°C (103°F) or below 35°C (95°F) requires urgent medical attention. Do not delay.",
        type: "emergency"
      },
      {
        title: "Emergency Cooling Measures",
        description: "For high fever: Remove excess clothing, use lukewarm sponge bath, run cool water over wrists. For hypothermia: Warm gradually with blankets.",
        type: "action"
      },
      {
        title: "Do NOT Give Aspirin to Children",
        description: "For high fever in children, use acetaminophen or ibuprofen as directed. Never give aspirin to children under 18.",
        type: "emergency"
      }
    ]
  },
  "blood-pressure": {
    icon: Activity,
    color: "text-blue-500",
    normal: [
      {
        title: "Reduce Sodium Intake",
        description: "Limit salt to less than 2,300mg per day (about 1 teaspoon). Choose fresh foods over processed ones.",
        type: "lifestyle"
      },
      {
        title: "Exercise Regularly",
        description: "30 minutes of moderate activity most days helps maintain healthy blood pressure. Even light walking helps.",
        type: "action"
      },
      {
        title: "Maintain Healthy Weight",
        description: "If overweight, losing even 5-10 pounds can significantly improve blood pressure readings.",
        type: "lifestyle"
      }
    ],
    warning: [
      {
        title: "Implement DASH Diet",
        description: "Focus on fruits, vegetables, whole grains, lean proteins, and low-fat dairy. Limit saturated fats and sweets.",
        type: "lifestyle"
      },
      {
        title: "Reduce Alcohol Consumption",
        description: "Limit to 1 drink per day for women, 2 for men. Excessive alcohol raises blood pressure.",
        type: "lifestyle"
      },
      {
        title: "Practice Relaxation Techniques",
        description: "Daily meditation, deep breathing, or progressive muscle relaxation can help lower blood pressure by 5-10 mmHg.",
        type: "action"
      },
      {
        title: "Schedule Doctor Appointment",
        description: "If readings consistently exceed 130/80, consult your doctor about lifestyle changes or medication.",
        type: "emergency"
      }
    ],
    critical: [
      {
        title: "⚠️ HYPERTENSIVE CRISIS - CALL 911",
        description: "Blood pressure above 180/120 with symptoms (chest pain, shortness of breath, severe headache) is a medical emergency.",
        type: "emergency"
      },
      {
        title: "Sit Down and Rest Immediately",
        description: "Do not lie flat. Sit in a comfortable position and try to remain calm while waiting for emergency services.",
        type: "action"
      },
      {
        title: "Do Not Take Extra Medication",
        description: "Do not take additional blood pressure medication without medical guidance. This can cause dangerous drops.",
        type: "emergency"
      }
    ]
  },
  "blood-oxygen": {
    icon: Droplets,
    color: "text-cyan-500",
    normal: [
      {
        title: "Practice Deep Breathing",
        description: "Spend 5-10 minutes daily doing deep breathing exercises to optimize oxygen intake and lung capacity.",
        type: "action"
      },
      {
        title: "Improve Indoor Air Quality",
        description: "Ensure good ventilation. Use air purifiers if needed. Avoid smoking and secondhand smoke exposure.",
        type: "lifestyle"
      },
      {
        title: "Stay Physically Active",
        description: "Regular exercise improves oxygen circulation and lung efficiency. Cardio activities are especially beneficial.",
        type: "lifestyle"
      }
    ],
    warning: [
      {
        title: "Increase Breathing Exercises",
        description: "Practice pursed-lip breathing: Breathe in through nose for 2 counts, breathe out through pursed lips for 4 counts.",
        type: "action"
      },
      {
        title: "Check Your Environment",
        description: "Move to fresh air if indoors. High altitude or poor air quality can temporarily lower oxygen levels.",
        type: "action"
      },
      {
        title: "Sit Upright",
        description: "Sitting up straight or slightly forward can help improve oxygen intake and breathing efficiency.",
        type: "action"
      },
      {
        title: "Monitor Closely",
        description: "If SpO2 stays between 90-94% for more than a few hours or you feel short of breath, contact your doctor.",
        type: "emergency"
      }
    ],
    critical: [
      {
        title: "⚠️ CALL EMERGENCY SERVICES NOW",
        description: "Oxygen saturation below 90% is a medical emergency. Seek immediate medical care or call 911.",
        type: "emergency"
      },
      {
        title: "Sit Upright, Stay Calm",
        description: "Sit in an upright position. Try to remain calm to avoid increasing oxygen demand. Help is on the way.",
        type: "action"
      },
      {
        title: "Use Supplemental Oxygen If Available",
        description: "If you have home oxygen therapy equipment, use it as prescribed while waiting for emergency services.",
        type: "action"
      }
    ]
  },
  "respiratory": {
    icon: Wind,
    color: "text-green-500",
    normal: [
      {
        title: "Practice Diaphragmatic Breathing",
        description: "Place hand on belly, breathe deeply so belly rises. This strengthens respiratory muscles and improves efficiency.",
        type: "action"
      },
      {
        title: "Avoid Respiratory Irritants",
        description: "Stay away from smoke, strong chemicals, perfumes, and air pollution when possible.",
        type: "lifestyle"
      },
      {
        title: "Stay Active",
        description: "Regular physical activity keeps your lungs healthy and improves respiratory capacity over time.",
        type: "lifestyle"
      }
    ],
    warning: [
      {
        title: "Slow Down Your Breathing",
        description: "If breathing fast: Sit down, focus on taking slower, deeper breaths. Count to 4 on inhale, 6 on exhale.",
        type: "action"
      },
      {
        title: "Check for Triggers",
        description: "Identify what's causing rapid breathing - anxiety, exertion, environment. Remove trigger if possible.",
        type: "action"
      },
      {
        title: "Use Breathing Techniques",
        description: "Try 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8. Repeat 3-4 times to regulate breathing.",
        type: "action"
      },
      {
        title: "Contact Doctor If Persistent",
        description: "If rapid breathing (>20 breaths/min at rest) continues or you feel lightheaded, seek medical advice.",
        type: "emergency"
      }
    ],
    critical: [
      {
        title: "⚠️ SEVERE RESPIRATORY DISTRESS",
        description: "Breathing rate above 30 or below 8 breaths per minute, gasping for air, blue lips/fingers requires immediate emergency care.",
        type: "emergency"
      },
      {
        title: "Call 911 Immediately",
        description: "Do not drive yourself. Call emergency services. Severe respiratory distress can worsen rapidly.",
        type: "emergency"
      },
      {
        title: "Position for Easier Breathing",
        description: "Sit upright or lean slightly forward with arms supported. This position maximizes lung expansion.",
        type: "action"
      }
    ]
  },
  "mental-health": {
    icon: Brain,
    color: "text-purple-500",
    normal: [
      {
        title: "Maintain Sleep Routine",
        description: "Aim for 7-9 hours of quality sleep. Go to bed and wake up at the same time daily, even on weekends.",
        type: "lifestyle"
      },
      {
        title: "Practice Mindfulness",
        description: "Spend 10-15 minutes daily on meditation, deep breathing, or mindfulness exercises to maintain mental balance.",
        type: "action"
      },
      {
        title: "Stay Socially Connected",
        description: "Maintain regular contact with friends and family. Social connections are crucial for mental well-being.",
        type: "lifestyle"
      }
    ],
    warning: [
      {
        title: "Increase Self-Care Activities",
        description: "Engage in activities you enjoy daily. Exercise, hobbies, nature walks, or creative pursuits can boost mood.",
        type: "action"
      },
      {
        title: "Limit Stress Exposure",
        description: "Identify and reduce stressors where possible. Practice saying 'no' to non-essential commitments.",
        type: "lifestyle"
      },
      {
        title: "Consider Professional Support",
        description: "If mood is consistently low for 2+ weeks, consider talking to a therapist or counselor. Early intervention helps.",
        type: "action"
      },
      {
        title: "Avoid Alcohol as Coping Mechanism",
        description: "Alcohol can worsen anxiety and depression. Seek healthier coping strategies like exercise or talking to someone.",
        type: "lifestyle"
      }
    ],
    critical: [
      {
        title: "⚠️ CRISIS SUPPORT NEEDED",
        description: "If experiencing thoughts of self-harm or suicide, call 988 (Suicide & Crisis Lifeline) or 911 immediately. Help is available 24/7.",
        type: "emergency"
      },
      {
        title: "Reach Out Now",
        description: "Contact a trusted friend, family member, therapist, or crisis hotline. You don't have to face this alone.",
        type: "emergency"
      },
      {
        title: "Remove Means of Self-Harm",
        description: "If having thoughts of self-harm, remove access to means. Ask someone you trust for help staying safe.",
        type: "action"
      },
      {
        title: "Emergency Mental Health Services",
        description: "Visit nearest emergency room or crisis center for immediate psychiatric evaluation and support.",
        type: "emergency"
      }
    ]
  }
}

interface SerenityAIGuidanceProps {
  metrics: HealthMetric[]
}

export function SerenityAIGuidance({ metrics }: SerenityAIGuidanceProps) {
  const getStatusLevel = (status: string): "normal" | "warning" | "critical" => {
    if (status === "abnormal") return "critical"
    if (status === "warning") return "warning"
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "warning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "emergency": return AlertTriangle
      case "action": return CheckCircle2
      case "monitoring": return Activity
      case "lifestyle": return Heart
      default: return Info
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/20">
          <Brain className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Serenity AI Patient Guidance</h2>
          <p className="text-sm text-muted-foreground">Evidence-based self-care measures personalized to your current health status</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {metrics.map((metric, index) => {
          const guidance = healthGuidance[metric.id]
          if (!guidance) return null

          const statusLevel = getStatusLevel(metric.status)
          const measures = guidance[statusLevel]
          const Icon = guidance.icon

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-2 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br from-${guidance.color.split('-')[1]}-500/20 to-${guidance.color.split('-')[1]}-600/10`}>
                        <Icon className={`h-5 w-5 ${guidance.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{metric.label}</CardTitle>
                        <CardDescription>
                          Current: {metric.value} {metric.unit}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(statusLevel)} capitalize`}>
                      {statusLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {measures.map((measure, idx) => {
                    const MeasureIcon = getIconForType(measure.type)
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                        className={`p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                          measure.type === "emergency" 
                            ? "bg-red-500/10 border-red-500/30 hover:border-red-500/50" 
                            : "bg-accent/30 border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <MeasureIcon className={`h-4 w-4 ${
                              measure.type === "emergency" ? "text-red-400" :
                              measure.type === "action" ? "text-green-400" :
                              measure.type === "monitoring" ? "text-blue-400" :
                              "text-purple-400"
                            }`} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className={`text-sm font-semibold ${
                              measure.type === "emergency" ? "text-red-400" : ""
                            }`}>
                              {measure.title}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {measure.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Medical Disclaimer */}
      <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-yellow-400">Medical Disclaimer</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This guidance is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment decisions. In case of emergency, call 911 or your local emergency number immediately. Do not rely solely on this AI guidance for medical decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
