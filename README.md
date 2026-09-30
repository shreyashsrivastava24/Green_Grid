# GreenGrid – Smart Energy Management Information System (EMIS)

An Enterprise Smart Energy Management Information System for multi-campus energy monitoring, demand optimization, utility billing intelligence, renewable energy tracking, and algorithmic fault detection.

---

## ⚡ Tech Stack

### Backend Stack
- **Python 3.10+ / 3.14**
- **Django 5.x / 6.x**
- **Django REST Framework (DRF)**
- **SQL Database**: PostgreSQL preferred (with zero-config SQLite development fallback)
- **Django ORM** with database indexing and relations
- **JWT Authentication** (`djangorestframework-simplejwt`)
- **CORS Headers** (`django-cors-headers`)
- **Pandas** for diurnal regression baseline modeling and facility intensity calculations

### Frontend Stack
- **React 19 + JavaScript (ESNext) + Vite**
- **Tailwind CSS 4, Lucide Icons, Recharts**

---

## 📁 Django Project Structure

```text
Green_Grid/
├── backend/                 # Django REST Framework Backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   ├── .env
│   ├── .env.example
│   ├── greengrid/           # Django settings, URLs & WSGI
│   ├── users/               # Custom User model & JWT Authentication
│   ├── facilities/          # Campus Facility CRUD & seed_demo_data command
│   ├── energy/              # EnergyReading telemetry & Renewables
│   ├── billing/             # Utility statements & tariff calculation
│   ├── alerts/              # Rule-based threshold anomaly detection
│   ├── analytics/           # Dashboard KPIs & multivariate analytics
│   └── recommendations/     # Energy conservation measures & rule engine
│
├── frontend/                # React + JavaScript + Vite Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── jsconfig.json
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       ├── services/        # API client connecting to backend
│       └── data/
│
├── package.json             # Root monorepo orchestrator (npm start runs both)
├── start.bat                # 1-click Windows launcher
├── start.ps1                # PowerShell launcher
├── requirements.txt         # Root Python requirements
└── README.md
```


---

## 🚀 Setup Instructions

### 1. Prerequisites
- Python 3.10 or higher installed
- Node.js & npm (for the frontend)
- PostgreSQL (optional for local SQLite development, recommended for production)

### 2. Backend Virtual Environment Setup

From the project root:

```bash
# Create a virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
source .venv/bin/activate

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 3. Database & Environment Configuration

Copy `.env.example` to `.env` inside `backend/`:

```bash
cp .env.example .env
```

#### Option A: PostgreSQL (Production / Recommended)
Set `DB_ENGINE=postgresql` in `backend/.env`:


```env
SECRET_KEY=your-secure-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

DB_ENGINE=postgresql
DB_NAME=greengrid_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

Create the database in PostgreSQL:
```sql
CREATE DATABASE greengrid_db;
```

#### Option B: SQLite (Zero-Config Development Fallback)
Set `DB_ENGINE=sqlite` in `greengrid/.env` (default).

---

### 4. Database Migrations

Apply Django migrations to set up database tables and indexes:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 5. Seed Demo Data

Run the management command to populate realistic facilities, multi-period telemetry, utility statements, active alerts, and conservation recommendations:

```bash
python manage.py seed_demo_data
```

**Pre-seeded Demo Accounts:**
- **Chief Energy Officer (Admin):** `arjun.s@greengrid.internal` / `admin123`
- **Facility Manager:** `manager@greengrid.internal` / `manager123`

---

### 6. Start the Backend Server

```bash
python manage.py runserver 127.0.0.1:8000
```

The Django REST API is live at `http://127.0.0.1:8000/api/`.

---

### 7. Run the Frontend

In a separate terminal at the workspace root:

```bash
npm install
npm run dev
```

The frontend dashboard opens at `http://localhost:3001/` (or `http://localhost:5173/`).

---

## 📡 API Endpoint Documentation

All responses strictly follow the standardized GreenGrid API contract:

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Meaningful error message"
}
```

---

### 1. Authentication (`/api/auth/`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register new operator account (Admin or Facility Manager) |
| `POST` | `/api/auth/login/` | Authenticate with email & password, returning JWT tokens |
| `POST` | `/api/auth/demo/` | Pre-authenticated session for demo access |
| `POST` | `/api/auth/logout/` | End user session |
| `GET` | `/api/auth/me/` | Fetch current user profile (JWT protected) |
| `PUT` | `/api/auth/me/` | Update profile information |
| `POST` | `/api/auth/token/refresh/` | Obtain fresh access token via refresh token |

---

### 2. Facilities Management (`/api/facilities/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/facilities/` | List all campuses with optional query search (`?q=`) and status filter (`?status=`) |
| `GET` | `/api/facilities/<id>/` | Retrieve campus facility details by ID |
| `POST` | `/api/facilities/` | Register/provision a new facility |
| `PUT` | `/api/facilities/<id>/` | Update facility parameters, peak thresholds, or square footage |
| `DELETE` | `/api/facilities/<id>/` | De-provision facility from smart grid monitoring |

**Sample Facility Payload:**
```json
{
  "id": "fac-blr-01",
  "name": "Bangalore Tech Park Campus",
  "location": "Electronic City, Bengaluru",
  "type": "Commercial Tech Campus",
  "current_consumption": 420.5,
  "monthly_consumption": 48500.0,
  "estimated_cost": 388000.0,
  "renewable_percentage": 36.0,
  "status": "Normal",
  "solar_capacity_kwp": 160.0,
  "peak_threshold_kw": 460.0,
  "peak_usage_window": "14:00 – 17:30",
  "floor_area_sq_ft": 185000.0
}
```

---

### 3. Energy Telemetry & Readings (`/api/energy/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/energy/` | Filter readings by date range (`start_date`, `end_date`), interval (`hourly`, `daily`), or facility |
| `POST` | `/api/energy/` | Ingest live IoT telemetry meter reading |
| `GET` | `/api/energy/facility/<facility_id>/` | Historical readings for a specific campus |

---

### 4. Consolidated Dashboard API (`/api/dashboard/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/` | Consolidated enterprise KPIs, 24-hour diurnal trend, campus breakdown, active alerts, and recommendations |

---

### 5. Energy Analytics & Modeling (`/api/analytics/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/` | Multivariate analytics supporting `timeframe=24h,7d,30d,ytd`, facility filtering, baseline regression profiles, and energy intensity benchmark (kWh/sq ft) |

---

### 6. Billing & Utility Statements (`/api/billing/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/billing/` | List utility statements, monthly cost trends, and payment statuses |
| `POST` | `/api/billing/` | Generate monthly bill (`units consumed × tariff + demand charges - solar credit`) |
| `GET` | `/api/billing/<facility_or_bill_id>/` | Detailed statement by bill ID or facility |

---

### 7. Renewable Energy Intelligence (`/api/renewables/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/renewables/` | Solar generation yield, renewable offset %, grid dependency %, avoided Scope 2 CO2 (tonnes), and inverter performance matrix |

---

### 8. Alerts & Anomaly Detection (`/api/alerts/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/alerts/` | List alerts filtered by severity (`Critical`, `Warning`, `Info`) or status (`Active`, `Acknowledged`, `Resolved`) |
| `POST` | `/api/alerts/` | Log an operational anomaly |
| `PUT` | `/api/alerts/<id>/` | Acknowledge or resolve an incident |
| `POST` | `/api/alerts/test/` | Trigger a simulated inrush current spike alert |
| `POST` | `/api/alerts/check/` | Execute rule-based detection across campuses (flags load > contracted peak threshold) |

---

### 9. Energy Conservation Recommendations (`/api/recommendations/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recommendations/` | List recommendations filtered by priority (`High`, `Medium`, `Low`) or category |
| `GET` | `/api/recommendations/<id>/` | View engineering basis for a recommendation |
| `POST` | `/api/recommendations/` | Add custom energy conservation measure |
| `PUT` | `/api/recommendations/<id>/` | Toggle application status (`is_applied`) |
| `POST` | `/api/recommendations/generate/` | Rule-based recommendation engine evaluating peak demand and solar utilization |

---

## 🧪 Testing Backend Endpoints

A standalone automated test script is provided in `greengrid/test_apis.py`:

```bash
cd greengrid
python test_apis.py
```

Output:
```text
=== TESTING GREENGRID BACKEND ENDPOINTS ===
[PASS] GET /api/facilities/ -> Status: 200, Success: True
[PASS] GET /api/facilities/fac-blr-01/ -> Status: 200, Success: True
[PASS] GET /api/energy/ -> Status: 200, Success: True
[PASS] GET /api/energy/facility/fac-blr-01/ -> Status: 200, Success: True
[PASS] GET /api/renewables/ -> Status: 200, Success: True
[PASS] GET /api/billing/ -> Status: 200, Success: True
[PASS] GET /api/alerts/ -> Status: 200, Success: True
[PASS] GET /api/recommendations/ -> Status: 200, Success: True
[PASS] GET /api/dashboard/ -> Status: 200, Success: True
[PASS] GET /api/analytics/ -> Status: 200, Success: True
[PASS] POST /api/auth/demo/ -> Status: 200, Success: True
[PASS] POST /api/auth/login/ -> Status: 200, Success: True
[PASS] POST /api/alerts/check/ -> Status: 200, Success: True
[PASS] POST /api/recommendations/generate/ -> Status: 200, Success: True

ALL 14 CORE ENDPOINTS PASSED SUCCESSFULLY! [OK]
```
