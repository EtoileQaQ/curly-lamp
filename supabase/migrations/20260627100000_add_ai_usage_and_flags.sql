-- Monitoring des coûts Anthropic : un log par appel IA, avec les tokens consommés.
CREATE TABLE IF NOT EXISTS ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  route text NOT NULL,
  model text,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour les requêtes de consommation par utilisateur et par période.
CREATE INDEX IF NOT EXISTS ai_usage_user_created_idx
  ON ai_usage (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS ai_usage_created_idx
  ON ai_usage (created_at DESC);

-- RLS activé sans policy : accès uniquement via la clé service_role (serveur).
-- Bloque toute lecture/écriture via la clé anon exposée au navigateur.
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Flags applicatifs globaux : sert de kill-switch d'urgence pour la génération IA.
CREATE TABLE IF NOT EXISTS app_flags (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Pour couper toute génération IA en urgence : passer enabled = true.
INSERT INTO app_flags (key, enabled)
VALUES ('api_disabled', false)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE app_flags ENABLE ROW LEVEL SECURITY;
