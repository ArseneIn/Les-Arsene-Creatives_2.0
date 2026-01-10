from django.db import models
from django.contrib.auth.models import User

class Program(models.Model):
    PROGRAM_TYPES = [
        ('DAY', 'Day'),
        ('EVENING', 'Evening'),
    ]
    name = models.CharField(max_length=100)
    program_type = models.CharField(max_length=20, choices=PROGRAM_TYPES)
    intake = models.DateField()

    def __str__(self):
        return f"{self.name} ({self.get_program_type_display()} - {self.intake})"

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    student_id = models.CharField(max_length=20, unique=True)
    program = models.ForeignKey(Program, on_delete=models.PROTECT)
    current_status = models.CharField(max_length=50, default='Beginner') # Could be an Enum or FK to a Status model

    def __str__(self):
        return f"{self.student_id} - {self.user.get_full_name() or self.user.username}"

class ExternalTool(models.Model):
    name = models.CharField(max_length=100)
    api_key = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class TypingSession(models.Model):
    SUBMISSION_METHODS = [
        ('API', 'API'),
        ('MANUAL', 'Manual'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='typing_sessions')
    wpm = models.IntegerField()
    accuracy = models.FloatField()
    date_recorded = models.DateField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Source Tracking
    submission_method = models.CharField(max_length=10, choices=SUBMISSION_METHODS, default='MANUAL')
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, help_text="The Learning Assistant who entered this")
    tool_source = models.ForeignKey(ExternalTool, on_delete=models.SET_NULL, null=True, blank=True, help_text="If API, which tool?")

    def __str__(self):
        return f"{self.student} - {self.wpm} WPM on {self.date_recorded}"

class WeeklyProgress(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='weekly_progress')
    week_number = models.IntegerField()
    best_wpm = models.IntegerField(default=0)

    class Meta:
        unique_together = ('student', 'week_number')

    def __str__(self):
        return f"{self.student} - Week {self.week_number}: {self.best_wpm} WPM"
