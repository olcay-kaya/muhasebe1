
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

export interface Note {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Legislation {
  id: string;
  title: string;
  category: 'Muhasebe' | 'Maliye' | 'Genel';
  date: string;
  description: string;
  url?: string;
}

export interface TimeEvent {
  id: string;
  user_id: string;
  title: string;
  date: string;
  type: 'Seminar' | 'Meeting' | 'Plan';
  description?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
