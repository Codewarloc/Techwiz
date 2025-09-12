from django.core.management.base import BaseCommand
from core.models import QuizQuestion

class Command(BaseCommand):
    help = 'Populates the database with initial quiz questions'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing quiz questions...')
        QuizQuestion.objects.all().delete()

        questions_data = [
            {
                "text": "What type of work environment do you prefer?",
                "options": [
                    {"text": "Collaborative team environment", "category": "Leadership"},
                    {"text": "Independent work with minimal supervision", "category": "Analytical"},
                    {"text": "Dynamic, fast-paced environment", "category": "Creative"},
                    {"text": "Structured, organized workplace", "category": "Tech"},
                ],
            },
            {
                "text": "Which activity sounds most appealing to you?",
                "options": [
                    {"text": "Solving complex technical problems", "category": "Tech"},
                    {"text": "Creating visual designs and experiences", "category": "Creative"},
                    {"text": "Analyzing data to find insights", "category": "Analytical"},
                    {"text": "Leading and managing teams", "category": "Leadership"},
                ],
            },
            {
                "text": "What motivates you most in your career?",
                "options": [
                    {"text": "Making a positive impact on society", "category": "Leadership"},
                    {"text": "Financial success and stability", "category": "Analytical"},
                    {"text": "Creative expression and innovation", "category": "Creative"},
                    {"text": "Recognition and professional growth", "category": "Tech"},
                ],
            },
            {
                "text": "How do you prefer to learn new skills?",
                "options": [
                    {"text": "Hands-on experience and practice", "category": "Tech"},
                    {"text": "Reading and theoretical study", "category": "Analytical"},
                    {"text": "Mentorship and guidance from experts", "category": "Leadership"},
                    {"text": "Trial and error experimentation", "category": "Creative"},
                ],
            },
        ]

        self.stdout.write('Creating new quiz questions...')
        for i, q_data in enumerate(questions_data):
            QuizQuestion.objects.create(
                text=q_data['text'],
                options=q_data['options'],
                order=i
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with quiz questions.'))