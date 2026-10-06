DO $$
DECLARE
  owner_id uuid := 'f860eca7-e81c-41dd-b9e8-aecb6a30af6e';
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
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = owner_id) THEN
    RAISE EXCEPTION 'Target auth user % does not exist', owner_id;
  END IF;

  FOREACH table_name IN ARRAY tables LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format('UPDATE public.%I SET user_id = $1', table_name) USING owner_id;
    END IF;
  END LOOP;
END $$;
