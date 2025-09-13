from django.core.management.base import BaseCommand
from core.models import Career

class Command(BaseCommand):
    help = 'Populates the database with initial career data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing career data...')
        Career.objects.all().delete()

        careers_data = [
            {
                "title": "Software Engineer", "company": "Tech Corp", "expected_salary": "$75,000 - $120,000",
                "salary_range": "80-120k", "demand": "High", "growth": "+22%", "domain": "technology",
                "experience": "mid", "required_skills": ["JavaScript", "React", "Node.js"],
                "description": "Build and maintain software applications using modern technologies and frameworks."
            },
            {
                "title": "Data Scientist", "company": "Analytics Inc", "expected_salary": "$80,000 - $130,000",
                "salary_range": "80-120k", "demand": "Very High", "growth": "+35%", "domain": "data-analytics",
                "experience": "mid", "required_skills": ["Python", "Machine Learning", "SQL"],
                "description": "Analyze complex data to help organizations make informed decisions and predictions."
            },
            {
                "title": "UX Designer", "company": "Design Studio", "expected_salary": "$65,000 - $95,000",
                "salary_range": "50-80k", "demand": "High", "growth": "+18%", "domain": "design",
                "experience": "mid", "required_skills": ["Figma", "User Research", "Prototyping"],
                "description": "Design user-centered digital experiences that delight and engage users."
            },
            {
                "title": "Product Manager", "company": "Startup Inc", "expected_salary": "$90,000 - $140,000",
                "salary_range": "120k+", "demand": "High", "growth": "+25%", "domain": "management",
                "experience": "senior", "required_skills": ["Strategy", "Analytics", "Leadership"],
                "description": "Drive product vision and strategy while coordinating cross-functional teams."
            },
            {
                "title": "Cloud Architect", "company": "CloudTech", "expected_salary": "$120,000 - $180,000",
                "salary_range": "120k+", "demand": "Very High", "growth": "+30%", "domain": "technology",
                "experience": "senior", "required_skills": ["AWS", "Azure", "Kubernetes", "DevOps"],
                "description": "Design and implement cloud infrastructure and migration strategies."
            }
        ]

        self.stdout.write('Creating new career entries...')
        for data in careers_data:
            Career.objects.create(**data)

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with career data.'))