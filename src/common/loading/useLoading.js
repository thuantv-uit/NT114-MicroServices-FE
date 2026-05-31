/**
 * useLoading — Hook tái sử dụng cho mọi async action
 *
 * Cách dùng:
 *
 *   const [saving, save] = useLoading(handleSave);
 *   <LoadingButton loading={saving} onClick={save}>Save board</LoadingButton>
 *
 *   const [deleting, doDelete] = useLoading(async () => {
 *     await api.deleteBoard(id);
 *     navigate('/boards');
 *   });
 */

import { useState, useCallback } from 'react';

export const useLoading = (asyncFn) => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      return await asyncFn(...args);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  return [loading, run, error];
};

export default useLoading;
