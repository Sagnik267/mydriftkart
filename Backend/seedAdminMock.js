const mongoose = require('mongoose');
const User = require('./models/User');
const Shop = require('./models/Shop');
const Order = require('./models/Order');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/nearkart');
  
  const shopkeeper = await User.findOne({role: 'shopkeeper'}) || await User.create({name: 'Mock Shopkeeper', email: 'mockshop@test.com', password: '123', role: 'shopkeeper'});
  
  const shop = await Shop.create({
    user: shopkeeper._id,
    name: 'Premium Electronics Hub',
    category: 'Electronics',
    status: 'active'
  });

  const agent = await User.create({
    name: 'Speedy Delivery Guy',
    email: `agent${Date.now()}@test.com`,
    password: '123',
    role: 'agent',
    agentStatus: 'online',
    agentDetails: { vehicleType: 'Bike', area: 'Downtown', totalDeliveries: 45, rating: 4.8 }
  });

  const user = await User.create({
    name: 'John Customer',
    email: `cust${Date.now()}@test.com`,
    password: '123',
    role: 'user'
  });

  const statuses = ['pending', 'confirmed', 'picked_up', 'on_the_way', 'delivered', 'cancelled'];
  
  for(let i=0; i<15; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 20);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    await Order.create({
      user: user._id,
      items: [],
      totalAmount: Math.floor(Math.random() * 500) + 20,
      deliveryAgent: i % 2 === 0 ? agent._id : null,
      shippingAddress: { street: '123 Lane', city: 'City', state: 'State', pincode: '12345' },
      status: randomStatus,
      paymentMethod: 'card',
      isPaid: randomStatus === 'delivered',
      createdAt: date
    });
  }

  console.log("Mock data seeded successfully");
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
