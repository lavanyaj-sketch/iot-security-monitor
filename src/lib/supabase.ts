import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FLRound {
  id: string;
  round_number: number;
  status: string;
  participating_devices: number;
  total_devices: number;
  global_accuracy: number;
  global_loss: number;
  aggregation_strategy: string;
  privacy_budget: number;
  started_at: string;
  completed_at: string | null;
}

export interface FLDeviceContribution {
  id: string;
  round_id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  local_accuracy: number;
  local_loss: number;
  samples_trained: number;
  compute_time_ms: number;
  bandwidth_used_kb: number;
  data_heterogeneity: number;
}

export interface FLModelHistory {
  id: string;
  round_number: number;
  accuracy: number;
  loss: number;
  validation_accuracy: number;
  created_at: string;
}
