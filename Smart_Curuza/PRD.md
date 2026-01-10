# **PRODUCT CANVAS: SMART-CURUZA**

**Version:** 2.1 (Added Yield Tracking/Batching) **Type:** Offline-First Distributed ERP & Fintech System

## **1\. CORE OBJECTIVE**

To build a hybrid Point-of-Sale (POS) and Inventory system that runs **offline** on Android POS hardware and Smartphones, utilizing **USSD** for feature phones, with a focus on **Device Financing security**, **Customer Relationship Management (CRM)**, and **Revenue Yield Tracking**.

## **2\. TECHNICAL STACK (MANDATORY)**

* **Web Frontend:** Next.js (React) - Located in `web/` directory.
* **Mobile App:** React Native (Expo) - Located in `mobile/` directory. *Targeting Android POS & Smartphones.*
* **Backend:** Node.js (NestJS) - Located in `backend/` directory. *Handles high-concurrency USSD & Webhooks.*
* **Database:** PostgreSQL (Cloud) + IndexedDB (Local Browser Storage) + SQLite (Mobile Local Storage).
* **Caching:** Redis (For USSD Sessions).
* **Connectivity:** Offline-First Architecture (Sync via Service Workers/TanStack Query for Web, TanStack Query/SQLite for Mobile).

## **3\. DATABASE SCHEMA (BLUEPRINT)**

*Generate SQL for the following tables:*

| Table Name | Key Fields | Purpose |
| :---- | :---- | :---- |
| merchants | id, device\_id, wallet\_balance, lock\_status | Stores shop owner details & subscription status. |
| products | id, barcode, parent\_id, conversion\_factor, stock | Handles "Breaking Bulk" (1 Sack \= 50kg). |
| **batches** | **id, product\_id, cost\_price, expected\_revenue, current\_revenue, status** | **(NEW) Tracks profitability of specific stock batches (e.g., Sack of Eggplants).** |
| sales | id, customer\_id, total, payment\_method, sync\_status | Record transactions (Cash/MoMo/Credit). |
| customers | id, phone, name, total\_debt, loyalty\_points | Stores client profiles. |
| debt\_ledger | id, customer\_id, sale\_id, amount\_due, due\_date | Tracks "Madeni" (Credit sales). |
| device\_heartbeats | device\_id, last\_ping\_timestamp, ip\_address | Used for the MDM security lock logic. |

## **4\. FUNCTIONAL MODULES (THE LOGIC)**

### **Module A: Inventory & "Yield Tracking" (Updated)**

* **Feature 1: Breaking Bulk**  
  * **Logic:** When Child Item (1kg Rice) is sold, deduct 1 / conversion\_factor from Parent Item (50kg Sack).  
* **Feature 2: Expected Revenue (Yield) \- NEW**  
  * *Action:* Merchant inputs "New Batch" \-\> Enters Cost (30k) & Target Revenue (50k).  
  * *Tracking:* Every sale linked to this product updates batches.current\_revenue.  
  * *Visual:* Show a progress bar on the dashboard: "70% of Target Revenue Reached".  
  * *Alert:* If Stock \= 0 but Revenue \< Target, flag as "Loss/Spoilage".

###  **Module B: Integrated Payments (Cost Reduction)**

* **Feature:** STK Push (Auto-pop up on customer phone).  
* **Workflow:**  
  1. POS initiates payment via Backend.  
  2. Backend calls MTN/Airtel API.  
  3. **Webhook** listens for "Success".  
  4. Socket pushes "Success" to POS.  
  5. POS auto-prints receipt.  
  6. *Cost Logic:* Tag transaction with aggregator\_id to apply bulk discount rates.

### **Module C: Client Management (CRM)**

* **Feature 1: Digital "Madeni" (Debt) Book**  
  * *Action:* At checkout, Merchant selects Payment Method: **"Credit / Ideni"**.  
  * *Input:* Select Customer from list (or create new).  
  * *Logic:* Update debt\_ledger table. Increase customers.total\_debt.  
  * *Receipt:* Print a "Debt Acknowledgement" receipt for the customer to sign.  
* **Feature 2: SMS Reminders**  
  * *Action:* Merchant clicks "Remind" on the debtor list.  
  * *System:* Backend sends SMS: *"Hello \[Name\], kindly pay your balance of \[Amount\] at \[Shop Name\]."*  
* **Feature 3: Loyalty Points**  
  * *Logic:* Every 1,000 RWF spent \= 1 Point.  
  * *Benefit:* Merchants can offer discounts to loyal customers.

### **Module D: Device Security (MDM)**

* **Logic:** App runs as a Launcher (Kiosk Mode).  
* **Trigger:** If daily\_rental\_paid \== false AND last\_heartbeat \> 24 hours \-\> **LOCK SCREEN**.  
* **Unlock:** When Payment Webhook received \-\> Push "UNLOCK" command via MQTT.

## **5\. UI/UX GUIDELINES (FOR AI CODE GENERATION)**

### **The "Visual-First" Interface**

* **Grid Layouts:** Use GridView with images for products, not just lists.  
* **Color Coding:**  
  * **golden yellow:** Debt / Stock Out / Locked Device.  
  * **Green:** Cash Sale / Stock In.  
  * **Red:** Debt / Stock Out / Locked Device.  
  * **Blue:** Mobile Money.  
* **Voice Accessibility:**  
  * Implement Web Speech API (Text to Speech).  
  * On LongPress of any button, read the button text in Kinyarwanda.

## **6\. SPECIFIC PROMPTS FOR THE AI TOOL**

*Copy these prompts one by one to generate the code:*

1. **Database:** "Generate the PostgreSQL migration scripts for the schema defined in Section 3, specifically ensuring the customers and debt\_ledger tables are linked correctly to the sales table."  
2. **Backend:** "Create a NestJS service for ClientManagement. It needs an endpoint to createDebtRecord and another to sendSmsReminder using a generic SMS gateway interface."  
3. **Frontend (POS):** "Create a Next.js page for Checkout. If the user selects 'Credit' as the payment method, open a modal to Search/Add a Customer, and save the transaction locally with sync\_status: pending."  
4. **Sync Logic:** "Write a TypeScript SyncService that uses Service Workers. It should query local IndexedDB for any sales or new customers with sync\_status: pending and POST them to the API when internet is available."  
5. **Inventory Logic:** "Write the logic for BatchYieldService. When a new batch is created, accept expected\_revenue. When a sale occurs, update current\_revenue and calculate the percentage of the target reached."

