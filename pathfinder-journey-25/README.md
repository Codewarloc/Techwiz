# Welcome to Path finder

## Project info

i used this to create my project


- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- django



PathSeeker – Career Passport 🎓🌍

Discover What Fits You Best…
A full-stack career guidance platform that helps students, graduates, and professionals explore tailored career paths, take interest-based quizzes, bookmark resources, and access multimedia learning materials.

© Aptech Limited — Version 1.0

📌 Table of Contents

Background

Proposed Solution

Scope

Features

Functional Requirements

Non-Functional Requirements

Tech Stack

System Requirements

Database Design

Installation & Setup

Usage

Deliverables

License

1. Background

In today’s competitive world, students and professionals struggle to select career paths that truly match their skills and interests. Existing resources are often generic and fragmented.

PathSeeker bridges this gap by offering:

Tailored career suggestions

Interactive interest quizzes

Multimedia-driven learning resources

Personalized dashboards and career passports

2. Proposed Solution

A full-stack web application that personalizes career exploration using Django backend with REST APIs and a modern frontend (React/Next.js or similar).

It allows role-based access (student, graduate, professional, admin) and provides tools like bookmarking, career banks, multimedia centers, and success story sharing.

3. Scope

User authentication and role-based dashboards

Career bank with smart filters

Quiz-driven recommendations

Admin panel for content management

Feedback and analytics system

Exportable reports (PDF bookmarks, notes, etc.)

4. Features
✅ Functional Requirements

Authentication: Role-based login (Student, Graduate, Professional, Admin)

Personalized Dashboard: Recommendations, bookmarks, quiz results

Career Bank: Advanced filters, smart search, saved preferences

Quizzes: Interest-based, stored history, recommendations

Multimedia Center: Videos, podcasts, admin-controlled tagging

Success Stories: User-submitted stories with admin approval

Resource Library: Downloadable guides, checklists, infographics

Feedback & Analytics: Dynamic forms, sentiment stats

Bookmarking & Notes: Save items, add sticky notes, export/share

Admin Control Panel: Full content management & user analytics

🔒 Non-Functional Requirements

Secure & scalable backend

Responsive UI for all devices

High performance with minimal load times

Accessible design (dark mode, font adjustments)

24/7 availability with minimal downtime

Browser/device compatibility

5. Tech Stack

Backend: Django (Python 3.13), Django REST Framework

Frontend: React.js (or compatible SPA framework)

Database: MySQL / PostgreSQL (production), SQLite (development)

Additional Tools:

ReportLab (for PDF export)

ElasticSearch (optional, for smart search)

6. System Requirements
Hardware

Intel Core i5/i7 (or higher)

8GB RAM (minimum)

500GB storage

SVGA monitor

Software

Python 3.13+

pip / virtualenv

Node.js (for frontend)

Database: MySQL / PostgreSQL

Git (for version control)

7. Database Design (Sample Entities)

User: id, name, email, role, password, profile fields

Career: id, title, domain, salary_range, description

QuizQuestion: id, text, type, options

QuizResult: id, user_id, score, recommendations

Bookmark: id, user_id, resource_id, note

Resource: id, type (PDF/Video), title, file_url

Feedback: id, user_id, type, message

(ERD & schema diagrams should be attached in documentation)

8. Installation & Setup
🔧 Backend (Django)
# Clone repo
git clone <your-repo-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Run server
python manage.py runserver

🔧 Frontend (React/Next.js)
cd frontend
npm install
npm run dev

9. Usage

Register/Login as a user

Explore careers, multimedia, and quizzes

Bookmark resources and export to PDF

Admin can add/edit/delete careers, quizzes, and multimedia

View personalized dashboard with recommendations

10. Deliverables

Source code (backend + frontend)

Database schema (.sql file)

README documentation

Project report (SRS, diagrams, assumptions)

Demo video of the system (mandatory for submission)

Hosted version (if available)

11. License

© Aptech Limited. All rights reserved.
For academic and training purposes only.

