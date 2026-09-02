/*
# Full ML Pipeline Monitoring Tables

1. Purpose
   Adds tables to monitor the complete defense-grade ML pipeline:
   - Dataset loading & preprocessing (ToN-IoT)
   - GWO (Grey Wolf Optimizer) feature selection
   - BiLSTM deep learning model training
   - XAI (SHAP) explainability per detection
   - Blockchain poison attack detection & node blocking

2. New Tables
   - `pipeline_dataset` — dataset metadata and preprocessing stats
     - id (uuid PK), dataset_name (text), source (text), total_records (int),
     - device_types (text[]), attack_classes (text[]), normal_ratio (numeric),
     - attack_ratio (numeric), features_raw (int), features_after_gwo (int),
     - split_strategy (text), non_iid_score (numeric), status (text), created_at

   - `gwo_optimization` — Grey Wolf Optimizer feature selection results
     - id (uuid PK), iteration (int), alpha_score (numeric), beta_score (numeric),
     - delta_score (numeric), best_fitness (numeric), features_selected (int),
     - feature_names (text[]), convergence_data (jsonb), created_at

   - `bilstm_model` — BiLSTM training metrics per epoch
     - id (uuid PK), epoch (int), train_loss (numeric), val_loss (numeric),
     - train_acc (numeric), val_acc (numeric), precision (numeric), recall (numeric),
     - f1_score (numeric), false_positive_rate (numeric), training_time_ms (int),
     - created_at

   - `xai_explanations` — SHAP explanations for individual detections
     - id (uuid PK), threat_id (text), device_name (text), attack_type (text),
     - predicted_class (text), confidence (numeric), actual_class (text),
     - top_features (jsonb) — array of {feature, shap_value, direction},
     - model_decision (text), timestamp (timestamptz)

   - `blockchain_nodes` — FL participant nodes tracked on-chain
     - id (uuid PK), node_id (text), device_name (text), device_type (text),
     - reputation_score (numeric), is_blocked (boolean), block_reason (text),
     - updates_submitted (int), updates_accepted (int), updates_rejected (int),
     - last_update_hash (text), first_seen (timestamptz), last_seen (timestamptz)

   - `blockchain_transactions` — model update transactions on the chain
     - id (uuid PK), tx_hash (text), block_number (int), node_id (text),
     - device_name (text), round_number (int), update_hash (text),
     - validation_score (numeric), status (text) — accepted | rejected | pending,
     - rejection_reason (text), timestamp (timestamptz)

   - `poison_alerts` — detected poison attacks and blocking actions
     - id (uuid PK), node_id (text), device_name (text), round_number (int),
     - attack_type (text) — label_flip | model_poisoning | backdoor | byzantine,
     - severity (text) — low | medium | high | critical,
     - detection_method (text), anomaly_score (numeric),
     - action_taken (text) — blocked | quarantined | flagged | recovered,
     - description (text), timestamp (timestamptz)

3. Security
   - RLS enabled on all tables.
   - Single-tenant / no-auth → TO anon, authenticated with USING(true) / WITH CHECK(true).
   - Data is intentionally shared across the monitoring dashboard.

4. Indexes
   - gwo_optimization: iteration
   - bilstm_model: epoch
   - xai_explanations: threat_id
   - blockchain_nodes: node_id
   - blockchain_transactions: block_number, node_id, status
   - poison_alerts: node_id, severity
*/

-- Dataset table
CREATE TABLE IF NOT EXISTS pipeline_dataset (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_name text NOT NULL DEFAULT 'ToN-IoT',
  source text NOT NULL DEFAULT 'Telemetry & Network IoT Dataset',
  total_records integer NOT NULL DEFAULT 0,
  device_types text[] NOT NULL DEFAULT '{}',
  attack_classes text[] NOT NULL DEFAULT '{}',
  normal_ratio numeric NOT NULL DEFAULT 0,
  attack_ratio numeric NOT NULL DEFAULT 0,
  features_raw integer NOT NULL DEFAULT 0,
  features_after_gwo integer NOT NULL DEFAULT 0,
  split_strategy text NOT NULL DEFAULT 'Non-IID by device type',
  non_iid_score numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'loaded',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pipeline_dataset ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_pipeline_dataset" ON pipeline_dataset;
CREATE POLICY "anon_select_pipeline_dataset" ON pipeline_dataset FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_pipeline_dataset" ON pipeline_dataset;
CREATE POLICY "anon_insert_pipeline_dataset" ON pipeline_dataset FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_pipeline_dataset" ON pipeline_dataset;
CREATE POLICY "anon_update_pipeline_dataset" ON pipeline_dataset FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_pipeline_dataset" ON pipeline_dataset;
CREATE POLICY "anon_delete_pipeline_dataset" ON pipeline_dataset FOR DELETE
  TO anon, authenticated USING (true);

-- GWO Optimization table
CREATE TABLE IF NOT EXISTS gwo_optimization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iteration integer NOT NULL,
  alpha_score numeric NOT NULL DEFAULT 0,
  beta_score numeric NOT NULL DEFAULT 0,
  delta_score numeric NOT NULL DEFAULT 0,
  best_fitness numeric NOT NULL DEFAULT 0,
  features_selected integer NOT NULL DEFAULT 0,
  feature_names text[] NOT NULL DEFAULT '{}',
  convergence_data jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gwo_optimization ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gwo" ON gwo_optimization;
CREATE POLICY "anon_select_gwo" ON gwo_optimization FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_gwo" ON gwo_optimization;
CREATE POLICY "anon_insert_gwo" ON gwo_optimization FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_gwo" ON gwo_optimization;
CREATE POLICY "anon_update_gwo" ON gwo_optimization FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_gwo" ON gwo_optimization;
CREATE POLICY "anon_delete_gwo" ON gwo_optimization FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_gwo_iteration ON gwo_optimization(iteration);

-- BiLSTM Model table
CREATE TABLE IF NOT EXISTS bilstm_model (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  epoch integer NOT NULL,
  train_loss numeric NOT NULL DEFAULT 0,
  val_loss numeric NOT NULL DEFAULT 0,
  train_acc numeric NOT NULL DEFAULT 0,
  val_acc numeric NOT NULL DEFAULT 0,
  precision numeric NOT NULL DEFAULT 0,
  recall numeric NOT NULL DEFAULT 0,
  f1_score numeric NOT NULL DEFAULT 0,
  false_positive_rate numeric NOT NULL DEFAULT 0,
  training_time_ms integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bilstm_model ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bilstm" ON bilstm_model;
CREATE POLICY "anon_select_bilstm" ON bilstm_model FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bilstm" ON bilstm_model;
CREATE POLICY "anon_insert_bilstm" ON bilstm_model FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bilstm" ON bilstm_model;
CREATE POLICY "anon_update_bilstm" ON bilstm_model FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bilstm" ON bilstm_model;
CREATE POLICY "anon_delete_bilstm" ON bilstm_model FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_bilstm_epoch ON bilstm_model(epoch);

-- XAI Explanations table
CREATE TABLE IF NOT EXISTS xai_explanations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  threat_id text NOT NULL,
  device_name text NOT NULL,
  attack_type text NOT NULL,
  predicted_class text NOT NULL,
  confidence numeric NOT NULL DEFAULT 0,
  actual_class text,
  top_features jsonb NOT NULL DEFAULT '[]',
  model_decision text NOT NULL DEFAULT 'detect',
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE xai_explanations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_xai" ON xai_explanations;
CREATE POLICY "anon_select_xai" ON xai_explanations FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_xai" ON xai_explanations;
CREATE POLICY "anon_insert_xai" ON xai_explanations FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_xai" ON xai_explanations;
CREATE POLICY "anon_update_xai" ON xai_explanations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_xai" ON xai_explanations;
CREATE POLICY "anon_delete_xai" ON xai_explanations FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_xai_threat_id ON xai_explanations(threat_id);

-- Blockchain Nodes table
CREATE TABLE IF NOT EXISTS blockchain_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id text NOT NULL,
  device_name text NOT NULL,
  device_type text NOT NULL,
  reputation_score numeric NOT NULL DEFAULT 1.0,
  is_blocked boolean NOT NULL DEFAULT false,
  block_reason text,
  updates_submitted integer NOT NULL DEFAULT 0,
  updates_accepted integer NOT NULL DEFAULT 0,
  updates_rejected integer NOT NULL DEFAULT 0,
  last_update_hash text,
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now()
);

ALTER TABLE blockchain_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bc_nodes" ON blockchain_nodes;
CREATE POLICY "anon_select_bc_nodes" ON blockchain_nodes FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bc_nodes" ON blockchain_nodes;
CREATE POLICY "anon_insert_bc_nodes" ON blockchain_nodes FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bc_nodes" ON blockchain_nodes;
CREATE POLICY "anon_update_bc_nodes" ON blockchain_nodes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bc_nodes" ON blockchain_nodes;
CREATE POLICY "anon_delete_bc_nodes" ON blockchain_nodes FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_bc_nodes_node_id ON blockchain_nodes(node_id);

-- Blockchain Transactions table
CREATE TABLE IF NOT EXISTS blockchain_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash text NOT NULL,
  block_number integer NOT NULL,
  node_id text NOT NULL,
  device_name text NOT NULL,
  round_number integer NOT NULL,
  update_hash text NOT NULL,
  validation_score numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  rejection_reason text,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE blockchain_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bc_tx" ON blockchain_transactions;
CREATE POLICY "anon_select_bc_tx" ON blockchain_transactions FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_bc_tx" ON blockchain_transactions;
CREATE POLICY "anon_insert_bc_tx" ON blockchain_transactions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_bc_tx" ON blockchain_transactions;
CREATE POLICY "anon_update_bc_tx" ON blockchain_transactions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_bc_tx" ON blockchain_transactions;
CREATE POLICY "anon_delete_bc_tx" ON blockchain_transactions FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_bc_tx_block ON blockchain_transactions(block_number);
CREATE INDEX IF NOT EXISTS idx_bc_tx_node ON blockchain_transactions(node_id);
CREATE INDEX IF NOT EXISTS idx_bc_tx_status ON blockchain_transactions(status);

-- Poison Alerts table
CREATE TABLE IF NOT EXISTS poison_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id text NOT NULL,
  device_name text NOT NULL,
  round_number integer NOT NULL,
  attack_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  detection_method text NOT NULL,
  anomaly_score numeric NOT NULL DEFAULT 0,
  action_taken text NOT NULL DEFAULT 'flagged',
  description text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE poison_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_poison" ON poison_alerts;
CREATE POLICY "anon_select_poison" ON poison_alerts FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_poison" ON poison_alerts;
CREATE POLICY "anon_insert_poison" ON poison_alerts FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_poison" ON poison_alerts;
CREATE POLICY "anon_update_poison" ON poison_alerts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_poison" ON poison_alerts;
CREATE POLICY "anon_delete_poison" ON poison_alerts FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_poison_node ON poison_alerts(node_id);
CREATE INDEX IF NOT EXISTS idx_poison_severity ON poison_alerts(severity);
