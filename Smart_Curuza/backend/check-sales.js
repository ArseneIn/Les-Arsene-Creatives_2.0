const { Client } = require('pg');

async function checkSales() {
  const client = new Client({
    connectionString: "postgresql://postgres:1@localhost:5432/smart_curuza",
  });

  await client.connect();

  try {
    console.log('--- Sales Overview ---');
    const res = await client.query(`
      SELECT 
        s.id, 
        s.merchant_id, 
        s.user_id, 
        u.name as user_name, 
        u.role as user_role,
        s.total,
        s.status,
        jsonb_array_length(s.items) as items_count,
        s.created_at
      FROM sales s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
      LIMIT 10;
    `);
    console.table(res.rows);

    console.log('\n--- Merchants ---');
    const merchants = await client.query('SELECT id, business_name FROM merchants;');
    console.table(merchants.rows);

    console.log('\n--- Users ---');
    const users = await client.query('SELECT id, name, role, "merchantId" FROM users;');
    console.table(users.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

checkSales();
