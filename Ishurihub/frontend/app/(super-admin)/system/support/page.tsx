"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";

interface Ticket {
    id: string;
    schoolId: string;
    subject: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
}

export default function SystemSupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchTickets = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/tickets');
            setTickets(response.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/tickets/${id}/status`, { status: newStatus });
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update ticket status.");
        }
    };

    const filteredTickets = statusFilter === 'All'
        ? tickets
        : tickets.filter(t => t.status === statusFilter);

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
            case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
            case 'medium': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
            default: return 'text-slate-600 bg-slate-50 dark:bg-slate-800';
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-6">Support Tickets</h1>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${statusFilter === status
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Ticket List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white mx-auto mb-4"></div>
                        <p className="text-slate-500">Loading tickets...</p>
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inbox</span>
                        <p className="text-slate-500">No tickets found.</p>
                    </div>
                ) : (
                    filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">#{ticket.id.substring(0, 8)}</span>
                                        <span className="text-xs text-slate-500">• {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{ticket.subject}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{ticket.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">domain</span>
                                            School ID: {ticket.schoolId.substring(0, 8)}...
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">category</span>
                                            {ticket.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                                        className="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
