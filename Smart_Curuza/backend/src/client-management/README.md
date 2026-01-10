# Client Management API

This module handles **Customer Relationship Management (CRM)** and **Debt Management** for the Smart-Curuza platform.

## Features

### 1. Digital "Madeni" (Debt) Book
- Create debt records when customers buy on credit
- Automatically update customer's total debt
- Link debt to specific sales transactions

### 2. SMS Reminders
- Send automated SMS reminders to customers with outstanding debt
- Customizable message format
- Integration with generic SMS gateway

## API Endpoints

### Create Debt Record
**POST** `/client-management/debt`

Creates a new debt record and updates the customer's total debt.

**Request Body:**
```json
{
  "customerId": "uuid-of-customer",
  "saleId": "uuid-of-sale",
  "amountDue": 5000,
  "dueDate": "2025-12-01T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "debtRecord": {
    "id": "uuid",
    "customer_id": "uuid-of-customer",
    "sale_id": "uuid-of-sale",
    "amount_due": 5000,
    "due_date": "2025-12-01T00:00:00Z",
    "status": "PENDING",
    "created_at": "2025-11-25T23:00:00Z"
  },
  "customerTotalDebt": 15000
}
```

### Send SMS Reminder
**POST** `/client-management/remind/:customerId`

Sends an SMS reminder to a customer about their outstanding debt.

**URL Parameters:**
- `customerId` - The UUID of the customer

**Request Body:**
```json
{
  "shopName": "Mama Chantal's Shop"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS reminder sent successfully."
}
```

**SMS Message Format:**
```
Hello [Customer Name], kindly pay your balance of [Amount] RWF at [Shop Name].
```

## Implementation Details

### Current Status
- ✅ Service and Controller implemented
- ✅ DTO validation enabled
- ✅ Error handling with proper HTTP exceptions
- ⚠️ Using **Mock Providers** (not connected to real database yet)

### Mock Providers
The module currently uses mock implementations for:
- `SMS_GATEWAY` - Logs SMS to console instead of sending
- `DEBT_REPOSITORY` - In-memory mock data
- `CUSTOMER_REPOSITORY` - In-memory mock data

### Next Steps
To make this production-ready:
1. Install TypeORM and PostgreSQL driver
2. Create Entity classes for `Customer` and `DebtLedger`
3. Replace mock providers with real TypeORM repositories
4. Integrate with a real SMS gateway (e.g., Twilio, Africa's Talking)

## Testing

### Test Create Debt Record
```bash
curl -X POST http://localhost:3001/client-management/debt \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "test-customer-id",
    "saleId": "test-sale-id",
    "amountDue": 5000,
    "dueDate": "2025-12-01T00:00:00Z"
  }'
```

### Test Send SMS Reminder
```bash
curl -X POST http://localhost:3001/client-management/remind/test-customer-id \
  -H "Content-Type: application/json" \
  -d '{
    "shopName": "Test Shop"
  }'
```

## Error Handling

The service uses proper NestJS exceptions:
- `NotFoundException` (404) - When customer is not found
- `BadRequestException` (400) - When validation fails on DTOs

## Validation

All DTOs use `class-validator` decorators:
- `@IsString()` - Ensures field is a string
- `@IsNumber()` - Ensures field is a number
- `@IsNotEmpty()` - Field cannot be empty
- `@IsOptional()` - Field is optional
- `@IsDateString()` - Validates ISO date format
