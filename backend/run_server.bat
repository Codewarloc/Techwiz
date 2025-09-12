@echo off
echo Activating virtual environment...
CALL venv\Scripts\activate

echo Starting Django development server...
python manage.py runserver

echo Server stopped.
pause