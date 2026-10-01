# GreenGrid – Extracted Project Data for SRS/ISS Requirements

## 1. Project Title
GreenGrid – Smart Energy Management Information System (EMIS)

## 2. Project Overview
GreenGrid is an enterprise-level energy management platform designed to monitor multi-campus energy usage, optimize demand, analyze utility billing, track renewable generation, and detect anomalies in real time. The project combines a Django REST API backend with a React + Vite frontend and supports facility monitoring for commercial, industrial, and campus environments.

### Project Objective
The system helps organizations reduce electricity costs, avoid peak demand penalties, improve renewable energy utilization, and maintain operational efficiency across facilities.

### Core Problem Addressed
Enterprises managing multiple facilities often face:
- fragmented energy data across campuses
- poor visibility into peak demand and power factor issues
- high electricity bills due to poor tariff optimization
- limited renewable energy tracking
- lack of automated alerts for inefficient energy usage

## 3. System Context and Domain
Domain: Energy management and sustainability analytics

Project type:
- Smart Energy Management Information System
- Dashboard-driven monitoring platform
- Facility and utility data management system

## 4. Stakeholders / Users
### Primary Users
1. Admin / Chief Energy Officer
   - monitors all facilities
   - reviews enterprise-wide dashboards and alerts
   - manages policies and system-wide energy reporting

2. Facility Manager
   - manages one or more facilities
   - reviews local energy performance, billing, and alerts
   - receives actionable recommendations for energy optimization

### Internal Actors
- Facility operations team
- Sustainability team
- Utility/energy billing team
- Building automation / maintenance team

## 5. Functional Modules / Major Features
### 5.1 Authentication and User Management
- User registration
- Login using email and password
- JWT-based authentication
- Profile retrieval and update
- Demo admin access

### 5.2 Facility Management
- Add new facility
- Update facility details
- Search/filter facilities by name and status
- Monitor facility-level metrics like:
  - current consumption
  - monthly consumption
  - renewable share
  - peak threshold
  - grid share percentage
  - estimated monthly cost

### 5.3 Energy Monitoring and Telemetry
- Store hourly, daily, and monthly energy readings
- Track:
  - consumption in kWh
  - grid consumption
  - solar generation
  - cost calculations
- Monitor time-based patterns for peak-demand windows

### 5.4 Renewable Energy Intelligence
- Track solar generation and renewable contribution
- Monitor renewable percentage and grid dependence
- Assess solar offset and cost savings

### 5.5 Billing and Utility Statement Management
- Create and track utility bills
- Store billing period, invoice number, tariff, taxes, demand charges, and solar credits
- View bill status: Paid, Due, Overdue, Pending
- Calculate net billed units and final payable amount

### 5.6 Alerts and Anomaly Detection
- Generate active alerts for threshold breaches
- Alert categories include:
  - peak demand exceeded
  - HVAC anomaly
  - inverter underperformance
  - power factor degradation
  - off-hours load anomaly
- Alert states:
  - Active
  - Acknowledged
  - Resolved

### 5.7 Recommendations Engine
- Generate corrective recommendations with priorities:
  - High
  - Medium
  - Low
- Categories include:
  - Peak Shaving
  - HVAC Optimization
  - Lighting
  - Solar & Battery
  - Equipment Schedule
- Estimate savings in kWh and INR
- Mark recommendation as applied

### 5.8 Dashboard and Analytics
- Overview of enterprise energy consumption
- KPI-based dashboard analytics
- Multi-facility comparison
- Cost and usage trends
- Renewable contribution analysis

## 6. Project Scope
### In Scope
- Multi-facility energy monitoring
- Renewable energy tracking
- Utility billing support
- Alert generation and status handling
- Dashboard analytics and comparison views
- Recommendations for energy conservation
- Demo data seeding for simulation

### Out of Scope
- Real IoT sensor integration (in current project implementation, data is largely seeded/demo based)
- Real-time machine learning forecasting beyond baseline analytics
- ERP or SCADA integration
- Native mobile application
- Complex production-grade billing reconciliation with external utility APIs

## 7. Functional Requirements Summary
### FR1: User Authentication
The system shall allow users to register, login, and obtain JWT-based access tokens.

### FR2: Facility Registration
The system shall allow authorized users to add and manage facility records with attributes like name, type, location, consumption, renewable share, and peak threshold.

### FR3: Telemetry Storage
The system shall store energy readings with date, timestamp, interval type, consumption, grid usage, solar generation, and cost.

### FR4: Monitoring Dashboard
The system shall present dashboard data for all facilities and selected facility views.

### FR5: Billing Records
The system shall record utility bills with invoice, billing period, tariff, charges, taxes, solar credits, and payment status.

### FR6: Alert Management
The system shall detect abnormal conditions and raise alerts with severity, metric, current value, threshold, and status.

### FR7: Recommendation Management
The system shall generate energy-saving recommendations and allow marking them as applied.

### FR8: Renewable Energy Measurement
The system shall track site-wise solar generation and renewable-energy share in percentage.

### FR9: Search and Filtering
The system shall support search and filtering for facilities, bills, alerts, and recommendations.

## 8. Non-Functional Requirements
### Performance
- Dashboard and API responses should load quickly for standard facility queries.
- System should support multiple facility operations and parallel data retrieval.

### Reliability
- API response format should remain consistent for success and error responses.
- Data should be persisted reliably via Django ORM and database models.

### Security
- JWT authentication should secure protected endpoints.
- User passwords must be hashed using Django authentication system.
- CORS should be configured for frontend-backend communication.

### Usability
- Dashboard should be intuitive and visual for operations decision-making.
- Users should be able to navigate pages such as dashboard, facilities, analytics, bills, alerts, and recommendations.

### Maintainability
- Code is organized into Django apps: users, facilities, energy, billing, alerts, analytics, recommendations.
- System architecture supports extension of modules and features.

## 9. Technology Stack Extracted from Project
### Backend
- Python 3.10+
- Django 5.x / 6.x
- Django REST Framework
- PostgreSQL (recommended)
- SQLite (fallback for development)
- JWT authentication
- Pandas for analytics calculations

### Frontend
- React 19
- JavaScript (ESNext)
- Vite
- Tailwind CSS
- Lucide Icons
- Recharts

## 10. Project Architecture
The application is structured as a 2-tier system:
- Backend: Django web API serves business logic and data
- Frontend: React-based dashboard consumes the backend API

### Main API Groups
- /api/auth/
- /api/facilities/
- /api/energy/
- /api/renewables/
- /api/billing/
- /api/alerts/
- /api/recommendations/
- /api/dashboard/
- /api/analytics/

## 11. Key Data Entities
### User
- name
- email
- role
- department
- organization
- phone
- avatar_url

### Facility
- id
- name
- location
- type
- current_consumption
- monthly_consumption
- estimated_cost
- renewable_percentage
- status
- solar_capacity_kwp
- peak_threshold_kw
- peak_usage_window
- grid_share_percent
- floor_area_sq_ft
- monthly_savings_inr

### EnergyReading
- facility
- timestamp
- date
- interval
- time_label
- consumption_kwh
- grid_consumption_kwh
- solar_generation_kwh
- cost

### Bill
- facility
- facility_name
- invoice_no
- billing_period
- due_date
- units_consumed
- solar_generated_kwh
- net_billed_units_kwh
- tariff
- base_energy_charges
- peak_hour_surcharges
- fixed_demand_charges
- solar_credit
- taxes_and_duties
- total_amount
- status

### Alert
- facility
- facility_name
- title
- alert_type
- metric
- message
- severity
- status
- current_value
- threshold_value

### Recommendation
- facility
- facility_name
- title
- description
- reason
- priority
- category
- implementation_effort
- estimated_energy_saving
- estimated_saving_percent
- estimated_cost_saving
- is_applied

## 12. Sample Facility Data Extracted from Project
The platform includes demo facilities such as:

1. Bangalore Tech Park Campus
   - Location: Electronic City, Bengaluru
   - Type: Commercial Tech Campus
   - Current consumption: 420.5 kW
   - Monthly consumption: 48,500 kWh
   - Renewable share: 36%
   - Solar capacity: 160 kWp
   - Status: Normal

2. Pune Manufacturing Facility
   - Location: Chakan Industrial Zone, Pune
   - Type: Heavy Industrial Plant
   - Current consumption: 685.2 kW
   - Monthly consumption: 64,200 kWh
   - Renewable share: 28%
   - Solar capacity: 180 kWp
   - Status: High Usage

3. Gurugram Corporate Tower
   - Location: Cyber Hub Phase II, Gurugram
   - Type: High-Rise Office Tower
   - Current consumption: 310.8 kW
   - Monthly consumption: 29,800 kWh
   - Renewable share: 19%
   - Solar capacity: 60 kWp
   - Status: Critical

4. Chennai Logistics & Cold Hub
   - Location: Sriperumbudur corridor, Chennai
   - Type: Refrigerated Warehouse
   - Current consumption: 195.4 kW
   - Monthly consumption: 18,600 kWh
   - Renewable share: 45%
   - Solar capacity: 120 kWp
   - Status: Normal

5. Hyderabad R&D Innovation Hub
   - Location: HITEC City, Hyderabad
   - Type: Laboratories & Server Pods
   - Current consumption: 254.1 kW
   - Monthly consumption: 24,900 kWh
   - Renewable share: 32%
   - Solar capacity: 90 kWp
   - Status: Normal

## 13. Example Alert and Recommendation Data
### Sample Alert
- Title: Peak Demand Exceeded (Critical Overload)
- Facility: Gurugram Corporate Tower
- Severity: Critical
- Metric: Instantaneous Peak Load
- Current value: 310.8 kW
- Threshold value: 290.0 kW

### Sample Recommendation
- Title: Shift HVAC Setpoint Optimization
- Priority: High
- Category: HVAC Optimization
- Estimated savings: kWh and INR reduction
- Goal: reduce peak load and lower energy costs

## 14. Operational Workflow (User Flow)
1. User logs in to the system.
2. Dashboard loads facility-wide energy indicators.
3. User selects a facility or compares multiple facilities.
4. System displays consumption, solar generation, billing, and alerts.
5. User views recommendations and resolves or acknowledges anomalies.
6. Officer updates facility or billing data when needed.

## 15. Assumptions and Constraints
- The current project uses seeded/demo data rather than direct live utility or sensor integration.
- Data for billing and alerts is modeled for demonstration and prototype use.
- Project is suitable for academic project demonstration and early-stage enterprise product design.

## 16. Final SRS-Ready Summary
GreenGrid is a smart energy management system for monitoring multi-site electricity consumption, optimizing renewable usage, managing billing, and reducing operational inefficiencies. It supports enterprise dashboard analytics, operational alerts, automated recommendations, and facility-level tracking. The project is suitable for academic SRS documentation because it includes complete module-level design, user roles, data model, functional and non-functional requirements, and a practical deployment architecture.

## 17. Relevant Source Files Reviewed
- README.md
- backend/README.md
- backend/facilities/models.py
- backend/energy/models.py
- backend/billing/models.py
- backend/alerts/models.py
- backend/recommendations/models.py
- backend/users/models.py
- backend/greengrid/urls.py
- backend/facilities/management/commands/seed_demo_data.py
- frontend/src/App.jsx
- frontend/src/data/mockData.js
