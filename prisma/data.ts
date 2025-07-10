import { AnnotationType, HeatingMethod, TempControl } from '@prisma/client';

export const moods = [
  { name: 'relaxed', description: 'Calm and at ease' },
  { name: 'energetic', description: 'Full of energy and vigor' },
  { name: 'creative', description: 'Inspired and imaginative' },
  { name: 'focused', description: 'Concentrated and attentive' },
  { name: 'sleepy', description: 'Drowsy and ready for rest' },
  { name: 'euphoric', description: 'Intense happiness and excitement' },
  { name: 'happy', description: 'Feeling or showing pleasure' },
  { name: 'sad', description: 'Feeling or showing sorrow' },
  { name: 'grateful', description: 'Feeling or showing appreciation' }
];

export const scenarios = [
  { name: 'solo_at_home', description: 'Alone in a home environment' },
  { name: 'on_the_go', description: 'While traveling or moving around' },
  { name: 'outdoor_activity', description: 'During outdoor recreation' },
  { name: 'party_sharing', description: 'Sharing with others at a gathering' },
  { name: 'travel', description: 'During trips away from home' },
  { name: 'in_the_car', description: 'While in a vehicle' },
  { name: 'at_the_club', description: 'At a nightclub or similar venue' }
];

export const contexts = [
  { name: 'daily_use', description: 'Regular, everyday usage' },
  { name: 'medical_relief', description: 'For medical symptom management' },
  { name: 'social_gathering', description: 'With friends or in social settings' },
  { name: 'special_occasion', description: 'For celebrations or important events' },
  { name: 'work_study', description: 'During productive activities' },
  { name: 'graduated', description: 'After completing an educational milestone' },
  { name: 'engaged', description: 'During engagement or commitment celebrations' },
  { name: 'birthday', description: 'During birthday celebrations' }
];

export const bestFors = [
  { name: 'microdosing', description: 'Using very small amounts' },
  { name: 'heavy_user', description: 'For those with high tolerance or usage' },
  { name: 'flavor_chaser', description: 'Prioritizing taste and aroma' },
  { name: 'cloud_chaser', description: 'Prioritizing vapor production' },
  { name: 'beginner_friendly', description: 'Easy to use for newcomers' },
  { name: 'group_sessions', description: 'Ideal for sharing with multiple people' },
  { name: 'concentrates', description: 'For use with concentrated extracts' }
];

export const deliveryMethods = [
  { name: 'whip', description: 'Flexible tube for direct inhalation' },
  { name: 'balloon', description: 'Vapor collection in an inflatable bag' },
  { name: 'direct_draw', description: 'Inhaling directly from the device' },
  { name: 'water_pipe_compatible', description: 'Can be used with water filtration' },
];

export const vaporizerData = [
  {
    name: 'Venty',
    manufacturer: 'Storz & Bickel',
    category: 'Portable',
    subCategory: 'premium',
    powerSource: 'battery',
    heatingMethod: HeatingMethod.HYBRID,
    tempControl: TempControl.DIGITAL,
    msrp: 449,
    regularPrice: 449,
    salePrice: 449,
    currentPrice: 449,
    bowlSizeGrams: '0.3',
    heatUpTimeSeconds: '20',
    expertScore: 9.5,
    userRating: 4.8,
    portabilityScore: 7.0,
    easeOfUseScore: 8.5,
    discreetnessScore: 6.0,
    enthusiastRating: 5,
    vaporQualitySummary: 'Exceptional vapor quality with adjustable airflow, setting a new benchmark for portable vaporizers.',
    efficiencySummary: 'Highly efficient hybrid heating extracts cannabinoids thoroughly.',
    easeOfUseSummary: 'Very easy to use with precise digital temperature control and clear display.',
    maintenanceSummary: 'Cooling unit requires regular cleaning.',
    communityFeedback: 'Overwhelmingly positive. Users praise airflow and vapor quality.',
    bestFor: ['heavy_user', 'vapor_quality_enthusiasts', 'tech_savvy_users'],
    moods: ['uplifting', 'focused', 'energetic', 'creative'],
    contexts: ['home', 'outdoors', 'at_home_office'],
    scenarios: ['productivity_session', 'hiking', 'brainstorming', 'deep_work'],
    deliveryMethods: ['direct_draw'],
    annotations: [
      { type: AnnotationType.PRO, text: 'Unmatched airflow and vapor quality.' },
      { type: AnnotationType.PRO, text: 'Heats up in a record-breaking 20 seconds.' },
      { type: AnnotationType.CON, text: 'Premium price tag.' },
      { type: AnnotationType.TIP, text: 'Use the app to fine-tune airflow.' },
      { type: AnnotationType.FEATURE, text: 'Adjustable airflow up to 20 L/min.' },
    ],
  },
  {
    name: 'Mighty+',
    manufacturer: 'Storz & Bickel',
    category: 'Portable',
    subCategory: 'workhorse',
    powerSource: 'battery',
    heatingMethod: HeatingMethod.HYBRID,
    tempControl: TempControl.DIGITAL,
    msrp: 399,
    regularPrice: 399,
    salePrice: 399,
    currentPrice: 399,
    bowlSizeGrams: '0.25',
    heatUpTimeSeconds: '60',
    expertScore: 9.2,
    userRating: 4.7,
    portabilityScore: 6.5,
    easeOfUseScore: 9.0,
    discreetnessScore: 5.0,
    enthusiastRating: 5,
    vaporQualitySummary: 'Consistently produces cool, smooth, medical-grade vapor.',
    efficiencySummary: 'Efficient extraction; dosing capsules recommended.',
    easeOfUseSummary: 'Simple up/down buttons for temperature control.',
    maintenanceSummary: 'Cooling unit needs regular cleaning.',
    communityFeedback: 'Regarded as one of the most reliable portables.',
    bestFor: ['medical_users', 'reliability_seekers', 'smooth_vapor_preference'],
    moods: ['calm', 'peaceful', 'soothed'],
    contexts: ['home', 'medical_relief', 'bedtime'],
    scenarios: ['evening_wind_down', 'pain_relief', 'stress_relief'],
    deliveryMethods: ['direct_draw'],
    annotations: [
      { type: AnnotationType.PRO, text: 'Extremely reliable performance.' },
      { type: AnnotationType.PRO, text: 'Cool, smooth vapor.' },
      { type: AnnotationType.CON, text: 'Bulky for a portable.' },
      { type: AnnotationType.TIP, text: 'Use dosing capsules for cleanliness.' },
      { type: AnnotationType.FEATURE, text: 'USB-C charging, ceramic bowl.' },
    ],
  },
];