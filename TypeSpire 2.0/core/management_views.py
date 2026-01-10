# Management Views
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.views import View
from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Q
from django.core.paginator import Paginator
from .models import Program, Student
import csv
import io

class ManageProgramsView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.add_program'
    template_name = 'core/manage_programs.html'

    def get(self, request):
        programs = Program.objects.all().prefetch_related('student_set')
        return render(request, self.template_name, {'programs': programs})

class CreateProgramView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.add_program'

    def post(self, request):
        Program.objects.create(
            name=request.POST['name'],
            program_type=request.POST['program_type'],
            intake=request.POST['intake']
        )
        return redirect('manage_programs')

class DeleteProgramView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.delete_program'

    def post(self, request, pk):
        program = get_object_or_404(Program, pk=pk)
        program.delete()
        return redirect('manage_programs')

class ManageStudentsView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.add_student'
    template_name = 'core/manage_students.html'

    def get(self, request):
        students = Student.objects.select_related('user', 'program').all().order_by('-id')
        
        # Filters
        program_filter = request.GET.get('program')
        status_filter = request.GET.get('status')
        search_query = request.GET.get('search')
        
        if program_filter:
            students = students.filter(program_id=program_filter)
        if status_filter:
            students = students.filter(current_status=status_filter)
        if search_query:
            students = students.filter(
                Q(user__username__icontains=search_query) |
                Q(user__first_name__icontains=search_query) |
                Q(user__last_name__icontains=search_query) |
                Q(student_id__icontains=search_query)
            )
        
        # Pagination
        paginator = Paginator(students, 10) # 10 students per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        # Add best WPM to each student in the current page
        for student in page_obj:
            best = student.weekly_progress.order_by('-best_wpm').first()
            student.best_wpm = best.best_wpm if best else 0
        
        programs = Program.objects.all()
        return render(request, self.template_name, {
            'students': page_obj, # Pass page_obj instead of all students
            'programs': programs,
            'search_query': search_query,
            'program_filter': int(program_filter) if program_filter else None,
            'status_filter': status_filter
        })

class CreateStudentView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.add_student'

    def post(self, request):
        # Create user
        full_name = request.POST['full_name'].split(' ', 1)
        first_name = full_name[0]
        last_name = full_name[1] if len(full_name) > 1 else ''
        
        user = User.objects.create_user(
            username=request.POST['username'],
            password=request.POST['password'],
            first_name=first_name,
            last_name=last_name
        )
        
        # Create student
        Student.objects.create(
            user=user,
            student_id=request.POST['student_id'],
            program_id=request.POST['program']
        )
        
        return redirect('manage_students')

class DeleteStudentView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.delete_student'

    def post(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        user = student.user
        student.delete()
        user.delete()
        return redirect('manage_students')

class EditStudentView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.change_student'
    template_name = 'core/edit_student.html'

    def get(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        programs = Program.objects.all()
        return render(request, self.template_name, {
            'student': student,
            'programs': programs
        })

    def post(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        user = student.user
        
        # Update User
        full_name = request.POST['full_name'].split(' ', 1)
        user.first_name = full_name[0]
        user.last_name = full_name[1] if len(full_name) > 1 else ''
        user.username = request.POST['username']
        
        if request.POST.get('password'):
            user.set_password(request.POST['password'])
        
        user.save()
        
        # Update Student
        student.student_id = request.POST['student_id']
        student.program_id = request.POST['program']
        student.current_status = request.POST['status']
        student.save()
        
        return redirect('manage_students')

class UploadStudentsView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.add_student'

    def post(self, request):
        if 'csv_file' not in request.FILES:
            messages.error(request, 'No CSV file uploaded.')
            return redirect('manage_students')

        try:
            # Handle program selection or creation
            program_option = request.POST.get('program_option')
            
            if program_option == 'new':
                # Create new program
                program_name = request.POST.get('new_program_name')
                program_intake = request.POST.get('new_program_intake')
                
                if not program_name or not program_intake:
                    messages.error(request, 'Program name and intake are required for new program.')
                    return redirect('manage_students')
                    
                program = Program.objects.create(
                    name=program_name,
                    intake=program_intake
                )
                messages.success(request, f'Created new program: {program_name}')
            else:
                # Use existing program
                program_id = request.POST.get('existing_program')
                if not program_id:
                    messages.error(request, 'Please select a program.')
                    return redirect('manage_students')
                    
                program = Program.objects.filter(id=program_id).first()
                if not program:
                    messages.error(request, 'Selected program not found.')
                    return redirect('manage_students')

            # Process CSV file
            csv_file = request.FILES['csv_file']
            decoded_file = csv_file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
            
            created_count = 0
            skip_reasons = {
                'no_username': 0,
                'duplicate_username': 0,
                'no_student_id': 0,
                'no_full_name': 0
            }
            
            for row in reader:
                # Expected columns: student_id, username, full_name, password (optional)
                username = row.get('username', '').strip()
                student_id = row.get('student_id', '').strip()
                full_name = row.get('full_name', '').strip()
                
                if not username:
                    skip_reasons['no_username'] += 1
                    continue
                
                if not student_id:
                    skip_reasons['no_student_id'] += 1
                    continue
                    
                if not full_name:
                    skip_reasons['no_full_name'] += 1
                    continue
                    
                if User.objects.filter(username=username).exists():
                    skip_reasons['duplicate_username'] += 1
                    continue
                    
                name_parts = full_name.split(' ', 1)
                first_name = name_parts[0] if name_parts else ''
                last_name = name_parts[1] if len(name_parts) > 1 else ''
                password = row.get('password', 'default123')
                
                user = User.objects.create_user(
                    username=username,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                
                Student.objects.create(
                    user=user,
                    student_id=student_id,
                    program=program,
                    current_status='Beginner'
                )
                created_count += 1
            
            # Build detailed message
            total_skipped = sum(skip_reasons.values())
            if created_count > 0:
                messages.success(request, f'Successfully uploaded {created_count} students.')
            
            if total_skipped > 0:
                skip_details = []
                if skip_reasons['no_username'] > 0:
                    skip_details.append(f"{skip_reasons['no_username']} missing username")
                if skip_reasons['duplicate_username'] > 0:
                    skip_details.append(f"{skip_reasons['duplicate_username']} duplicate usernames")
                if skip_reasons['no_student_id'] > 0:
                    skip_details.append(f"{skip_reasons['no_student_id']} missing student_id")
                if skip_reasons['no_full_name'] > 0:
                    skip_details.append(f"{skip_reasons['no_full_name']} missing full_name")
                
                messages.warning(request, f"Skipped {total_skipped} rows: {', '.join(skip_details)}")
            
            if created_count == 0 and total_skipped == 0:
                messages.error(request, 'CSV file appears to be empty or has no valid data rows.')
                
        except Exception as e:
            messages.error(request, f'Error uploading CSV: {str(e)}')
            
        return redirect('manage_students')

class BulkEntryStudentsView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.add_student'
    template_name = 'core/bulk_entry_students.html'

    def get(self, request):
        programs = Program.objects.all()
        return render(request, self.template_name, {
            'programs': programs
        })

class BulkSubmitStudentsView(LoginRequiredMixin, PermissionRequiredMixin, View):
    permission_required = 'core.add_student'

    def post(self, request):
        try:
            import json
            students_data = json.loads(request.POST.get('students_data', '[]'))
            new_program = request.POST.get('new_program') == 'true'
            
            # Handle program
            if new_program:
                program_name = request.POST.get('program_name')
                intake = request.POST.get('intake')
                
                if not program_name or not intake:
                    messages.error(request, 'Program name and intake are required.')
                    return redirect('bulk_entry_students')
                
                program = Program.objects.create(
                    name=program_name,
                    intake=intake
                )
                messages.success(request, f'Created new program: {program_name}')
            else:
                program_id = request.POST.get('program_id')
                if not program_id:
                    messages.error(request, 'Please select a program.')
                    return redirect('bulk_entry_students')
                
                program = Program.objects.filter(id=program_id).first()
                if not program:
                    messages.error(request, 'Selected program not found.')
                    return redirect('bulk_entry_students')
            
            # Process students
            created_count = 0
            skip_reasons = {
                'no_username': 0,
                'duplicate_username': 0,
                'no_student_id': 0,
                'no_full_name': 0
            }
            
            for student_data in students_data:
                username = student_data.get('username', '').strip()
                student_id = student_data.get('student_id', '').strip()
                full_name = student_data.get('full_name', '').strip()
                password = student_data.get('password', 'default123').strip() or 'default123'
                
                if not username:
                    skip_reasons['no_username'] += 1
                    continue
                
                if not student_id:
                    skip_reasons['no_student_id'] += 1
                    continue
                    
                if not full_name:
                    skip_reasons['no_full_name'] += 1
                    continue
                    
                if User.objects.filter(username=username).exists():
                    skip_reasons['duplicate_username'] += 1
                    continue
                
                name_parts = full_name.split(' ', 1)
                first_name = name_parts[0] if name_parts else ''
                last_name = name_parts[1] if len(name_parts) > 1 else ''
                
                user = User.objects.create_user(
                    username=username,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                
                Student.objects.create(
                    user=user,
                    student_id=student_id,
                    program=program,
                    current_status='Beginner'
                )
                created_count += 1
            
            # Build messages
            total_skipped = sum(skip_reasons.values())
            if created_count > 0:
                messages.success(request, f'Successfully created {created_count} students.')
            
            if total_skipped > 0:
                skip_details = []
                if skip_reasons['no_username'] > 0:
                    skip_details.append(f"{skip_reasons['no_username']} missing username")
                if skip_reasons['duplicate_username'] > 0:
                    skip_details.append(f"{skip_reasons['duplicate_username']} duplicate usernames")
                if skip_reasons['no_student_id'] > 0:
                    skip_details.append(f"{skip_reasons['no_student_id']} missing student_id")
                if skip_reasons['no_full_name'] > 0:
                    skip_details.append(f"{skip_reasons['no_full_name']} missing full_name")
                
                messages.warning(request, f"Skipped {total_skipped} rows: {', '.join(skip_details)}")
            
            return redirect('manage_students')
            
        except Exception as e:
            messages.error(request, f'Error submitting students: {str(e)}')
            return redirect('bulk_entry_students')

