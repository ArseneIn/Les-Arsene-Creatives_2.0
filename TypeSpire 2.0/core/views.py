from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.contrib import messages
import json
import datetime
import plotly.graph_objects as go
from plotly.utils import PlotlyJSONEncoder
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.db.models import Max
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Program, Student, TypingSession, WeeklyProgress, ExternalTool
from .services import update_student_progress
from .serializers import TypingSessionSerializer
from .management_views import (
    ManageProgramsView, CreateProgramView, DeleteProgramView,
    ManageStudentsView, CreateStudentView, DeleteStudentView, EditStudentView, UploadStudentsView
)


class HomeView(View):
    def get(self, request):
        # If staff/admin, show admin dashboard
        if request.user.is_authenticated and request.user.is_staff:
            from django.db.models import Count, Avg
            from datetime import datetime, timedelta
            
            # KPIs
            total_students = Student.objects.count()
            total_programs = Program.objects.count()
            today = timezone.now().date()
            sessions_today = TypingSession.objects.filter(date_recorded=today).count()
            avg_wpm = TypingSession.objects.aggregate(Avg('wpm'))['wpm__avg'] or 0
            
            # Weekly Activity (last 7 days)
            weekly_activity = []
            for i in range(6, -1, -1):
                date = today - timedelta(days=i)
                count = TypingSession.objects.filter(date_recorded=date).count()
                weekly_activity.append({
                    'date': date.strftime('%a'),
                    'count': count
                })
            
            # Status Distribution
            status_distribution = Student.objects.values('current_status').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Recent Sessions
            recent_sessions = TypingSession.objects.select_related('student__user').order_by('-timestamp')[:5]
            
            # Top Performers (this week)
            week_start = today - timedelta(days=today.weekday())
            current_week = week_start.isocalendar()[1]
            
            top_performers = Student.objects.select_related('user').filter(
                weekly_progress__week_number=current_week
            ).annotate(
                best_wpm=Max('weekly_progress__best_wpm')
            ).order_by('-best_wpm')[:5]
            
            # Program & Intake Analysis
            program_stats = Student.objects.values(
                'program__name', 
                'program__intake', 
                'current_status'
            ).annotate(
                count=Count('id')
            ).order_by('program__name', 'program__intake')
            
            data_structure = {}
            all_statuses = set()
            
            for entry in program_stats:
                p_name = entry['program__name']
                p_intake = entry['program__intake']
                label = f"{p_name} - {p_intake.strftime('%b %Y')}" if p_intake else p_name
                
                status_val = entry['current_status']
                count = entry['count']
                
                if label not in data_structure:
                    data_structure[label] = {}
                
                data_structure[label][status_val] = count
                all_statuses.add(status_val)
            
            target_statuses = ['Level 1', 'Level 2', 'Passed']
            for s in all_statuses:
                if s not in target_statuses:
                    target_statuses.append(s)
            
            chart_labels = list(data_structure.keys())
            
            # 1. Program Performance Chart (Stacked Bar)
            fig_program = go.Figure()
            
            status_colors = {
                'Level 1': 'rgba(250, 204, 21, 0.7)', # Yellow
                'Level 2': 'rgba(96, 165, 250, 0.7)', # Blue
                'Passed': 'rgba(74, 222, 128, 0.7)',  # Green
                'Beginner': 'rgba(148, 163, 184, 0.7)', # Slate
            }
            
            for status_val in target_statuses:
                data = [data_structure[label].get(status_val, 0) for label in chart_labels]
                if any(data):
                    fig_program.add_trace(go.Bar(
                        name=status_val,
                        x=chart_labels,
                        y=data,
                        marker_color=status_colors.get(status_val, 'rgba(203, 213, 225, 0.7)')
                    ))

            fig_program.update_layout(
                barmode='stack',
                margin=dict(l=30, r=20, t=30, b=30),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='#94a3b8'),
                legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
                xaxis=dict(showgrid=False, gridcolor='#334155'),
                yaxis=dict(showgrid=True, gridcolor='#334155')
            )
            
            program_chart_json = json.dumps(fig_program, cls=PlotlyJSONEncoder)

            # 2. Weekly Activity Chart (Bar)
            fig_weekly = go.Figure(data=[go.Bar(
                x=[d['date'] for d in weekly_activity],
                y=[d['count'] for d in weekly_activity],
                marker_color='rgba(6, 182, 212, 0.5)',
                marker_line_color='#06b6d4',
                marker_line_width=1.5
            )])
            fig_weekly.update_layout(
                margin=dict(l=30, r=20, t=30, b=30),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='#94a3b8'),
                xaxis=dict(showgrid=False),
                yaxis=dict(showgrid=True, gridcolor='#334155')
            )
            weekly_chart_json = json.dumps(fig_weekly, cls=PlotlyJSONEncoder)

            # 3. Status Distribution Chart (Donut)
            fig_status = go.Figure(data=[go.Pie(
                labels=[s['current_status'] for s in status_distribution],
                values=[s['count'] for s in status_distribution],
                hole=.6,
                marker=dict(colors=['rgba(6, 182, 212, 0.8)', 'rgba(124, 58, 237, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(251, 191, 36, 0.8)'])
            )])
            fig_status.update_layout(
                margin=dict(l=20, r=20, t=20, b=20),
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(color='#94a3b8'),
                showlegend=True,
                legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5)
            )
            status_chart_json = json.dumps(fig_status, cls=PlotlyJSONEncoder)

            context = {
                'total_students': total_students,
                'total_programs': total_programs,
                'sessions_today': sessions_today,
                'avg_wpm': avg_wpm,
                'weekly_activity': weekly_activity,
                'status_distribution': status_distribution,
                'recent_sessions': recent_sessions,
                'top_performers': top_performers,
                'program_chart_json': program_chart_json,
                'weekly_chart_json': weekly_chart_json,
                'status_chart_json': status_chart_json,
            }
            return render(request, 'core/admin_dashboard.html', context)
        
        # If student, redirect to their dashboard
        elif request.user.is_authenticated:
            try:
                request.user.student
                return redirect('student_dashboard')
            except Student.DoesNotExist:
                pass
        
        # Guest view - simple landing page
        return render(request, 'core/home.html', {'has_student_profile': False})


class BulkEntryView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.add_typingsession'
    template_name = 'core/bulk_entry.html'

    def get(self, request):
        programs = Program.objects.all()
        selected_program_id = request.GET.get('program')
        week_number = request.GET.get('week', timezone.now().isocalendar()[1])
        
        students = []
        if selected_program_id:
            students = Student.objects.filter(program_id=selected_program_id).select_related('program')
            
            for student in students:
                session = TypingSession.objects.filter(
                    student=student, 
                    date_recorded__week=week_number, 
                    date_recorded__year=timezone.now().year
                ).order_by('-wpm').first()
                student.current_session = session

        context = {
            'programs': programs,
            'selected_program_id': int(selected_program_id) if selected_program_id else None,
            'week_number': int(week_number),
            'students': students,
        }
        return render(request, self.template_name, context)

    def post(self, request):
        try:
            scores_data = json.loads(request.POST.get('scores_data', '[]'))
            week_number = request.POST.get('week')
            program_id = request.POST.get('program')
            
            count = 0
            current_year = timezone.now().year
            
            # Calculate date for the week
            try:
                week_num = int(week_number)
                # Monday of the given week
                # %W is week number 00-53, Monday as first day of week. %w is weekday (1=Monday)
                date_obj = datetime.datetime.strptime(f'{current_year}-W{week_num}-1', "%Y-W%W-%w").date()
            except (ValueError, TypeError):
                date_obj = timezone.now().date()

            for score in scores_data:
                student_id = score.get('student_id')
                wpm = score.get('wpm')
                accuracy = score.get('accuracy')
                
                if student_id and wpm is not None and accuracy is not None:
                    student = Student.objects.get(id=student_id)
                    
                    # Try to find existing session for this week to update
                    session = TypingSession.objects.filter(
                        student=student,
                        date_recorded__week=week_number,
                        date_recorded__year=current_year
                    ).first()
                    
                    if session:
                        session.wpm = int(wpm)
                        session.accuracy = float(accuracy)
                        session.save()
                    else:
                        TypingSession.objects.create(
                            student=student,
                            wpm=int(wpm),
                            accuracy=float(accuracy),
                            date_recorded=date_obj,
                            submission_method='MANUAL',
                            recorded_by=request.user
                        )
                        
                    # Update student progress
                    update_student_progress(student, int(wpm), date_obj)
                    count += 1
            
            messages.success(request, f"Successfully recorded scores for {count} students.")
            
        except Exception as e:
            messages.error(request, f"Error recording scores: {str(e)}")
            
        return redirect(f"{request.path}?program={program_id}&week={week_number}")

@require_POST
def update_score(request, student_id):
    # HTMX endpoint
    student = get_object_or_404(Student, pk=student_id)
    wpm = request.POST.get('wpm')
    accuracy = request.POST.get('accuracy')
    
    if not wpm or not accuracy:
        return HttpResponse("Invalid Input", status=400)

    # Create Session
    session = TypingSession.objects.create(
        student=student,
        wpm=int(wpm),
        accuracy=float(accuracy),
        date_recorded=timezone.now().date(),
        submission_method='MANUAL',
        recorded_by=request.user if request.user.is_authenticated else None
    )
    
    # Update Progress via Service
    update_student_progress(student, int(wpm), session.date_recorded)

    return HttpResponse(f"""
        <div class="text-green-400 animate-pulse">Saved</div>
    """)

class ScoreSubmissionAPIView(APIView):
    """
    API Endpoint for external tools to submit scores.
    Requires 'X-API-KEY' header.
    """
    def post(self, request):
        api_key = request.headers.get('X-API-KEY')
        if not api_key:
            return Response({"error": "Missing API Key"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            tool = ExternalTool.objects.get(api_key=api_key)
        except ExternalTool.DoesNotExist:
            return Response({"error": "Invalid API Key"}, status=status.HTTP_403_FORBIDDEN)

        serializer = TypingSessionSerializer(data=request.data)
        if serializer.is_valid():
            session = serializer.save(
                submission_method='API',
                tool_source=tool
            )
            # Update Progress via Service
            update_student_progress(session.student, session.wpm, session.date_recorded)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentDashboardView(LoginRequiredMixin, View):
    template_name = 'core/student_dashboard.html'

    def get(self, request):
        try:
            student = request.user.student
        except Student.DoesNotExist:
            return HttpResponse("You are not registered as a student.", status=403)

        # Stats
        weekly_progress = WeeklyProgress.objects.filter(student=student).order_by('week_number')
        recent_sessions = TypingSession.objects.filter(student=student).order_by('-timestamp')[:10]
        
        best_wpm_all_time = weekly_progress.aggregate(Max('best_wpm'))['best_wpm__max'] or 0

        context = {
            'student': student,
            'weekly_progress': weekly_progress,
            'recent_sessions': recent_sessions,
            'best_wpm': best_wpm_all_time,
        }
        return render(request, self.template_name, context)
# Force reload

