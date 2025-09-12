# core/management/commands/populate_quiz_questions.py
from django.core.management.base import BaseCommand
from core.models import QuizQuestion, Option

class Command(BaseCommand):
    help = 'Populates the database with initial quiz questions'

    def handle(self, *args, **kwargs):
        Option.objects.all().delete()
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

            

            { 
                "text": "You’re given a group project. What role do you naturally take?",
                "options": [
                    {"text": "Leading the team", "category": "Leadership"},
                    {"text": "Solving the technical challenges", "category": "Tech"},
                    {"text": "Designing visuals or presentation", "category": "Creative"},
                    {"text": "Analyzing data and research", "category": "Analytical"},
                ],
            },
            
        ]

        for i, q_data in enumerate(questions_data):
            question = QuizQuestion.objects.create(
                text=q_data['text'],
                order=i
            )
            for opt in q_data['options']:
                Option.objects.create(
                    question=question,
                    text=opt['text'],
                    category=opt['category']
                )

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with quiz questions.'))
