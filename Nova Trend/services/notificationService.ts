
/**
 * Titan Electronics - Automated Notification Service
 * Simulates backend triggers for order status updates.
 */

export interface NotificationPayload {
  customerName: string;
  orderNumber: string;
  courierName: string;
  courierPhone: string;
  eta: string;
  trackingUrl: string;
}

export type NotificationType = 'WHATSAPP' | 'SMS';

export class NotificationService {
  private static retryCount = 0;
  private static maxRetries = 1;

  /**
   * Generates a unique tracking URL for the customer
   */
  private static getTrackingLink(orderNo: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/track?id=${orderNo.replace('#', '')}`;
  }

  /**
   * Templates for WhatsApp (Branded/Formatted)
   */
  private static getWhatsAppTemplate(data: NotificationPayload): string {
    return `📦 *Great news! Your tech is on the way!*

Hello ${data.customerName}, your order *${data.orderNumber}* has just left our warehouse in Kigali and is currently *Out for Delivery*.

🚚 *Courier Details:*
Driver Name: ${data.courierName}
Phone: ${data.courierPhone}
Estimated Arrival: Within ${data.eta}

📍 *Track in Real-Time:* ${this.getTrackingLink(data.orderNumber)}

Please ensure someone is available at the delivery address to receive and inspect your new laptop.

Thank you for choosing *Titan Electronics*! 🧡`;
  }

  /**
   * Templates for SMS (Quick/Direct)
   */
  private static getSMSTemplate(data: NotificationPayload): string {
    return `Order ${data.orderNumber} is OUT FOR DELIVERY! Our courier ${data.courierName} will arrive shortly. Track your package here: ${this.getTrackingLink(data.orderNumber)}. Thanks for shopping with Titan!`;
  }

  /**
   * Mock API Call to Twilio / WhatsApp Business API
   */
  public static async sendNotification(
    data: NotificationPayload, 
    type: NotificationType,
    onSuccess: (msg: string) => void,
    onError: (err: string) => void
  ): Promise<void> {
    const message = type === 'WHATSAPP' ? this.getWhatsAppTemplate(data) : this.getSMSTemplate(data);
    
    console.log(`[Notification Engine] Triggering ${type} to ${data.customerName}...`);
    
    try {
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate 10% failure rate for retry logic demonstration
      if (Math.random() < 0.1 && this.retryCount < this.maxRetries) {
        throw new Error("Network Congestion at Gateway");
      }

      console.log(`[${type} SENT]:\n${message}`);
      onSuccess(message);
      
      // Schedule "Unboxing Follow-up" (Simulated 24 hours later)
      this.scheduleUnboxingFollowup(data, onSuccess);

    } catch (error) {
      console.error(`[Notification Error]: ${error.message}. Retrying in 5 minutes...`);
      this.retryCount++;
      
      // Mock Retry
      setTimeout(() => {
        this.sendNotification(data, type, onSuccess, onError);
      }, 2000); // 2 seconds instead of 5 mins for demo purposes
      
      onError(`Failed to send. Retry ${this.retryCount}/${this.maxRetries} initiated.`);
    }
  }

  private static scheduleUnboxingFollowup(data: NotificationPayload, onSend: (msg: string) => void) {
    const followUpMsg = `How is your new laptop performing? 💻 We hope you love it! If you have any questions about the setup, reply to this message or visit our Support Center. Enjoy your new gear!`;
    
    // In a real app, this would be a CRON job. Here we just log the intention.
    console.log(`[Unboxing Follow-up] Scheduled for order ${data.orderNumber} in 24 hours.`);
    
    // For demo, we trigger it after 10 seconds
    setTimeout(() => {
      onSend(`[24H FOLLOW-UP]: ${followUpMsg}`);
    }, 10000);
  }
}
