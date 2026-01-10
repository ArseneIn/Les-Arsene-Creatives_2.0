import { FilterState, Product, Order, OrderStatus, Review, Ticket, OrderLog, AdminRole, InternalPermissions } from '../types';
import { CATEGORIES, PRODUCTS } from '../services/mockData';

/**
 * Production Environment Handshake
 * Resolves environment variables with a failsafe to prevent 'Failed to fetch' crashes
 */
const getEnv = (key: string): string => {
  try {
    // 1. Check import.meta.env (Vite standard)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const val = (import.meta as any).env[key];
      if (val) return val;
    }
    // 2. Check process.env (Vercel/Node standard)
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[key];
      if (val) return val as string;
    }
  } catch (e) {}
  return '';
};

// Local-only mode: force local mock data usage for offline development
export const isSupabaseConfigured = false;

// Lightweight supabase stub to satisfy existing imports and calls in the codebase
export const supabase: any = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      return { data: { user: { id: email || 'local-user-id' } }, error: null };
    },
    signUp: async (_: any) => {
      return { data: { user: { id: 'local-user-id' } }, error: null };
    },
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null })
  },
  from: () => ({ select: async () => ({ data: [], error: null }) })
};

export function calculateSLADeadline(priority: 'P1' | 'P2' | 'P3'): string {
  const now = new Date();
  const hoursToAdd = priority === 'P1' ? 4 : priority === 'P2' ? 12 : 24;
  let deadline = new Date(now);
  let remainingHours = hoursToAdd;
  const BUSINESS_START = 8;
  const BUSINESS_END = 17;

  while (remainingHours > 0) {
    deadline.setHours(deadline.getHours() + 1);
    if (deadline.getDay() === 0 || deadline.getDay() === 6) {
      deadline.setHours(8);
      deadline.setDate(deadline.getDate() + (deadline.getDay() === 6 ? 2 : 1));
      continue;
    }
    const currentHour = deadline.getHours();
    if (currentHour < BUSINESS_START || currentHour >= BUSINESS_END) {
      deadline.setHours(8);
      deadline.setDate(deadline.getDate() + 1);
      continue;
    }
    remainingHours--;
  }
  return deadline.toISOString();
}

// Data Nodes - All functions are guarded with the configuration check
export async function getUserProfile(userId: string) {
  // Return a lightweight local profile when running in local-only mode
  if (!isSupabaseConfigured) return { id: userId, full_name: 'Demo User', role_type: 'customer' };
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function getInternalStaff() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('profiles').select('*').neq('role_type', 'customer');
  if (error) throw error;
  return data;
}

export async function deployNewAdmin(adminData: any) {
  if (!isSupabaseConfigured) return adminData;
  const { data, error } = await supabase.from('profiles').insert([adminData]).select().single();
  if (error) throw error;
  return data;
}

export async function updateInternalPermission(staffId: string, flag: string, value: boolean) {
  if (!isSupabaseConfigured) return true;
  const { error } = await supabase.from('profiles').update({ [flag]: value }).eq('id', staffId);
  if (error) throw error;
  return true;
}

export async function getAllOrders() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function getAllCustomers() {
  if (!isSupabaseConfigured) return [];
  const orders = await getAllOrders();
  const customersMap = new Map<string, any>();
  orders?.forEach(order => {
    const key = order.phone_number;
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        name: order.customer_name, phone: order.phone_number,
        email: `${order.customer_name.toLowerCase().replace(/\s/g, '.')}@gmail.com`,
        address: order.shipping_address || 'Kigali, Rwanda',
        totalOrders: 0, totalSpent: 0, lastActive: order.created_at,
        orders: [], categories: {}, brands: {}
      });
    }
    const customer = customersMap.get(key);
    customer.totalOrders += 1;
    customer.totalSpent += order.total_amount;
    customer.orders.push(order);
  });
  return Array.from(customersMap.values());
}

export async function fetchOrderTracking(orderId: string, contact: string) {
  if (!isSupabaseConfigured) return { data: null, error: 'Not Configured' };
  const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).or(`phone_number.eq.${contact},email.eq.${contact}`).single();
  return { data: data as Order, error };
}

export async function fetchOrderLogs(orderId: string) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('order_logs').select('*').eq('order_id', orderId).order('timestamp', { ascending: false });
  if (error) throw error;
  return data as OrderLog[];
}

export async function fetchUserOrders(phone: string) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('phone_number', phone).order('created_at', { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function fetchAllLogs(limit = 5) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('order_logs').select('*').order('timestamp', { ascending: false }).limit(limit);
  if (error) throw error;
  return data as OrderLog[];
}

export async function fetchInventory(page = 0, pageSize = 20, categoryFilter: string | null = null) {
  // Local-only: return products from mock data
  const from = page * pageSize;
  let filtered = PRODUCTS;
  if (categoryFilter && categoryFilter !== 'All') filtered = PRODUCTS.filter(p => p.category === categoryFilter);
  const data = filtered.slice(from, from + pageSize);
  const count = filtered.length;
  return { data, count };
}

export function getCategories() {
  return CATEGORIES;
}

export async function getPendingReviews() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('reviews').select('*, products(name)').eq('is_approved', false);
  if (error) throw error;
  return data.map(r => ({ ...r, productName: r.products?.name })) as Review[];
}

export async function updateReviewApproval(reviewId: string, isApproved: boolean) {
  if (!isSupabaseConfigured) return true;
  if (isApproved) {
    const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', reviewId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) throw error;
  }
  return true;
}

export async function getActiveTickets() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('tickets').select('*').order('sla_deadline', { ascending: true });
  if (error) throw error;
  return data as Ticket[];
}

export async function fetchUserTickets(phone: string) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('tickets').select('*').eq('customer_phone', phone).order('created_at', { ascending: false });
  if (error) throw error;
  return data as Ticket[];
}

export async function createTicket(ticket: Partial<Ticket>) {
  if (!isSupabaseConfigured) return { ...ticket, id: 'TIC-MOCK' };
  const priority = ticket.priority || 'P3';
  const deadline = calculateSLADeadline(priority);
  const brandedId = 'TIC-' + Math.floor(1000 + Math.random() * 9000);
  const { data, error } = await supabase.from('tickets').insert([{ ...ticket, ticket_id: brandedId, sla_deadline: deadline, status: 'Open' }]).select().single();
  if (error) throw error;
  return data;
}

export async function updateTicketStatus(ticketId: string, status: 'Open' | 'In Progress' | 'Resolved') {
  if (!isSupabaseConfigured) return true;
  const { error } = await supabase.from('tickets').update({ status }).eq('id', ticketId);
  if (error) throw error;
  return true;
}

export async function resolveTicket(ticketId: string) {
  return updateTicketStatus(ticketId, 'Resolved');
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, previousStatus?: OrderStatus) {
  if (!isSupabaseConfigured) return true;
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) throw error;
  return true;
}

export async function updateMerchantData(orderId: string, updates: { merchant_notes?: string, verified_by?: string }) {
  if (!isSupabaseConfigured) return true;
  const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
  if (error) throw error;
  return true;
}

export async function updateAutomationStatus(orderId: string, enabled: boolean) {
  if (!isSupabaseConfigured) return true;
  const { error } = await supabase.from('orders').update({ automation_enabled: enabled }).eq('id', orderId);
  if (error) throw error;
  return true;
}
