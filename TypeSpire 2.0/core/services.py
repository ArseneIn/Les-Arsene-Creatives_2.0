from .models import WeeklyProgress

def update_student_progress(student, wpm, date_recorded):
    """
    Updates the student's weekly progress and checks for status promotion.
    """
    week_number = date_recorded.isocalendar()[1]
    
    weekly_prog, created = WeeklyProgress.objects.get_or_create(
        student=student,
        week_number=week_number
    )
    
    if wpm > weekly_prog.best_wpm:
        weekly_prog.best_wpm = wpm
        weekly_prog.save()
        
        # Automated Status Promotion Logic
        # Logic: IF best_wpm > 45 (Level 1) or > 50 (Level 2)
        # We should check highest level first
        if weekly_prog.best_wpm > 50:
            if student.current_status != 'Level 2': # Only update if changed
                student.current_status = 'Level 2'
                student.save()
        elif weekly_prog.best_wpm > 45:
            if student.current_status != 'Level 2' and student.current_status != 'Level 1':
                student.current_status = 'Level 1'
                student.save()
