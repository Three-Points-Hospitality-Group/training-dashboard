import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Buffer } from "buffer";

dotenv.config({ path: '.env.local' });
dotenv.config(); // also load .env if present

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

const EXPORT_CONFIG = {
  ADMIN_EMAIL: 'devin@threepointshospitality.com',
  ACCOUNT_ID: 'f9e05a9e-ccec-463e-beae-d1c5489f4c52',
  PASSWORD: process.env.TRAINUAL_PASSWORD || '',
  API_BASE: 'https://api.trainual.com/v1'
};

function buildAuthHeader() {
  const username = `${EXPORT_CONFIG.ADMIN_EMAIL}&${EXPORT_CONFIG.ACCOUNT_ID}`;
  return `Basic ${Buffer.from(`${username}:${EXPORT_CONFIG.PASSWORD}`).toString('base64')}`;
}

async function trainualFetch(endpoint: string, method: string = 'GET', payload?: any) {
  const url = `${EXPORT_CONFIG.API_BASE}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': buildAuthHeader(),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  if (payload) options.body = JSON.stringify(payload);

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 200 || response.status === 201) {
        const text = await response.text();
        return text ? JSON.parse(text) : {};
      }
      if (response.status === 204) return {};
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt + 1) * 1000));
        continue;
      }
      console.error(`Trainual API Error: ${response.status} ${response.statusText} for ${url}`);
      const errBody = await response.text().catch(() => '');
      console.error(`Response body: ${errBody.slice(0, 500)}`);
      return null;
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  return null;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: 'ok',
    passwordConfigured: !!EXPORT_CONFIG.PASSWORD,
    passwordLength: EXPORT_CONFIG.PASSWORD.length
  });
});

// API Routes
app.get("/api/trainual/users", async (req, res) => {
  const data = await trainualFetch('/users?curriculums_assigned=true&roles_assigned=true');
  res.json(data || []);
});

app.get("/api/trainual/subjects", async (req, res) => {
  const data = await trainualFetch('/curriculums?assigned_users=true');
  res.json(data || []);
});

app.get("/api/trainual/subjects/:id/tests", async (req, res) => {
  const data = await trainualFetch(`/curriculums/${req.params.id}/surveys`);
  res.json(data || []);
});

app.put("/api/trainual/users/:id/assign", async (req, res) => {
  const { curriculum_ids } = req.body;
  const data = await trainualFetch(`/users/${req.params.id}/assign_curriculums`, 'PUT', { curriculum_ids });
  res.json(data || { success: false });
});

app.put("/api/trainual/users/:id/unassign", async (req, res) => {
  const { curriculum_ids } = req.body;
  const data = await trainualFetch(`/users/${req.params.id}/unassign_curriculums`, 'PUT', { curriculum_ids });
  res.json(data || { success: false });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Trainual API server running on http://localhost:${PORT}`);
});
