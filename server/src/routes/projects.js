import { Router } from 'express';
import { pool, parseJson } from '../db.js';
import { safeUrl } from '../security.js';

const router = Router();

// GET /api/projects: projetos publicados, na ordem definida em sort_order
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT slug, title, status, display_url, demo_url, repo_url, stack, images, content
         FROM projects
        WHERE published = 1
        ORDER BY sort_order ASC, id ASC`
    );

    const projects = rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      status: row.status,
      displayUrl: row.display_url,
      // Links só http(s): um valor como javascript: no banco não chega ao site
      demoUrl: safeUrl(row.demo_url),
      repoUrl: safeUrl(row.repo_url),
      stack: parseJson(row.stack, []),
      images: parseJson(row.images, []),
      content: parseJson(row.content, {}),
    }));

    res.json(projects);
  } catch (err) {
    console.error('[projects] erro ao consultar o banco:', err.message);
    res.status(503).json({ error: 'unavailable' });
  }
});

export default router;
