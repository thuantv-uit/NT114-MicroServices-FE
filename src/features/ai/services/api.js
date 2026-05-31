/**
 * api.js — FE API layer for TimelineBot.
 *
 * Services:
 *   QUESTION_API  :3006  →  api_question.py  (POST /ask,   GET /health)
 *   ACTION_API    :3007  →  api_request.py   (POST /query, GET /health)
 */

import { QUESTION_API, ACTION_API } from '../../../services/axiosConfig';

// ── Shared POST helper ─────────────────────────────────────────────────────────
const postJSON = async (url, body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.error || err.detail || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  return res.json();
};


// ── Health checks ──────────────────────────────────────────────────────────────
/**
 * @typedef {'online' | 'offline' | 'checking'} HealthStatus
 */

/**
 * Ping a service's /health endpoint.
 * Resolves true if reachable and returns { status: "ok" }, false otherwise.
 * Hard timeout: 5 s — avoids hanging the UI indefinitely.
 *
 * @param {'question' | 'action'} service
 * @returns {Promise<boolean>}
 */
export const checkHealth = async (service) => {
  const base = service === 'question' ? QUESTION_API : ACTION_API;

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), 5000)
  );

  try {
    const res = await Promise.race([
      fetch(`${base}/health`),
      timeout,
    ]);

    if (!res.ok) return false;

    const data = await res.json();
    return data?.status === 'ok';
  } catch (_) {
    return false;
  }
};


// ── Question mode: POST /ask ───────────────────────────────────────────────────
/**
 * @param {string} question
 * @returns {Promise<string>}  answer text
 *
 * Contract:  { question } → { answer }
 */
export const askQuestion = async (question) => {
  const data = await postJSON(`${QUESTION_API}/ask`, { question });
  return data.answer;
};


// ── Action mode: POST /query ───────────────────────────────────────────────────
/**
 * @param {string} query
 * @returns {Promise<ActionResult[]>}
 *
 * @typedef {{ object: string, action: string, fields: Record<string,any> }} ActionResult
 *
 * Contract:  { query } → { success, results: ActionResult[], error? }
 */
export const parseActions = async (query) => {
  const data = await postJSON(`${ACTION_API}/query`, { query });

  if (!data.success) {
    throw new Error(data.error || 'Action parsing failed.');
  }

  return Array.isArray(data.results) ? data.results : [];
};