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

export interface PipelineDataset {
  id: string;
  dataset_name: string;
  source: string;
  total_records: number;
  device_types: string[];
  attack_classes: string[];
  normal_ratio: number;
  attack_ratio: number;
  features_raw: number;
  features_after_gwo: number;
  split_strategy: string;
  non_iid_score: number;
  status: string;
  created_at: string;
}

export interface GWOOptimization {
  id: string;
  iteration: number;
  alpha_score: number;
  beta_score: number;
  delta_score: number;
  best_fitness: number;
  features_selected: number;
  feature_names: string[];
  convergence_data: unknown[];
  created_at: string;
}

export interface BiLSTMModel {
  id: string;
  epoch: number;
  train_loss: number;
  val_loss: number;
  train_acc: number;
  val_acc: number;
  precision: number;
  recall: number;
  f1_score: number;
  false_positive_rate: number;
  training_time_ms: number;
  created_at: string;
}

export interface XAIExplanation {
  id: string;
  threat_id: string;
  device_name: string;
  attack_type: string;
  predicted_class: string;
  confidence: number;
  actual_class: string | null;
  top_features: Array<{ feature: string; shap_value: number; direction: "positive" | "negative" }>;
  model_decision: string;
  timestamp: string;
}

export interface BlockchainNode {
  id: string;
  node_id: string;
  device_name: string;
  device_type: string;
  reputation_score: number;
  is_blocked: boolean;
  block_reason: string | null;
  updates_submitted: number;
  updates_accepted: number;
  updates_rejected: number;
  last_update_hash: string | null;
  first_seen: string;
  last_seen: string;
}

export interface BlockchainTransaction {
  id: string;
  tx_hash: string;
  block_number: number;
  node_id: string;
  device_name: string;
  round_number: number;
  update_hash: string;
  validation_score: number;
  status: "accepted" | "rejected" | "pending";
  rejection_reason: string | null;
  timestamp: string;
}

export interface PoisonAlert {
  id: string;
  node_id: string;
  device_name: string;
  round_number: number;
  attack_type: string;
  severity: "low" | "medium" | "high" | "critical";
  detection_method: string;
  anomaly_score: number;
  action_taken: "blocked" | "quarantined" | "flagged" | "recovered";
  description: string;
  timestamp: string;
}
