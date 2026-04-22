export type TestStep = 
  | 'dashboard'
  | 'onboarding'
  | 'visual-acuity'
  | 'contrast'
  | 'amsler'
  | 'photo'
  | 'calibration'
  | 'results'
  | 'history';

export interface Patient {
  id?: string;
  name: string;
  age: number;
  phone?: string;
  district?: string;
  block?: string;
  village?: string;
  externalId: string;
  ownerId: string;
  createdAt: any;
}

export interface TestResults {
  patientId?: string;
  visualAcuity?: {
    leftEye: string;
    rightEye: string;
  };
  contrast?: {
    score: number;
  };
  amsler?: {
    detectedDistortions: boolean;
  };
  photo?: {
    url?: string;
    base64?: string;
  };
  glareScore?: number;
  lensOpacity?: number;
  aiAssessment?: string;
  date?: any;
}

export type Eye = 'left' | 'right' | 'both';
