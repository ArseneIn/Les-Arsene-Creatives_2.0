"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal";
import { useForm } from "react-hook-form";

interface Subject {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Classroom {
  id: string;
  name: string;
}

interface AcademicYear {
  id: string;
  name: string;
  isActive: boolean;
}

interface Course {
  id: string;
  subject: Subject;
  teacher: Teacher;
  classroom: Classroom;
  academicYear: AcademicYear;
  credits: number;
}

interface CreateCourseFormData {
  subjectId: string;
  teacherId: string;
  classId: string;
  academicYearId: string;
  credits: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const params = useParams();
  const schoolId = params.id as string;

  const { register, handleSubmit, reset } = useForm<CreateCourseFormData>();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [coursesRes, subjectsRes, teachersRes, classesRes, yearsRes] = await Promise.all([
        api.get('/courses', { params: { schoolId } }),
        api.get('/subjects', { params: { schoolId } }),
        api.get('/teachers', { params: { schoolId } }),
        api.get('/classes', { params: { schoolId } }),
        api.get('/academic-years', { params: { schoolId } })
      ]);
      setCourses(coursesRes.data);
      setSubjects(subjectsRes.data);
      setTeachers(teachersRes.data);
      setClassrooms(classesRes.data);
      setAcademicYears(yearsRes.data);
    } catch (error) {
      console.error("Failed to fetch courses data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) fetchData();
  }, [schoolId, fetchData]);

  const handleOpenModal = (course: Course | null = null) => {
    setEditingCourse(course);
    if (course) {
      reset({
        subjectId: course.subject.id,
        teacherId: course.teacher.id,
        classId: course.classroom.id,
        academicYearId: course.academicYear.id,
        credits: course.credits
      });
    } else {
      const activeYear = academicYears.find(y => y.isActive);
      reset({
        subjectId: '',
        teacherId: '',
        classId: '',
        academicYearId: activeYear?.id || '',
        credits: 1.0
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CreateCourseFormData) => {
    try {
      const payload = { ...data, schoolId, credits: Number(data.credits) };
      if (editingCourse) {
        await api.patch(`/courses/${editingCourse.id}`, payload);
      } else {
        await api.post('/courses', payload);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error: unknown) {
      console.error("Failed to save course:", error);
      let message = "Failed to save course";
      if (error instanceof Error) {
        message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || error.message;
      }
      alert(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will remove this course assignment and affect the timetable.")) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

  return (
    <div className="flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
        <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Course Assignments</h1>
            <p className="text-gray-500 text-sm">Assign subjects to teachers and classes.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined">add</span>
            New Assignment
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">auto_stories</span>
            <p className="text-gray-500 font-medium">No courses assigned yet. Start by assigning a subject to a class.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Class</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Teacher</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Year</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Weight</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 dark:text-white">{course.classroom?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">book</span>
                        <span className="text-gray-700 dark:text-gray-300">{course.subject?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {course.teacher?.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-500">
                        {course.academicYear?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium">{course.credits}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleOpenModal(course)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(course.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? "Edit Assignment" : "New Course Assignment"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Classroom*</label>
            <select {...register('classId', { required: true })} className={inputClasses}>
              <option value="">Select Class...</option>
              {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Subject*</label>
              <select {...register('subjectId', { required: true })} className={inputClasses}>
                <option value="">Select Subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Teacher*</label>
              <select {...register('teacherId', { required: true })} className={inputClasses}>
                <option value="">Select Teacher...</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Academic Year*</label>
              <select {...register('academicYearId', { required: true })} className={inputClasses}>
                <option value="">Select Year...</option>
                {academicYears.map(y => <option key={y.id} value={y.id}>{y.name} {y.isActive ? '(Active)' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Credits/Weight</label>
              <input type="number" step="0.1" {...register('credits')} className={inputClasses} placeholder="1.0" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg">
              {editingCourse ? 'Update Assignment' : 'Assign Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
