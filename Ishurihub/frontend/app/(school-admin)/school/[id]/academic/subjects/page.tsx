"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal";
import { useForm } from "react-hook-form";

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  schoolId: string;
}

interface CreateSubjectFormData {
  name: string;
  code: string;
  description: string;
  department: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [search, setSearch] = useState("");

  const params = useParams();
  const schoolId = params.id as string;

  const { register, handleSubmit, reset, setValue } = useForm<CreateSubjectFormData>();

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/subjects', { params: { schoolId, search } });
      setSubjects(res.data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, search]);

  useEffect(() => {
    if (schoolId) fetchSubjects();
  }, [schoolId, fetchSubjects]);

  const handleOpenModal = (subject: Subject | null = null) => {
    setEditingSubject(subject);
    if (subject) {
      setValue('name', subject.name);
      setValue('code', subject.code);
      setValue('description', subject.description);
      setValue('department', subject.department);
    } else {
      reset({ name: '', code: '', description: '', department: '' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CreateSubjectFormData) => {
    try {
      const payload = { ...data, schoolId };
      if (editingSubject) {
        await api.patch(`/subjects/${editingSubject.id}`, payload);
      } else {
        await api.post('/subjects', payload);
      }
      fetchSubjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save subject:", error);
      alert("Failed to save subject");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This might affect existing courses and grades.")) return;
    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Failed to delete subject");
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

  return (
    <div className="flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
        <div className="flex flex-wrap justify-between items-end gap-3 pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Subjects Management</h1>
            <p className="text-gray-500 text-sm">Define what is taught in your school.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined">add</span>
            Add Subject
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">import_contacts</span>
            <p className="text-gray-500 font-medium">No subjects defined yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="bg-white dark:bg-white/5 p-5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm relative group transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">book</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleOpenModal(subject)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-md">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(subject.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{subject.name}</h3>
                <p className="text-xs font-mono text-primary bg-primary/5 px-2 py-0.5 rounded inline-block mb-3">
                  {subject.code || "No Code"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {subject.description || "No description provided."}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2 text-xs text-gray-400">
                  <span className="material-symbols-outlined text-[14px]">category</span>
                  {subject.department || "General"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? "Edit Subject" : "Add New Subject"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Subject Name*</label>
            <input {...register('name', { required: true })} className={inputClasses} placeholder="e.g. Mathematics" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Code</label>
              <input {...register('code')} className={inputClasses} placeholder="e.g. MAT101" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Department</label>
              <input {...register('department')} className={inputClasses} placeholder="e.g. Sciences" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea {...register('description')} className={`${inputClasses} h-24 resize-none`} placeholder="Brief description of the subject..." />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg">
              {editingSubject ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
