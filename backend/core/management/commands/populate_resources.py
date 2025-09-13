from django.core.management.base import BaseCommand
from core.models import Resource

class Command(BaseCommand):
    help = 'Populates the database with initial resource data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing resource data...')
        Resource.objects.all().delete()

        resources_data = [
            {
                "title": "Resume Building Guide",
                "description": "A comprehensive guide to creating a professional resume that stands out.",
                "category": "PDF",
                "file_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                "tags": ["Beginner", "Skill-Building"],
                "target_audience": "Student",
            },
            {
                "title": "Interview Preparation Checklist",
                "description": "A step-by-step checklist to ensure you are fully prepared for your next job interview.",
                "category": "Checklist",
                "file_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                "tags": ["Interview", "All"],
                "target_audience": "All",
            },
            {
                "title": "Tech Career Paths",
                "description": "An infographic visualizing various career paths in the technology sector.",
                "category": "Infographic",
                "file_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                "tags": ["Career Planning", "Technology"],
                "target_audience": "Graduate",
            },
            {
                "title": "Scholarship Application Tips",
                "description": "Tips and tricks for writing a winning scholarship application.",
                "category": "PDF",
                "file_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                "tags": ["Scholarship", "Finance"],
                "target_audience": "Student",
            },
        ]

        self.stdout.write('Creating new resource entries...')
        for data in resources_data:
            Resource.objects.create(**data)

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with resource data.'))