export interface NeisTimetableRow {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  AY: string;
  SEM: string;
  ALL_TI_YMD: string;
  DGHT_CRSE_SC_NM: string;
  ORD_SC_NM: string;
  DDDEP_NM: string;
  GRADE: string;
  CLRM_NM: string;
  CLASS_NM: string;
  PERIO: string;
  ITRT_CNTNT: string;
  LOAD_DTM: string;
}

export interface NeisApiResponse {
  hisTimetable?: [
    {
      head: [
        { list_total_count: number },
        { RESULT: { CODE: string; MESSAGE: string } }
      ];
    },
    {
      row: NeisTimetableRow[];
    }
  ];
  RESULT?: {
    CODE: string;
    MESSAGE: string;
  };
}

export type SubjectCategory = 'ncs_practical' | 'specialized' | 'general' | 'creative' | 'other';

export interface TimetableSlot {
  period: number;
  timeRange: string;
  subject: string;
  originalSubject: string;
  department: string;
  grade: number;
  classNum: number;
  date: string;
  dayOfWeek: string;
  category: SubjectCategory;
  isNcs: boolean;
}

export interface DepartmentInfo {
  name: string;
  shortName: string;
  code: string;
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  description: string;
}

export interface SchoolClassInfo {
  grade: number;
  classNum: number;
  department: string;
}

export interface PeriodInfo {
  period: number;
  label: string;
  startTime: string;
  endTime: string;
}

export type AssignmentPriority = 'normal' | 'high' | 'urgent';

export interface Assignment {
  id: string;
  grade: number;
  classNum: number;
  subject: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: AssignmentPriority;
  isCompleted: boolean;
  createdAt: string;
  period?: number;
}

