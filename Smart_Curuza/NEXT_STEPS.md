# Smart-Curuza - Next Implementation Steps

## Current Status ✅

We have effectively transitioned our focus into the **Smart Curuza Mobile Application**, applying a premium "Executive Dark" design language.

1. ✅ **Mobile Connectivity & Sync**: Fixed LAN routing, resolved cyclic dependencies, and rebuilt the sync queue using robust file-system APIs for complete offline reliability.
2. ✅ **Mobile Authentication**: Resolved the issue where `SecureStore` cached old/unknown tokens, allowing the Login flow to function cleanly.
3. ✅ **Mobile Dashboards & Timezones**: Created `history.tsx` and charts. Fixed critical timezone bugs to ensure Kigali (UTC+2) business days don't bleed across midnight.
4. ✅ **Team Management**: Integrated accurate staff sales tracking and removed intrusive data polling errors.

---

## Next Implementation Options (Mobile Focus)

The current UI is highly stable, but some metrics are still predominantly powered by hard-coded text or mathematical mocks. The next steps involve making the application perfectly usable for real-world interactions.

### **Option A: Build the Missing Mobile Modules (Inventory & Expenses)**
**Time**: 60-90 minutes  
**Impact**: Makes the mobile hub visually complete.

In `app/(tabs)/index.tsx`, the `overview` and `crm` tabs are hooked up, but the `inventory` and `expenses` tabs only render localized placeholders.
- Build `InventoryModule.tsx` matching the "Executive Dark" aesthetic.
- Build `ExpensesModule.tsx` to track cash outflows.

### **Option B: Wire up the Mobile CRM to Real API Data**
**Time**: 45-90 minutes  
**Impact**: Actual debt monitoring

Currently, `CRMModule.tsx` uses simulated internal object arrays for its clients because frontend endpoints hadn't been linked.
- Integrate `ApiClient` fetching for CRM metrics.
- Ensure the total `Outstanding Debt` represents actual Postgres records.

### **Option C: Complete Dashboard Analytics via the API**
**Time**: 45 minutes  
**Impact**: Executive reporting

In `ProductSalesChart.tsx`, items are rendered via `Math.random()`. `DashboardStats.tsx` simulates expenses and gross margins (`todaySales * 0.4`).
- Plug the newly fixed timezone-accurate data points into the frontend state variables.

### **Option D: Implement Fractional Retail & Light Manufacturing (Future Plans)**
**Time**: 2-3 hours
**Impact**: Sector expansion

Based on our newly mapped `FUTURE_PLANS.md`, this would involve:
- Updating `CartModal` to support decimal keypad entry for Quincailleries.
- Allowing "Open Item" custom sales.
- Building the simple Production Run interface to convert Raw Materials into Produced Goods for bakers.

---

## Recommended Path

**Start with Option C (Remove Mocked Stats)** so that your presentation Layer is finally rendering actual backend numbers rather than random calculations. Alternatively, if you want to expand the system's target market immediately, we can tackle **Option D**.
