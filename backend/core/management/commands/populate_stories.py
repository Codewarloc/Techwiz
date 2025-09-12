from django.core.management.base import BaseCommand
from core.models import SuccessStory, User
from core.serializers import SuccessStorySerializer

class Command(BaseCommand):
    help = 'Populates the database with initial success stories'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing success stories...')
        SuccessStory.objects.all().delete()

        # Get the first user (usually the admin) to assign as the author.
        # Make sure you have at least one user in your database.
        try:
            author = User.objects.first()
            if not author:
                self.stdout.write(self.style.ERROR('No users found. Please create a superuser first.'))
                return
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('User model not found or empty. Please create a superuser first.'))
            return

        stories_data = [
            {
                "name": "Alice Johnson",
                "domain": "Technology",
                "education": "B.S. in Computer Science",
                "challenge": "Struggled to find a junior developer role after graduation due to lack of practical experience.",
                "outcome": "Used PathSeeker to identify skill gaps, completed a cloud certification, and landed a role as a Cloud Engineer at a top tech firm.",
            },
            {
                "name": "Bob Williams",
                "domain": "Business",
                "education": "MBA in Marketing",
                "challenge": "Felt stuck in a traditional marketing role and wanted to transition into the fast-paced world of digital marketing.",
                "outcome": "Leveraged PathSeeker's resources to learn about SEO and content strategy, eventually becoming a Digital Marketing Manager.",
            },
            {
                "name": "Charlie Brown",
                "domain": "Medicine",
                "education": "Pre-Med Student",
                "challenge": "Was unsure which medical specialty to pursue and felt overwhelmed by the options.",
                "outcome": "The career assessment quiz pointed towards a strong aptitude for analytical roles, inspiring a focus on radiology.",
            },
        ]

        self.stdout.write('Creating new success stories...')
        for story_data in stories_data:
            serializer = SuccessStorySerializer(data={
                **story_data,
                "user": author.id,
                "is_approved": True  # Pre-approve for immediate visibility
            })
            if serializer.is_valid():
                serializer.save()
            else:
                self.stdout.write(self.style.ERROR(f'Error saving story: {serializer.errors}'))

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with success stories.'))