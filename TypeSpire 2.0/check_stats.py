import os
import django
from django.db.models import Count

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Student, Program

print(f"Students: {Student.objects.count()}")
print(f"Programs: {Program.objects.count()}")

stats = Student.objects.values(
    'program__name', 
    'program__intake', 
    'current_status'
).annotate(
    count=Count('id')
).order_by('program__name', 'program__intake')

print("Stats:")
for s in stats:
    print(s)
