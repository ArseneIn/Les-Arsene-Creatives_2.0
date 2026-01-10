from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from core.models import TypingSession, Student, Program

class Command(BaseCommand):
    help = 'Setup User Roles and Permissions'

    def handle(self, *args, **options):
        # Create Learning Assistant Group
        group, created = Group.objects.get_or_create(name='Learning Assistant')
        if created:
            self.stdout.write(self.style.SUCCESS('Created "Learning Assistant" group'))
        else:
            self.stdout.write('Group "Learning Assistant" already exists')

        # Define Permissions
        # Can view all Cohorts/Students. Can Create/Edit Typing Sessions manually.
        
        # Models to view
        view_models = [Student, Program, TypingSession]
        for model in view_models:
            ct = ContentType.objects.get_for_model(model)
            permissions = Permission.objects.filter(content_type=ct, codename__startswith='view_')
            group.permissions.add(*permissions)

        # TypingSession: Add and Change
        ts_ct = ContentType.objects.get_for_model(TypingSession)
        ts_perms = Permission.objects.filter(content_type=ts_ct, codename__in=['add_typingsession', 'change_typingsession'])
        group.permissions.add(*ts_perms)

        self.stdout.write(self.style.SUCCESS('Permissions assigned to "Learning Assistant" group'))
