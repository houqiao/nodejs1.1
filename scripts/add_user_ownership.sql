-- Run this once in the Supabase SQL editor before deploying the API changes.
-- Existing rows remain unassigned. Set their user_id manually after migration.
DO $$
DECLARE
  table_name text;
  tables text[] := ARRAY[
    'user_login_log', 'current', 'level_num', 'fund', 'studies_list', 'studies',
    'income', 'other_income', 'delever', 'stock', 'xiao_banquet', 'slimming',
    'home', 'su_dish', 'sichuan_dish', 'asset_records', 'travel_fund',
    'mortgage_loan', 'mortgage_prepayment', 't_sell_area', 'food', 'webfrond',
    'debt', 'debt_rerd', 'hourse', 'free_throw', 'hook', 'three_points',
    'children_dish', 'topic', 'clock_in'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format(
        'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE',
        table_name
      );
      EXECUTE format(
        'CREATE INDEX IF NOT EXISTS %I ON public.%I (user_id)',
        'idx_' || table_name || '_user_id', table_name
      );
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = table_name
          AND policyname = 'owner_only'
      ) THEN
        EXECUTE format(
          'CREATE POLICY owner_only ON public.%I FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
          table_name
        );
      END IF;
    END IF;
  END LOOP;
END $$;

-- After assigning every historical row, optionally make ownership mandatory:
-- ALTER TABLE public.income ALTER COLUMN user_id SET NOT NULL;
