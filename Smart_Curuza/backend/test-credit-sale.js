async function testCreditSale() {
    try {
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'kalisa@smartcuruza.com',
                password: 'password123',
            }),
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const { access_token, user } = await loginRes.json();
        console.log('Login successful. Token obtained.');

        // 1. Get a customer
        console.log('Fetching customers...');
        const customersRes = await fetch('http://localhost:3001/client-management/customers', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const customers = await customersRes.json();
        if (customers.length === 0) throw new Error('No customers found');
        const customer = customers[0];
        console.log(`Using customer: ${customer.name} (${customer.id})`);

        // 2. Get a product
        console.log('Fetching products...');
        const productsRes = await fetch('http://localhost:3001/products', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const products = await productsRes.json();
        if (products.length === 0) throw new Error('No products found');
        const product = products[0];
        console.log(`Using product: ${product.name} (${product.id})`);

        // 3. Create Credit Sale
        console.log('Creating Credit Sale...');
        const saleData = {
            items: [{
                id: product.id,
                name: product.name,
                quantity: 1,
                price: Number(product.price),
                total: Number(product.price)
            }],
            total: Number(product.price),
            paymentMethod: 'Credit',
            customerId: customer.id,
            merchantId: user.merchantId,
            userId: user.id
        };

        const saleRes = await fetch('http://localhost:3001/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify(saleData),
        });

        if (!saleRes.ok) {
            const err = await saleRes.text();
            throw new Error(`Sale failed: ${saleRes.status} ${err}`);
        }

        const sale = await saleRes.json();
        console.log('Sale created successfully:', sale.id);

        // 4. Verify Debt
        console.log('Verifying Debt...');
        const updatedCustomerRes = await fetch('http://localhost:3001/client-management/customers', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const updatedCustomers = await updatedCustomerRes.json();
        const updatedCustomer = updatedCustomers.find(c => c.id === customer.id);
        console.log(`Customer Debt: ${updatedCustomer.total_debt}`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testCreditSale();
