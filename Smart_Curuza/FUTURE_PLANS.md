# Future Plans: Expanding Smart Curuza for Diverse Rwandan Contexts

This document outlines the architectural and product strategy to adapt Smart Curuza for informal and specialized retail sectors in Rwanda, specifically addressing the **Quincaillerie (Hardware store)** and **Light Manufacturing (Mandazi baker / local producer)** use cases.

## Current State Assessment
Our current database architecture is actually well-positioned for this pivot:
- `Product.stock` is a `decimal (10,2)`, meaning the database already supports fractional inventory (e.g., `1.5` kg).
- `Product.unit` and `buying_unit` are already strings, allowing for dynamic units (kg, liters, meters).
- `Product.parent_id` and `conversion_factor` exist, which hints at bulk-breaking capabilities (buying a box, selling singles).

However, the **Mobile POS UI** and the **Business Logic** are currently optimized for standard retail (whole items, simple buy/sell loops). We need to introduce new workflows.

---

## 1. The "Quincaillerie" Context (Bulk & Fractional Sales)
**The Problem:** Hardware stores sell materials like cables, nets, and nails by fractions of a meter or kilogram. The standard POS `[ - ] 1 [ + ]` stepper UI is useless when a customer asks for 1.25 meters of electrical wire.

**The Solution:**
*   **Decimal Support in POS:** Update the `CartModal` and `ProductGrid` to allow a "Weight/Length Entry" mode. If a product's unit is `kg`, `m`, or `ltr`, clicking it should open a numeric keypad allowing decimal inputs (e.g., `1.25`) rather than instantly adding `1` to the cart.
*   **Dynamic Pricing:** The system must accurately calculate `1.25m * RWF 2,000/m = RWF 2,500`.
*   **Custom Cuts/Off-Catalog Items:** Hardware stores often sell miscellaneous items or off-cuts. We need an "Open Item" button on the POS where the cashier can just type a name ("Scrap Wood") and a price ("RWF 500") on the fly without cluttering the main inventory.

---

## 2. The "Mandazi" Context (Light Manufacturing / Production)
**The Problem:** A Mandazi seller does not "buy" Mandazi from a supplier to resell. They buy raw materials (Flour, Sugar, Oil) and *produce* the Mandazi. Selling a Mandazi should ideally deduct from the raw material inventory, or they need a way to track production yields.

**The Solution:**
To avoid turning Smart Curuza into a bloated, complex ERP system, we will implement **"Simple Light Manufacturing"**:

### A. Product Types
Introduce a `type` column to the `Product` entity:
- `STANDARD`: Normal retail goods (buy and sell).
- `RAW_MATERIAL`: Items bought but not sold on the POS (e.g., 50kg Sack of Flour). Hidden from cashiers.
- `PRODUCED_GOOD`: Items that are sold, but are linked to a recipe.

### B. Recipes / Bill of Materials (BOM)
Create a new `Recipe` entity that links a `PRODUCED_GOOD` to its `RAW_MATERIALS`.
*Example: 1 Batch of Mandazi (50 pieces) = 2kg Flour + 0.5kg Sugar + 1L Oil.*

### C. The "Production Run" Workflow
Instead of just a "Restock" button, the merchant will have a **"Produce"** button. 
When the baker finishes their morning shift, they log: *"Produced 150 Mandazis"*.
1. The system automatically calculates: `(150 / 50) = 3 batches`.
2. The system **increases** Mandazi stock by 150.
3. The system **deducts** 6kg Flour, 1.5kg Sugar, and 3L Oil from the Raw Materials stock.

---

## Proposed Execution Phases

### Phase 1: Fractional Retail (Quick Win)
Focus on the UI updates required to serve the Quincaillerie.
1. Update `Product` entity to enforce `is_fractional` boolean flag.
2. Modify Mobile POS to show a decimal numpad for fractional products.
3. Implement the "Open Item" POS feature for unlisted sales.

### Phase 2: Simple Production (Strategic Expansion)
Focus on the Mandazi maker.
1. Add `ProductType` enum (`STANDARD`, `RAW_MATERIAL`, `PRODUCED`).
2. Create the `RecipeItem` entity to map relationships.
3. Build a "Production Terminal" UI in the app where merchants log daily yields.
