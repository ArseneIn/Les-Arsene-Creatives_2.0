
export type AdminRole = 'super_admin' | 'inventory_manager' | 'support_lead' | 'sales_associate' | 'customer';

export interface InternalPermissions {
  perm_financials: boolean;
  perm_fleet: boolean;
  perm_support: boolean;
  perm_userdata: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  productImage?: string;
  userName: string;
  userPhone?: string; // For correlation with tickets
  rating: number;
  date: string;
  title: string;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  hasActiveTicket?: boolean; // Intelligence flag
}

export interface Ticket {
  id: string;
  ticket_id: string; // Branded ID e.g. TIC-8821
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  product_name: string;
  category: 'Warranty' | 'Technical' | 'Delivery' | 'Account';
  priority: 'P1' | 'P2' | 'P3'; // P1=Critical (4h), P2=High (12h), P3=Standard (24h)
  status: 'Open' | 'In Progress' | 'Resolved';
  description: string;
  created_at: string;
  sla_deadline: string;
  order_id?: string;
  meta?: {
    fault_type?: string;
    resolution_preference?: string;
    pickup_address?: string;
    serial_number?: string;
    image_refs?: string[];
  };
}

export interface OrderLog {
  id: string;
  order_id: string;
  timestamp: string;
  location: string;
  status_text: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: 'Laptops' | 'Audio' | 'Photography' | 'Smart Home' | 'Accessories' | 'Office' | 'Phones' | 'Gaming' | 'Tablets' | 'Wearables';
  useCase: 'Gaming' | 'Office' | 'Content Creation' | 'Student' | 'Personal' | 'Studio';
  description: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  condition: 'New' | 'Used' | 'Renewed';
  related_ids?: string[]; 
  technical_specs: {
    memory?: string;
    cpu_brand?: 'Intel' | 'AMD' | 'Apple';
    cpu_model?: string;
    gpu_model?: string;
    storage?: string;
    display?: {
      size: string;
      panel: string;
      resolution: string;
      refresh_rate: string;
    };
    usb_ports?: string;
    dimensions?: string;
    audio_type?: 'Over-ear' | 'In-ear' | 'On-ear' | 'Home Theater' | 'Soundbar';
    audio_channels?: '2.0' | '2.1' | '5.1' | '7.1';
    noise_cancelling?: boolean;
    battery_life?: string;
    connectivity?: string[];
    camera_sensor?: string;
    camera_resolution?: string;
    camera_video?: string;
    camera_mount?: string;
    weather_sealed?: boolean;
    ecosystem?: 'Alexa' | 'Google' | 'HomeKit' | 'Tuya';
    lumens?: number;
    color_temp?: string;
    app_controlled?: boolean;
    compatible_models?: string[]; 
    power_output?: string;
    ports?: string[];
    weight_lbs?: number;
    model_year?: number;
  };
  specs: any;
  stock_quantity?: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
  image_url?: string;
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  phone_number: string;
  shipping_address: string;
  momo_ref: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: 'Unpaid' | 'Paid';
  items?: OrderItem[];
  // Added order_items to support joined results from Supabase
  order_items?: any[];
  payment_method?: 'MoMo' | 'Card' | 'Bank';
  payment_number?: string;
  merchant_notes?: string;
  verified_by?: string;
  automation_enabled?: boolean;
}

export type CheckoutStep = 'Shipping' | 'Payment' | 'Review';

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterState {
  activeCategory: string;
  brand: string[];
  priceRange: [number, number];
  memory: string[];
  cpu_brand: string[];
  audio_type: string[];
  connectivity: string[];
  camera_resolution: string[];
  sensor_size: string[];
  ecosystem: string[];
  compatibility: string[];
  condition: string[];
  display_size: string[];
  noise_cancelling: boolean | null;
  storage: string[];
  panel_type: string[];
  battery_life: string[];
}
