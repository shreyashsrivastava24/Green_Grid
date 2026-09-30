# GreenGrid – Smart Energy Management Information System (EMIS) Backend

Django REST Framework backend for GreenGrid Smart Energy Management Information System.

## Architecture
- **Framework:** Django + Django REST Framework (DRF)
- **Database:** PostgreSQL (with SQLite zero-config development fallback)
- **Auth:** JWT Authentication (`djangorestframework-simplejwt`)
- **Analysis:** Pandas regression baselining and campus benchmarking

## Setup
```bash
# 1. Activate virtual environment
..\.venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply migrations
python manage.py makemigrations
python manage.py migrate

# 4. Seed demo data
python manage.py seed_demo_data

# 5. Run tests
python comprehensive_test.py

# 6. Start development server
python manage.py runserver 127.0.0.1:8000
```

## Seed Credentials
- **Admin:** `arjun.s@greengrid.internal` / `admin123`
- **Facility Manager:** `manager@greengrid.internal` / `manager123`

Refer to the root [README.md](../README.md) for full API documentation.
