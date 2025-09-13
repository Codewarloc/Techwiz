from django.core.management.base import BaseCommand
from core.models import Multimedia

class Command(BaseCommand):
    help = 'Populates the database with initial multimedia content'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing multimedia content...')
        Multimedia.objects.all().delete()

        content_data = [
            {
                "type": "Video",
                "title": "Career Growth Strategies",
                "url": "https://www.youtube.com/embed/a6g8y3EDHkw",
                "transcript": "In this video, we explore key strategies for career growth, including skill development, networking, and seeking mentorship. Learn how to take control of your professional journey.",
                "tags": ["Career", "Beginner"],
            },
            {
                "type": "Podcast",
                "title": "Tech Trends 2025",
                "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                "transcript": "Welcome to the podcast! Today we discuss upcoming tech trends for 2025, focusing on AI, blockchain, and the future of remote work. Stay ahead of the curve with these insights.",
                "tags": ["Technology", "Intermediate"],
            },
            {
                "type": "Explainer",
                "title": "How AI is Changing Jobs",
                "url": "https://www.youtube.com/embed/2vjPBrBU-TM",
                "transcript": "AI is reshaping industries by automating tasks and creating new roles. This explainer video breaks down the impact of artificial intelligence on the job market and what it means for you.",
                "tags": ["AI", "Advanced"],
            },
        ]

        self.stdout.write('Creating new multimedia entries...')
        for data in content_data:
            Multimedia.objects.create(**data)

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with multimedia content.'))