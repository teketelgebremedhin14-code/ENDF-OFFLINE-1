
import React from 'react';

export enum ViewState {
  OVERVIEW = 'OVERVIEW',
  PRIME_MINISTER = 'PRIME_MINISTER', // New: PM Command Center
  PRESIDENTIAL = 'PRESIDENTIAL',
  MINISTRY = 'MINISTRY',
  COUNCIL = 'COUNCIL',
  CHIEF_OF_STAFF = 'CHIEF_OF_STAFF',
  WARGAMING = 'WARGAMING',
  OPERATIONS = 'OPERATIONS',
  GROUND_FORCES = 'GROUND_FORCES',
  AIR_FORCE = 'AIR_FORCE',
  NAVY = 'NAVY',
  SPECIAL_OPS = 'SPECIAL_OPS',
  INTELLIGENCE = 'INTELLIGENCE',
  ENGINEERING = 'ENGINEERING',
  LOGISTICS = 'LOGISTICS',
  PEACEKEEPING = 'PEACEKEEPING',
  TRAINING = 'TRAINING',
  HR = 'HR',
  FINANCE = 'FINANCE',
  LEGAL = 'LEGAL',
  HEALTH = 'HEALTH',
  COMMUNICATIONS = 'COMMUNICATIONS',
  INFO_OPS = 'INFO_OPS',
  INSPECTOR_GENERAL = 'INSPECTOR_GENERAL',
  FOREIGN_RELATIONS = 'FOREIGN_RELATIONS',
  VETERANS = 'VETERANS',
  SPACE_COMMAND = 'SPACE_COMMAND',
  AI_NEXUS = 'AI_NEXUS',
  INTEGRATION = 'INTEGRATION',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  PSYCH_EVAL = 'PSYCH_EVAL', // New Module
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color?: 'default' | 'danger' | 'warning' | 'success' | 'accent' | 'purple';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// Task Manager Types
export type Priority = 'low' | 'medium' | 'high';

export type SortOption = 'dueDate' | 'priority';

export type FilterStatus = 'all' | 'completed' | 'pending';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: 'pending' | 'in-progress' | 'completed';
  isCompleted: boolean;
}
