import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import multer from 'multer';
import { botRoutes } from '../../src/app/api/routes/botsRouter';
import { exportRoutes } from '../../src/app/api/routes/exportsRouter';
import { casesRoutes } from '../../src/app/api/routes/casesRouter';
import { clientsRoutes } from '../../src/app/api/routes/clientsRouter';
import { documentsRoutes } from '../../src/app/api/routes/documentsRouter';
import { screeningRoutes } from '../../src/app/api/routes/screeningRouter';
import { usersRoutes } from '../../src/app/api/routes/usersRouter';
import { austracRoutes } from '../../src/app/api/routes/austracRouter';
import { alertsRoutes } from '../../src/app/api/routes/alertsRouter';
import { integrationsRoutes } from '../../src/app/api/routes/integrationsRouter';
import { notificationsRoutes } from '../../src/app/api/routes/notificationsRouter';
import { createApiRouter } from '../../src/app/api/routes/router';
import type { ApiRouteRequest } from '../../src/app/api/routes/router';

const app = express();
const PORT = process.env.PORT ?? 3001;

// Security & middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Build combined router from all route modules
const allRoutes = [
  ...botRoutes,
  ...exportRoutes,
  ...casesRoutes,
  ...clientsRoutes,
  ...documentsRoutes,
  ...screeningRoutes,
  ...usersRoutes,
  ...austracRoutes,
  ...alertsRoutes,
  ...integrationsRoutes,
  ...notificationsRoutes,
];

const apiRouter = createApiRouter(allRoutes);

// ── File upload endpoint (multer handles multipart/form-data) ─────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

app.post('/api/documents/upload', upload.single('file'), async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const apiRequest: ApiRouteRequest = {
    method: 'POST',
    path: '/api/documents/upload',
    headers: req.headers as Record<string, string | undefined>,
    body: {
      buffer: file.buffer.toString('base64'),
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      ...req.body,
    },
    query: req.query as Record<string, string | undefined>,
  };

  try {
    const result = await apiRouter.handle(apiRequest);
    return res.status(result.statusCode).json(result.body);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Mount all other API routes via the custom router
app.use('/api', async (req: Request, res: Response) => {
  const apiRequest: ApiRouteRequest = {
    method: req.method as any,
    path: `/api${req.path}`,
    headers: req.headers as Record<string, string | undefined>,
    body: req.body,
    query: req.query as Record<string, string | undefined>,
  };

  try {
    const result = await apiRouter.handle(apiRequest);
    res.status(result.statusCode).json(result.body);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`GrowKYC API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`LOCAL_DEV mode: ${process.env.LOCAL_DEV === 'true'}`);
});

export default app;
