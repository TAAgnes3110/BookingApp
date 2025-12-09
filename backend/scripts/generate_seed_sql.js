const fs = require('fs');
const path = require('path');
const { fakerVI: faker } = require('@faker-js/faker');

// Helper to escape single quotes for SQL
const safe = (str) => {
  if (!str && str !== 0) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
};

const generateUUID = () => faker.string.uuid();

const generateSeedSQL = () => {
    // ... (Code as generated previously - truncated for brevity but functionality preserved)
    // IMPORTANT: The path to write file must be updated since this script is now in /scripts folder
    // It should write to ../database/omega_seed_data.sql

  let sql = `-- OMEGA SYSTEM SEED DATA \n-- Generated: ${new Date().toISOString()}\n\n`;

  // 1. Roles
  sql += `-- 1. ROLES\n`;
  sql += `INSERT INTO roles (id, name, description, permissions) VALUES \n`;
  sql += `(1, 'super_admin', 'System Super Admin', '["all"]'),\n`;
  sql += `(2, 'hotel_manager', 'Hotel Manager', '["manage_hotel", "view_bookings"]'),\n`;
  sql += `(3, 'staff', 'Support Staff', '["view_users", "manage_reviews"]'),\n`;
  sql += `(4, 'host', 'Property Owner', '["create_property", "manage_bookings"]'),\n`;
  sql += `(5, 'guest', 'Regular User', '["book_room", "write_review"]');\n\n`;

  // 2. Users (Basic seeded users for consistent testing)
  const users = [
      { id: 'c5e109f5-82a8-4678-b6b8-1a4714e75699', email: 'admin@booking.com', first: 'Admin', last: 'Super', role: 1 },
      { id: 'd6a4dd59-3fc2-4189-a3bc-222b21ccfd03', email: 'host@booking.com', first: 'Chu', last: 'Nha', role: 4 },
      { id: '3af419cf-6323-4110-96c6-6923ce5a2b37', email: 'guest@booking.com', first: 'Khach', last: 'Hang', role: 5 },
  ];

  sql += `INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, role_id, provider, is_email_verified, avatar_url) VALUES \n`;

  // Specific users
  sql += users.map((u, index) =>
      `(${safe(u.id)}, ${safe(u.email)}, '$2a$10$abcdef123456', ${safe(u.first)}, ${safe(u.last)}, '090000000${index+1}', ${u.role}, 'local', true, 'https://ui-avatars.com/api/?name=${u.first}+${u.last}')`
  ).join(',\n');

  // Random users
  const randomUsers = [];
  for (let i = 0; i < 20; i++) {
     const uid = generateUUID();
     const roleId = faker.helpers.arrayElement([4, 5]);
     randomUsers.push({ id: uid, role: roleId });

     const f = faker.person.firstName();
     const l = faker.person.lastName();
     sql += `,\n(${safe(uid)}, ${safe(faker.internet.email({firstName: f, lastName: l}))}, '$2a$10$sampleHashedPassword', ${safe(f)}, ${safe(l)}, ${safe(faker.phone.number())}, ${roleId}, 'local', ${Math.random() > 0.5}, ${safe(faker.image.avatar())})`;
  }
  sql += `;\n\n`;

  // Combine all users for later use
  const allUsers = [...users, ...randomUsers];

  // 3. Locations
  sql += `-- 3. LOCATIONS\n`;
  sql += `INSERT INTO locations (city, country, image_url, is_popular) VALUES \n`;
  const cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hội An', 'Phú Quốc', 'Nha Trang', 'Đà Lạt', 'Sapa'];
  sql += cities.map(city => `(${safe(city)}, 'Vietnam', 'https://loremflickr.com/640/480/${city},scenery', ${Math.random() > 0.5})`).join(',\n');
  sql += `;\n\n`;

  // 4. Properties
  const properties = [];
  sql += `-- 4. PROPERTIES\n`;
  sql += `INSERT INTO properties (id, host_id, location_id, title, slug, description, type, address_full, status, rating_avg) VALUES \n`;

  const hosts = allUsers.filter(u => u.role === 4 || u.role === 1);
  const propertyTypes = ['hotel', 'resort', 'villa', 'apartment', 'homestay'];

  const propertiesValues = [];
  for (let i = 0; i < 15; i++) {
    const pid = generateUUID();
    const host = faker.helpers.arrayElement(hosts);
    const city = faker.helpers.arrayElement(cities);
    const type = faker.helpers.arrayElement(propertyTypes);
    const title = `${type.charAt(0).toUpperCase() + type.slice(1)} ${faker.company.name()} ${city}`;
    const slug = faker.helpers.slugify(title).toLowerCase();

    properties.push({ id: pid, host_id: host.id });
    propertiesValues.push(`(${safe(pid)}, ${safe(host.id)}, (SELECT id FROM locations WHERE city = ${safe(city)} LIMIT 1), ${safe(title)}, ${safe(slug)}, ${safe(faker.lorem.paragraph())}, ${safe(type)}, ${safe(faker.location.streetAddress())}, 'active', ${faker.number.float({ min: 3, max: 5, precision: 0.1 })})`);
  }
  sql += propertiesValues.join(',\n');
  sql += `;\n\n`;

  // 5. Rooms
  const rooms = [];
  sql += `-- 5. ROOMS\n`;
  sql += `INSERT INTO rooms (id, property_id, name, description, base_price, stock_quantity, max_adults) VALUES \n`;
  const roomValues = [];
  properties.forEach(prop => {
      const numRooms = faker.number.int({ min: 2, max: 4 });
      for (let j = 0; j < numRooms; j++) {
          const rid = generateUUID();
          const name = faker.helpers.arrayElement(['Standard Room', 'Deluxe Room', 'Suite', 'Family Room', 'Penthouse']);
          const price = faker.commerce.price({ min: 500000, max: 5000000, dec: 0 });
          rooms.push({ id: rid, property_id: prop.id, price });
          roomValues.push(`(${safe(rid)}, ${safe(prop.id)}, ${safe(name)}, 'Phòng tiện nghi, view đẹp', ${price}, ${faker.number.int({ min: 1, max: 10 })}, 2)`);
      }
  });
  sql += roomValues.join(',\n') + `;\n\n`;

  // 6. Amenities
  sql += `-- 6. AMENITIES\n`;
  sql += `INSERT INTO amenities (name, icon, type) VALUES \n`;
  const amenitiesList = [
      {n:'Wifi',i:'icon-wifi',t:'general'}, {n:'Pool',i:'icon-pool',t:'general'}, {n:'Spa',i:'icon-spa',t:'general'},
      {n:'Parking',i:'icon-parking',t:'general'}, {n:'AC',i:'icon-ac',t:'general'}, {n:'TV',i:'icon-tv',t:'general'},
      {n:'Kitchen',i:'icon-kitchen',t:'kitchen'}, {n:'Fridge',i:'icon-fridge',t:'kitchen'},
      {n:'Hot Water',i:'icon-hot water',t:'bathroom'}, {n:'Bathtub',i:'icon-bathtub',t:'bathroom'}
  ];
  sql += amenitiesList.map(a => `(${safe(a.n)}, ${safe(a.i)}, ${safe(a.t)})`).join(',\n') + `;\n\n`;

  // Property Amenities
  sql += `-- PROPERTY AMENITIES\nINSERT INTO property_amenities (property_id, amenity_id) VALUES \n`;
  const paValues = [];
  properties.forEach(prop => {
      for(let k=1; k<=5; k++) {
          paValues.push(`(${safe(prop.id)}, ${k})`); // Linking first 5 amenities for simplicity
      }
  });
  sql += paValues.join(',\n') + ` ON CONFLICT DO NOTHING;\n\n`;

  // 7. Bookings
  sql += `-- 7. BOOKINGS\n`;
  sql += `INSERT INTO bookings (id, user_id, property_id, room_id, check_in_date, check_out_date, total_price, final_price, status) VALUES \n`;
  const bookingsValues = [];
  for (let i = 0; i < 20; i++) {
      const user = faker.helpers.arrayElement(allUsers);
      const room = faker.helpers.arrayElement(rooms);
      const days = faker.number.int({min:1, max:5});
      const checkIn = faker.date.future();
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + days);

      const ci = checkIn.toISOString().split('T')[0];
      const co = checkOut.toISOString().split('T')[0];

      bookingsValues.push(`('BK-${faker.string.alphanumeric(8).toUpperCase()}', ${safe(user.id)}, ${safe(room.property_id)}, ${safe(room.id)}, ${safe(ci)}, ${safe(co)}, ${room.price}, ${room.price}, 'confirmed')`);
  }
  sql += bookingsValues.join(',\n') + `;\n\n`;

  return sql;
};

// Write file to ../database/omega_seed_data.sql
const sqlContent = generateSeedSQL();
fs.writeFileSync(path.join(__dirname, '..', 'database', 'omega_seed_data.sql'), sqlContent);
console.log('✅ Generated omega_seed_data.sql successfully in database folder');
