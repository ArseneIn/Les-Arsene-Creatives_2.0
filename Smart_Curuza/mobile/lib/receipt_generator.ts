import { CartItem } from './types';

/**
 * Generates a formatted text receipt suitable for sharing via WhatsApp, SMS, or Email.
 */
export const generateTextReceipt = (
    items: CartItem[], 
    total: number, 
    shopName: string, 
    method: string,
    clientName?: string
): string => {
    const date = new Date().toLocaleString();
    const divider = '────────────────';
    
    let receipt = `🧾 *RECEIPT: ${shopName.toUpperCase()}*\n`;
    receipt += `📅 ${date}\n`;
    receipt += `${divider}\n\n`;
    
    items.forEach(item => {
        const itemTotal = item.quantity * item.price;
        receipt += `▪️ ${item.name}\n`;
        receipt += `   ${item.quantity} x ${item.price.toLocaleString()} RWF = ${itemTotal.toLocaleString()} RWF\n`;
    });
    
    receipt += `\n${divider}\n`;
    receipt += `*TOTAL: ${total.toLocaleString()} RWF*\n`;
    receipt += `💳 Payment: ${method}\n`;
    
    if (clientName) {
        receipt += `👤 Client: ${clientName}\n`;
    }
    
    receipt += `${divider}\n\n`;
    receipt += `Thank you for your business! 🙏\n`;
    receipt += `_Sent via Smart Curuza POS_`;
    
    return receipt;
};
