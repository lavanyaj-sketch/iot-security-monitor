/*
# Seed complete pipeline demonstration data

1. Purpose
   Provides a small, clearly labeled demonstration dataset for the monitoring dashboard.
   These rows represent a completed ToN-IoT preprocessing run, GWO feature selection,
   BiLSTM training, SHAP explanations, and a poison-update blocking event.

2. Tables populated
   - pipeline_dataset: one dataset profile.
   - gwo_optimization: ten optimizer iterations.
   - bilstm_model: ten training epochs.
   - xai_explanations: three operator-readable model explanations.
   - blockchain_nodes: five participating nodes, one blocked.
   - blockchain_transactions: four audited model updates.
   - poison_alerts: one blocked model-poisoning attempt.

3. Security
   All tables already have single-tenant anon + authenticated CRUD policies from the
   pipeline tables migration. This migration only inserts demonstration rows.

4. Important note
   The records are safe demonstration values and can be replaced by the Python pipeline
   when real experiment outputs are available.
*/

INSERT INTO pipeline_dataset (dataset_name, source, total_records, device_types, attack_classes, normal_ratio, attack_ratio, features_raw, features_after_gwo, split_strategy, non_iid_score, status)
SELECT 'ToN-IoT', 'Telemetry and Network IoT Dataset', 2110437,
  ARRAY['Industrial gateway','IP camera','Environmental sensor','Smart meter','Access control'],
  ARRAY['DDoS','DoS','Reconnaissance','Injection','Credential theft','Normal'],
  0.42, 0.58, 46, 14, 'Non-IID by device type', 0.74, 'ready'
WHERE NOT EXISTS (SELECT 1 FROM pipeline_dataset);

INSERT INTO gwo_optimization (iteration, alpha_score, beta_score, delta_score, best_fitness, features_selected, feature_names)
SELECT i, 0.71 + (i * 0.023), 0.68 + (i * 0.024), 0.64 + (i * 0.025), 0.67 + (i * 0.025), GREATEST(14, 28 - (i * 2)),
  ARRAY['flow_duration','src_bytes','dst_bytes','packet_rate','protocol_type','conn_state','service','failed_logins','count','srv_count','same_srv_rate','dst_host_rate','byte_ratio','jitter']
FROM generate_series(1, 10) AS i
WHERE NOT EXISTS (SELECT 1 FROM gwo_optimization);

INSERT INTO bilstm_model (epoch, train_loss, val_loss, train_acc, val_acc, precision, recall, f1_score, false_positive_rate, training_time_ms)
SELECT i, 0.41 - (i * 0.034), 0.45 - (i * 0.031), 0.78 + (i * 0.019), 0.75 + (i * 0.021), 0.81 + (i * 0.017), 0.79 + (i * 0.018), 0.80 + (i * 0.018), 0.08 - (i * 0.006), 18000
FROM generate_series(1, 10) AS i
WHERE NOT EXISTS (SELECT 1 FROM bilstm_model);

INSERT INTO xai_explanations (threat_id, device_name, attack_type, predicted_class, confidence, actual_class, top_features, model_decision)
SELECT * FROM (VALUES
  ('THRT-2026-0841', 'Security Camera — North Entrance', 'Unauthorized Access Attempt', 'Brute Force', 0.984, 'Brute Force', '[{"feature":"failed_logins","shap_value":0.42,"direction":"positive"},{"feature":"packet_rate","shap_value":0.31,"direction":"positive"},{"feature":"src_bytes","shap_value":0.18,"direction":"positive"},{"feature":"conn_state","shap_value":-0.12,"direction":"negative"}]'::jsonb, 'block'),
  ('THRT-2026-0839', 'HVAC Controller Unit', 'Anomalous Traffic Spike', 'DDoS', 0.927, 'DDoS', '[{"feature":"dst_host_rate","shap_value":0.38,"direction":"positive"},{"feature":"byte_ratio","shap_value":0.27,"direction":"positive"},{"feature":"count","shap_value":0.20,"direction":"positive"}]'::jsonb, 'investigate'),
  ('THRT-2026-0838', 'Smart Meter — Block C', 'Unencrypted Channel', 'Policy Violation', 0.891, 'Policy Violation', '[{"feature":"service","shap_value":0.35,"direction":"positive"},{"feature":"protocol_type","shap_value":0.29,"direction":"positive"},{"feature":"jitter","shap_value":-0.08,"direction":"negative"}]'::jsonb, 'remediate')
) AS demo(threat_id, device_name, attack_type, predicted_class, confidence, actual_class, top_features, model_decision)
WHERE NOT EXISTS (SELECT 1 FROM xai_explanations);

INSERT INTO blockchain_nodes (node_id, device_name, device_type, reputation_score, is_blocked, block_reason, updates_submitted, updates_accepted, updates_rejected, last_update_hash)
SELECT * FROM (VALUES
  ('NODE-001','Factory Floor Gateway','Industrial Gateway',0.99,false,NULL,28,28,0,'7f2c...91ad'),
  ('NODE-002','HVAC Controller Unit','Environmental Sensor',0.94,false,NULL,28,27,1,'3aa1...f03b'),
  ('NODE-003','Security Camera — North Entrance','IP Camera',0.18,true,'Model update anomaly: cosine distance 0.92',25,22,3,'91e0...8c11'),
  ('NODE-004','Smart Lock — Server Room','Access Control',0.98,false,NULL,28,28,0,'b772...6e2a'),
  ('NODE-005','Temperature Sensor Array','Environmental Sensor',0.97,false,NULL,27,27,0,'5c4f...0d82')
) AS demo(node_id, device_name, device_type, reputation_score, is_blocked, block_reason, updates_submitted, updates_accepted, updates_rejected, last_update_hash)
WHERE NOT EXISTS (SELECT 1 FROM blockchain_nodes);

INSERT INTO blockchain_transactions (tx_hash, block_number, node_id, device_name, round_number, update_hash, validation_score, status, rejection_reason)
SELECT * FROM (VALUES
  ('0x8e42...a91f',1842,'NODE-003','Security Camera — North',28,'91e0...8c11',0.08,'rejected','Byzantine update: outside aggregate distance'),
  ('0x7a19...c32d',1841,'NODE-002','HVAC Controller Unit',28,'3aa1...f03b',0.89,'accepted',NULL),
  ('0x4f08...b720',1840,'NODE-005','Temperature Sensor Array',28,'5c4f...0d82',0.96,'accepted',NULL),
  ('0x2b91...e31a',1839,'NODE-001','Factory Floor Gateway',28,'7f2c...91ad',0.98,'accepted',NULL)
) AS demo(tx_hash, block_number, node_id, device_name, round_number, update_hash, validation_score, status, rejection_reason)
WHERE NOT EXISTS (SELECT 1 FROM blockchain_transactions);

INSERT INTO poison_alerts (node_id, device_name, round_number, attack_type, severity, detection_method, anomaly_score, action_taken, description)
SELECT 'NODE-003','Security Camera — North Entrance',28,'model_poisoning','critical','Cosine distance + reputation',0.92,'blocked','Update deviated sharply from the trusted global model. Node blocked before aggregation.'
WHERE NOT EXISTS (SELECT 1 FROM poison_alerts);
