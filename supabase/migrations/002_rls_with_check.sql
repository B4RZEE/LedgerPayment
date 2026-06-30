-- Harden RLS: ensure FK references can only point to rows the user owns.
-- Replaces the three policies that have cross-table FKs.

-- accounts: firm_id must belong to the same user
DROP POLICY IF EXISTS "own accounts" ON accounts;
CREATE POLICY "own accounts" ON accounts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      firm_id IS NULL
      OR EXISTS (
        SELECT 1 FROM firms
        WHERE firms.id = firm_id
          AND firms.user_id = auth.uid()
      )
    )
  );

-- payouts: firm_id and account_id must both belong to the same user
DROP POLICY IF EXISTS "own payouts" ON payouts;
CREATE POLICY "own payouts" ON payouts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      firm_id IS NULL
      OR EXISTS (
        SELECT 1 FROM firms
        WHERE firms.id = firm_id
          AND firms.user_id = auth.uid()
      )
    )
    AND (
      account_id IS NULL
      OR EXISTS (
        SELECT 1 FROM accounts
        WHERE accounts.id = account_id
          AND accounts.user_id = auth.uid()
      )
    )
  );

-- spending: same as payouts
DROP POLICY IF EXISTS "own spending" ON spending;
CREATE POLICY "own spending" ON spending
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      firm_id IS NULL
      OR EXISTS (
        SELECT 1 FROM firms
        WHERE firms.id = firm_id
          AND firms.user_id = auth.uid()
      )
    )
    AND (
      account_id IS NULL
      OR EXISTS (
        SELECT 1 FROM accounts
        WHERE accounts.id = account_id
          AND accounts.user_id = auth.uid()
      )
    )
  );
