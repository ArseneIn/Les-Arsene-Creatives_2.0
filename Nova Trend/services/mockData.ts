
import { Product, Review } from '../types';

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userName: 'Jean Bosco',
    rating: 5,
    date: 'Oct 20, 2024',
    title: 'Professional Grade Performance',
    comment: 'The OLED screen on this Vivobook is absolutely stunning. I use it for video editing in Kigali and the colors are spot on. Best investment this year.',
    isVerified: true,
    isApproved: true
  },
  {
    id: 'r2',
    productId: 'acc-anker',
    userName: 'Divine U.',
    rating: 5,
    date: 'Sep 15, 2024',
    title: 'Fastest Charger I Own',
    comment: 'Charges my MacBook Pro and iPhone 15 at the same time without breaking a sweat. Compact and build quality is top-tier.',
    isVerified: true,
    isApproved: true
  },
  {
    id: 'r4',
    productId: 'lp-mbp16',
    userName: 'Amani Uwase',
    rating: 5,
    date: 'Nov 02, 2024',
    title: 'Ultimate Creative Machine',
    comment: 'The M3 Max chip is a beast for 3D rendering. Best investment for our agency.',
    isVerified: true,
    isApproved: true
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Vivobook S 15 OLED (2025)',
    brand: 'Asus',
    price: 1299,
    originalPrice: 1499,
    image: '/assets/images/laptop.svg',
    category: 'Laptops',
    useCase: 'Content Creation',
    isFeatured: true,
    isNew: true,
    condition: 'New',
    related_ids: ['acc-anker', 'acc-sleeve'],
    description: 'The ASUS Vivobook S 15 is an ultra-thin and light laptop with a stunning 3K 120Hz OLED display.',
    rating: 4.8,
    reviewsCount: 124,
    technical_specs: {
      memory: '16GB',
      cpu_brand: 'Intel',
      cpu_model: 'Core Ultra 7',
      storage: '1TB',
      display: { size: '15.6"', panel: 'OLED', resolution: '2880x1620', refresh_rate: '120Hz' },
      battery_life: '10 Hours',
      weight_lbs: 3.3,
      model_year: 2025
    },
    specs: {}
  },
  {
    id: 'lp-mbp16',
    name: 'MacBook Pro 16 (M3 Max)',
    brand: 'Apple',
    price: 3499,
    image: '/assets/images/macbook.svg',
    category: 'Laptops',
    useCase: 'Studio',
    isFeatured: true,
    condition: 'New',
    related_ids: ['acc-logi-mx', 'acc-satechi'],
    description: 'The ultimate pro laptop. M3 Max chip with 48GB Unified Memory and 1TB SSD.',
    rating: 5.0,
    reviewsCount: 89,
    technical_specs: {
      memory: '48GB',
      cpu_brand: 'Apple',
      cpu_model: 'M3 Max',
      storage: '1TB',
      display: { size: '16.2"', panel: 'Liquid Retina XDR', resolution: '3456x2234', refresh_rate: '120Hz' },
      battery_life: '22 Hours'
    },
    specs: {}
  },
  {
    id: 'lp-xps15',
    name: 'Dell XPS 15 9530',
    brand: 'Dell',
    price: 2199,
    originalPrice: 2399,
    image: '/assets/images/laptop.svg',
    category: 'Laptops',
    useCase: 'Office',
    condition: 'New',
    description: 'Power meets elegance. i7, 32GB RAM, 1TB NVMe, and a gorgeous OLED 3.5K touch screen.',
    rating: 4.7,
    reviewsCount: 56,
    technical_specs: {
      memory: '32GB',
      cpu_brand: 'Intel',
      cpu_model: 'Core i7-13700H',
      storage: '1TB',
      display: { size: '15.6"', panel: 'OLED', resolution: '3.5K', refresh_rate: '60Hz' },
      battery_life: '8 Hours'
    },
    specs: {}
  }
];

export const CATEGORIES = ['Laptops', 'Phones', 'E-Bikes', 'Audio', 'Photography', 'Smart Home', 'Accessories', 'Office', 'Gaming', 'Tablets', 'Wearables'];
export const BRANDS = ['Apple', 'Asus', 'Sony', 'JBL', 'Godox', 'Anker', 'Samsung', 'Logitech', 'Bose', 'Sonos', 'SanDisk', 'Peak Design', 'Bellroy', 'Dell', 'Lenovo', 'HP', 'Razer', 'Microsoft', 'Acer', 'MSI', 'Google', 'OnePlus', 'Xiaomi', 'Tecno', 'Marshall', 'Beats', 'Canon', 'DJI', 'Fujifilm', 'GoPro', 'Nikon', 'Insta360', 'Philips', 'Ring', 'Eufy', 'Govee', 'Amazon', 'Nanoleaf', 'TP-Link', 'Roborock', 'August', 'Keychron', 'Ugreen', 'LG', 'SpaceX', 'Synology'];
export const RAM_OPTIONS = ['8GB', '16GB', '24GB', '32GB', '48GB', '64GB', '128GB'];
export const CPU_BRANDS = ['Intel', 'AMD', 'Apple'] as const;
export const CONDITIONS = ['New', 'Used', 'Renewed'];
export const USE_CASES = ['Gaming', 'Office', 'Content Creation', 'Student', 'Personal', 'Studio'];
// Added missing AUDIO_TYPES constant
export const AUDIO_TYPES = ['Headphones', 'Earbuds', 'Soundbars', 'Home Theater'];
// Added missing COMPATIBILITY_OPTIONS constant
export const COMPATIBILITY_OPTIONS = ['MacBook Pro', 'iPhone', 'iPad', 'Universal'];

export const FLEET = [
  {
    id: 'fleet-mbp16',
    name: 'MacBook Pro 16 (M3 Max) - Fleet',
    category: 'Laptops',
    image: '/assets/images/macbook.svg',
    quantity: 4,
    status: 'Available',
    notes: 'Assigned to design and ops'
  },
  {
    id: 'fleet-ebike-pro',
    name: 'Nova E-Bike Pro',
    category: 'E-Bikes',
    image: '/assets/images/ebike.svg',
    quantity: 6,
    status: 'Available',
    notes: 'Fleet for on-site deliveries'
  },
  {
    id: 'fleet-audio-1',
    name: 'JBL Studio Audio Rack',
    category: 'Audio',
    image: '/assets/images/audio.svg',
    quantity: 2,
    status: 'Maintenance',
    notes: 'Repair scheduled'
  }
];
