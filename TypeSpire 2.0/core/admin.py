from django.contrib import admin
from .models import Program, Student, ExternalTool, TypingSession, WeeklyProgress

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'program_type', 'intake', 'student_count')
    list_filter = ('program_type', 'intake')
    search_fields = ('name',)
    date_hierarchy = 'intake'
    
    def student_count(self, obj):
        return obj.student_set.count()
    student_count.short_description = 'Students'

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'get_full_name', 'program', 'current_status', 'best_wpm')
    list_filter = ('current_status', 'program')
    search_fields = ('student_id', 'user__username', 'user__first_name', 'user__last_name')
    raw_id_fields = ('user',)
    
    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
    get_full_name.short_description = 'Name'
    
    def best_wpm(self, obj):
        best = obj.weekly_progress.order_by('-best_wpm').first()
        return best.best_wpm if best else 0
    best_wpm.short_description = 'Best WPM'

@admin.register(ExternalTool)
class ExternalToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'api_key_preview', 'session_count')
    search_fields = ('name',)
    
    def api_key_preview(self, obj):
        return f"{obj.api_key[:8]}..." if len(obj.api_key) > 8 else obj.api_key
    api_key_preview.short_description = 'API Key'
    
    def session_count(self, obj):
        return obj.typingsession_set.count()
    session_count.short_description = 'Sessions'

@admin.register(TypingSession)
class TypingSessionAdmin(admin.ModelAdmin):
    list_display = ('student', 'wpm', 'accuracy', 'date_recorded', 'submission_method', 'recorded_by')
    list_filter = ('submission_method', 'date_recorded', 'student__program')
    search_fields = ('student__student_id', 'student__user__username')
    date_hierarchy = 'date_recorded'
    raw_id_fields = ('student', 'recorded_by', 'tool_source')
    readonly_fields = ('timestamp',)
    
    fieldsets = (
        ('Session Details', {
            'fields': ('student', 'wpm', 'accuracy', 'date_recorded')
        }),
        ('Source Information', {
            'fields': ('submission_method', 'recorded_by', 'tool_source', 'timestamp')
        }),
    )

@admin.register(WeeklyProgress)
class WeeklyProgressAdmin(admin.ModelAdmin):
    list_display = ('student', 'week_number', 'best_wpm', 'year')
    list_filter = ('week_number', 'student__program')
    search_fields = ('student__student_id', 'student__user__username')
    raw_id_fields = ('student',)
    
    def year(self, obj):
        # Get the year from the most recent session for this student/week
        from django.utils import timezone
        return timezone.now().year
    year.short_description = 'Year'
