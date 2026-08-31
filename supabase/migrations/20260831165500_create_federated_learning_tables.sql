/*
# Federated Learning Monitoring Tables

1. Purpose
   Adds tables to monitor a federated learning (FL) system across heterogeneous IoT devices.
   Tracks FL training rounds, per-device contributions (local training metrics), and
   aggregated global model metrics over time. This is a single-tenant app with no sign-in,
   so all policies are open to anon + authenticated.

2. New Tables
   - `fl_rounds` — one row per FL aggregation round
     - id (uuid PK)
     - round_number (int, unique) — sequential round index
     - status (text) — pending | training | aggregating | completed | failed
     - participating_devices (int) — how many devices contributed
     - total_devices (int) — total devices eligible
     - global_accuracy (numeric) — aggregated model accuracy after this round
     - global_loss (numeric) — aggregated model loss after this round
     - aggregation_strategy (text) — e.g. FedAvg, FedProx, FedBN
     - privacy_budget (numeric) — remaining epsilon for differential privacy
     - started_at, completed_at (timestamptz)

   - `fl_device_contributions` — per-device per-round local training data
     - id (uuid PK)
     - round_id (uuid FK -> fl_rounds.id ON DELETE CASCADE)
     - device_id (text) — references the IoT device's string ID (e.g. DEV-001)
     - device_name (text)
     - device_type (text) — heterogeneous device category
     - status (text) — selected | training | uploaded | dropped
     - local_accuracy (numeric)
     - local_loss (numeric)
     - samples_trained (int) — number of local data samples
     - compute_time_ms (int) — time taken for local training
     - bandwidth_used_kb (numeric) — upload bandwidth
     - data_heterogeneity (numeric) — non-IID skew measure (0-1)

   - `fl_model_history` — global model convergence over time
     - id (uuid PK)
     - round_number (int)
     - accuracy (numeric)
     - loss (numeric)
     - validation_accuracy (numeric)
     - created_at (timestamptz)

3. Security
   - RLS enabled on all three tables.
   - All tables are single-tenant / no-auth → TO anon, authenticated with USING(true) / WITH CHECK(true)
     because the data is intentionally shared across the monitoring dashboard.

4. Indexes
   - fl_rounds: round_number (unique)
   - fl_device_contributions: round_id, device_id
   - fl_model_history: round_number
*/

CREATE TABLE IF NOT EXISTS fl_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_number integer UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  participating_devices integer NOT NULL DEFAULT 0,
  total_devices integer NOT NULL DEFAULT 0,
  global_accuracy numeric NOT NULL DEFAULT 0,
  global_loss numeric NOT NULL DEFAULT 0,
  aggregation_strategy text NOT NULL DEFAULT 'FedAvg',
  privacy_budget numeric NOT NULL DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE fl_rounds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_fl_rounds" ON fl_rounds;
CREATE POLICY "anon_select_fl_rounds" ON fl_rounds FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_fl_rounds" ON fl_rounds;
CREATE POLICY "anon_insert_fl_rounds" ON fl_rounds FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_fl_rounds" ON fl_rounds;
CREATE POLICY "anon_update_fl_rounds" ON fl_rounds FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_fl_rounds" ON fl_rounds;
CREATE POLICY "anon_delete_fl_rounds" ON fl_rounds FOR DELETE
  TO anon, authenticated USING (true);


CREATE TABLE IF NOT EXISTS fl_device_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES fl_rounds(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  device_name text NOT NULL,
  device_type text NOT NULL,
  status text NOT NULL DEFAULT 'selected',
  local_accuracy numeric NOT NULL DEFAULT 0,
  local_loss numeric NOT NULL DEFAULT 0,
  samples_trained integer NOT NULL DEFAULT 0,
  compute_time_ms integer NOT NULL DEFAULT 0,
  bandwidth_used_kb numeric NOT NULL DEFAULT 0,
  data_heterogeneity numeric NOT NULL DEFAULT 0
);

ALTER TABLE fl_device_contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_fl_contributions" ON fl_device_contributions;
CREATE POLICY "anon_select_fl_contributions" ON fl_device_contributions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_fl_contributions" ON fl_device_contributions;
CREATE POLICY "anon_insert_fl_contributions" ON fl_device_contributions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_fl_contributions" ON fl_device_contributions;
CREATE POLICY "anon_update_fl_contributions" ON fl_device_contributions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_fl_contributions" ON fl_device_contributions;
CREATE POLICY "anon_delete_fl_contributions" ON fl_device_contributions FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_fl_contributions_round_id ON fl_device_contributions(round_id);
CREATE INDEX IF NOT EXISTS idx_fl_contributions_device_id ON fl_device_contributions(device_id);


CREATE TABLE IF NOT EXISTS fl_model_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_number integer NOT NULL,
  accuracy numeric NOT NULL DEFAULT 0,
  loss numeric NOT NULL DEFAULT 0,
  validation_accuracy numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fl_model_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_fl_model_history" ON fl_model_history;
CREATE POLICY "anon_select_fl_model_history" ON fl_model_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_fl_model_history" ON fl_model_history;
CREATE POLICY "anon_insert_fl_model_history" ON fl_model_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_fl_model_history" ON fl_model_history;
CREATE POLICY "anon_update_fl_model_history" ON fl_model_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_fl_model_history" ON fl_model_history;
CREATE POLICY "anon_delete_fl_model_history" ON fl_model_history FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_fl_model_history_round ON fl_model_history(round_number);
