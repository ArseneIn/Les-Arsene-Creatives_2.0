"use client";

import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Modal from "@/components/Modal";
import api from "@/lib/api";
import Image from "next/image";

interface PhotoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newUrl: string) => void;
    studentId: string;
}

export default function PhotoUploadModal({ isOpen, onClose, onSuccess, studentId }: PhotoUploadModalProps) {
    const [mode, setMode] = useState<'select' | 'camera' | 'upload'>('select');
    const [preview, setPreview] = useState<string | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setPreview(imageSrc);
            // Convert base64 to File
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
                    setFileToUpload(file);
                });
        }
    }, [webcamRef]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFileToUpload(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!fileToUpload) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
            const res = await api.post(`/students/${studentId}/upload-photo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Assume backend returns the student object with new avatarUrl
            // But we actually return the update result. We know the path is composed in backend.
            // Let's rely on standard response. Ideally backend returns the update result or we construct URL.
            // Our backend controller returns `this.studentsService.updatePhoto(...)` which returns the Student entity.
            // Prepend backend URL if relative path returned
            const avatarUrl = res.data.avatarUrl.startsWith('http')
                ? res.data.avatarUrl
                : `http://localhost:4000${res.data.avatarUrl}`;

            onSuccess(avatarUrl);
            onClose();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload photo");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Update Profile Photo">
            <div className="space-y-6">

                {mode === 'select' && (
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setMode('camera')}
                            className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="material-symbols-outlined text-4xl text-primary">photo_camera</span>
                            <span className="font-bold">Take Photo</span>
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="material-symbols-outlined text-4xl text-blue-500">upload_file</span>
                            <span className="font-bold">Upload File</span>
                            <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={(e) => { handleFileChange(e); setMode('upload'); }} />
                        </button>
                    </div>
                )}

                {mode === 'camera' && !preview && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="rounded-xl overflow-hidden border-2 border-primary bg-black">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={400}
                                height={300}
                                videoConstraints={{ facingMode: "user" }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setMode('select')} className="px-4 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
                            <button onClick={capture} className="px-6 py-2 rounded-lg bg-primary text-white font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined">camera</span> Capture
                            </button>
                        </div>
                    </div>
                )}

                {(mode === 'upload' || preview) && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative size-48 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700">
                            {preview && <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setPreview(null); setFileToUpload(null); setMode('select'); }} className="px-4 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10">
                                Retake / Change
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="px-6 py-2 rounded-lg bg-green-500 text-white font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                {isUploading ? 'Saving...' : 'Save Photo'}
                                <span className="material-symbols-outlined">check</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
