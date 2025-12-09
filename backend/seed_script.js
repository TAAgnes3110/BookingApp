const { faker } = require('@faker-js/faker');
const fs = require('fs');

// Set locale to Vietnam for realistic data
faker.locale = 'vi';

const generateData = () => {
    const users = [];
    const services = [];
    const transactions = [];
    const reviews = [];

    // 1. Generate Users (50 users)
    console.log('Generating Users (Vietnamese)...');
    for (let i = 1; i <= 50; i++) {
        users.push({
            id: i,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(), // Simulate cloud URL (e.g., Cloudinary/S3)
            phone: faker.phone.number('09########'),
            role: faker.helpers.arrayElement(['User', 'Merchant', 'Admin']), // Random role
            status: faker.helpers.arrayElement(['Active', 'Active', 'Active', 'Warning', 'Banned']),
            address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
            joined_at: faker.date.past({ years: 1 }).toISOString().split('T')[0]
        });
    }

    // 2. Generate Services (20 services - Hotels/Tours in Vietnam)
    console.log('Generating Services (Vietnamese Locations)...');
    const cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Phú Quốc', 'Đà Lạt', 'Hội An', 'Sapa', 'Vũng Tàu', 'Quy Nhơn'];
    const serviceTypes = ['Hotel', 'Tour', 'Spa'];

    for (let i = 1; i <= 20; i++) {
        const type = faker.helpers.arrayElement(serviceTypes);
        const city = faker.helpers.arrayElement(cities);
        let name = '';

        if (type === 'Hotel') name = `${faker.company.name()} Hotel & Resort ${city}`;
        else if (type === 'Tour') name = `Tour tham quan ${city} ${faker.number.int({min: 1, max: 3})} ngày trọn gói`;
        else name = `${faker.person.lastName()} Spa & Massage Cổ Truyền`;

        services.push({
            id: i + 100, // ID start from 101
            name: name,
            category: type,
            price: parseFloat(faker.commerce.price({ min: 500000, max: 5000000 })),
            location: city,
            rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
            status: faker.helpers.arrayElement(['Available', 'Available', 'Unavailable']),
            image: faker.image.urlLoremFlickr({ category: 'hotel' })
        });
    }

    // 3. Generate Transactions (100 transactions)
    console.log('Generating Transactions (Vietnamese Banks)...');
    const paymentMethods = ['Chuyển khoản Vietcombank', 'Chuyển khoản Techcombank', 'Momo', 'ZaloPay', 'Thẻ nội địa NAPAS', 'Tiền mặt'];

    for (let i = 1; i <= 100; i++) {
        const relatedService = faker.helpers.arrayElement(services);
        const amount = relatedService.price;
        const type = faker.helpers.arrayElement(['Thanh toán', 'Thanh toán', 'Thanh toán', 'Hoàn tiền']);

        transactions.push({
            id: `GD-${faker.string.alphanumeric(8).toUpperCase()}`,
            user_id: faker.number.int({ min: 1, max: 50 }),
            type: type,
            amount: type === 'Thanh toán' ? `+${amount.toLocaleString('vi-VN')} ₫` : `-${(amount * 0.8).toLocaleString('vi-VN')} ₫`,
            status: faker.helpers.arrayElement(['Thành công', 'Thành công', 'Đang xử lý', 'Thất bại']),
            date: faker.date.recent({ days: 60 }).toISOString().replace('T', ' ').substring(0, 16),
            method: faker.helpers.arrayElement(paymentMethods),
            note: `Booking #${faker.string.numeric(4)} - ${relatedService.name}`
        });
    }

    // 4. Generate Reviews (Vietnamese Comments)
    console.log('Generating Reviews...');
    const comments = [
        "Dịch vụ rất tuyệt vời, nhân viên nhiệt tình.",
        "Phòng sạch sẽ, view đẹp, sẽ quay lại.",
        "Giá hơi cao so với chất lượng.",
        "Trải nghiệm tệ, nhân viên thái độ không tốt.",
        "Đồ ăn ngon, không gian thoáng đãng.",
        "Tour đi hơi mệt nhưng vui.",
        "Spa làm rất thư giãn, tay nghề cao.",
        "Khách sạn ngay trung tâm, tiện đi lại.",
        "Thất vọng về cách phục vụ.",
        "Rất đáng tiền, 5 sao!",
        "Tạm ổn, không có gì đặc sắc."
    ];

    for (let i = 1; i <= 50; i++) {
        const relatedService = faker.helpers.arrayElement(services);
        reviews.push({
            id: i,
            user_id: faker.number.int({ min: 1, max: 50 }),
            service_name: relatedService.name,
            rating: faker.number.int({ min: 1, max: 5 }),
            comment: faker.helpers.arrayElement(comments),
            status: faker.helpers.arrayElement(['Đã duyệt', 'Chờ duyệt', 'Spam']),
            date: faker.date.recent({ days: 30 }).toISOString().split('T')[0]
        });
    }

    // Combine data
    const dbData = {
        users,
        services,
        transactions,
        reviews
    };

    // Write to file in database folder
    if (!fs.existsSync('database')){
        fs.mkdirSync('database');
    }
    fs.writeFileSync('database/seed-data.json', JSON.stringify(dbData, null, 2));
    console.log('Successfully generated seed-data.json in database/ folder!');
};

generateData();
