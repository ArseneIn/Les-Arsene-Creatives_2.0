from django.urls import path
from .views import (
    HomeView, BulkEntryView, update_score, ScoreSubmissionAPIView, StudentDashboardView
)
from core.management_views import (
    ManageProgramsView, CreateProgramView, DeleteProgramView,
    ManageStudentsView, CreateStudentView, EditStudentView, DeleteStudentView, UploadStudentsView,
    BulkEntryStudentsView, BulkSubmitStudentsView
)

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('bulk-entry/', BulkEntryView.as_view(), name='bulk_entry'),
    path('api/update-score/<int:student_id>/', update_score, name='update_score'),
    path('api/v1/scores/', ScoreSubmissionAPIView.as_view(), name='api_score_submission'),
    path('dashboard/', StudentDashboardView.as_view(), name='student_dashboard'),
    
    # Management URLs
    path('programs/', ManageProgramsView.as_view(), name='manage_programs'),
    path('programs/create/', CreateProgramView.as_view(), name='create_program'),
    path('programs/<int:pk>/delete/', DeleteProgramView.as_view(), name='delete_program'),
    
    path('students/', ManageStudentsView.as_view(), name='manage_students'),
    path('students/create/', CreateStudentView.as_view(), name='create_student'),
    path('students/upload/', UploadStudentsView.as_view(), name='upload_students'),
    path('students/bulk-entry/', BulkEntryStudentsView.as_view(), name='bulk_entry_students'),
    path('students/bulk-submit/', BulkSubmitStudentsView.as_view(), name='bulk_submit_students'),
    path('students/<int:pk>/edit/', EditStudentView.as_view(), name='edit_student'),
    path('students/<int:pk>/delete/', DeleteStudentView.as_view(), name='delete_student'),
]
