const { Client } = require('pg');

async function debugDashboard() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'smart_curuza',
    password: '1',
    port: 5432,
  });

  try {
    await client.connect();
    const merchantId = '31fa5426-89c4-4c61-bce4-8c9d3596461c';
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`--- Debugging Dashboard for Merchant: ${merchantId} ---`);
    console.log(`--- Date: ${today} ---`);

    // 1. Get raw sales for today (Kigali boundaries)
    const kigaliNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const endDate = kigaliNow.toISOString().split('T')[0];
    const startDate = endDate;

    const start = new Date(startDate);
    start.setHours(start.getHours() - 2);
    const end = new Date(endDate);
    end.setHours(23 - 2, 59, 59, 999);

    const salesRes = await client.query(`
      SELECT id, total, user_id, created_at 
      FROM sales 
      WHERE merchant_id = $1 
      AND created_at BETWEEN $2 AND $3
      ORDER BY created_at DESC
    `, [merchantId, start, end]);

    console.log(`Total sales found in DB for today (Kigali): ${salesRes.rowCount}`);
    let totalRevenue = 0;
    salesRes.rows.forEach(s => {
      console.log(`  Sale ${s.id}: ${s.total} (User: ${s.user_id}) at ${s.created_at.toISOString()}`);
      totalRevenue += Number(s.total);
    });
    console.log(`Total Revenue calculated raw: ${totalRevenue}`);

    // 2. Mock getSalesReport logic
    const dailyStats = new Map();
    salesRes.rows.forEach(sale => {
      const kigaliTime = new Date(sale.created_at.getTime() + 2 * 60 * 60 * 1000);
      const dateKey = kigaliTime.toISOString().split('T')[0];
      const current = dailyStats.get(dateKey) || { revenue: 0, count: 0 };
      dailyStats.set(dateKey, {
        revenue: current.revenue + Number(sale.total),
        count: current.count + 1
      });
    });

    console.log('--- Aggregated Stats (Daily) ---');
    console.log(Array.from(dailyStats.entries()));

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

debugDashboard();
