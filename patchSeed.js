const fs = require('fs');
let content = fs.readFileSync('Backend/seedData.js', 'utf8');

content = content.replace(/imageUrl: "https:\/\/placehold.co\/200x200\?text=([^"]+)"/g, (match, p1) => {
    // Map of text to CDN
    const map = {
        'Apple': 'https://www.bigbasket.com/media/uploads/p/l/10000005_27-fresho-apple-royal-gala-regular.jpg',
        'Banana': 'https://www.bigbasket.com/media/uploads/p/l/10000031_21-fresho-banana-robusta.jpg',
        'Onion': 'https://www.bigbasket.com/media/uploads/p/l/10000148_30-fresho-onion.jpg',
        'Potato': 'https://www.bigbasket.com/media/uploads/p/l/10000159_27-fresho-potato.jpg',
        'Tomato': 'https://www.bigbasket.com/media/uploads/p/l/10000200_17-fresho-tomato-hybrid.jpg',
        'Milk': 'https://www.bigbasket.com/media/uploads/p/l/1207046_2-amul-taaza-homogenised-toned-milk.jpg',
        'Butter': 'https://www.bigbasket.com/media/uploads/p/l/10000051_9-amul-butter.jpg',
        'Eggs': 'https://www.bigbasket.com/media/uploads/p/l/1203477_2-fresho-farm-eggs-regular-medium-antibiotic-residue-free.jpg',
        'Cheese': 'https://www.bigbasket.com/media/uploads/p/l/104808_9-amul-cheese-slices.jpg',
        'Milkmaid': 'https://www.bigbasket.com/media/uploads/p/l/10003666_12-nestle-milkmaid-sweetened-condensed-milk.jpg',
        'Bhujia': 'https://www.bigbasket.com/media/uploads/p/l/1212711_1-haldirams-namkeen-bhujia-sev.jpg',
        'Lays': 'https://www.bigbasket.com/media/uploads/p/l/293673_16-lays-potato-chips-classic-salted.jpg',
        'Kurkure': 'https://www.bigbasket.com/media/uploads/p/l/269152_14-kurkure-namkeen-masala-munch.jpg',
        'Aloo+Bhujia': 'https://www.bigbasket.com/media/uploads/p/l/40156942_8-bikano-aloo-bhujia.jpg',
        'Parle-G': 'https://www.bigbasket.com/media/uploads/p/l/10001358_18-parle-g-biscuits-original-glucose.jpg',
        'Good+Day': 'https://www.bigbasket.com/media/uploads/p/l/10002041_19-britannia-good-day-cashew-cookies.jpg',
        'Coke': 'https://www.bigbasket.com/media/uploads/p/l/251014_11-coca-cola-diet-coke.jpg',
        'Red+Bull': 'https://www.bigbasket.com/media/uploads/p/l/266014_13-red-bull-energy-drink.jpg',
        'Tea': 'https://www.bigbasket.com/media/uploads/p/l/240061_11-tata-tea-gold-tea.jpg',
        'Nescafe': 'https://www.bigbasket.com/media/uploads/p/l/266934_22-nescafe-classic-instant-coffee.jpg',
        'Frooti': 'https://www.bigbasket.com/media/uploads/p/l/266042_11-frooti-mango-drink.jpg',
        'Bread': 'https://www.bigbasket.com/media/uploads/p/l/40009658_11-britannia-daily-fresh-milk-bread.jpg',
        'Brown+Bread': 'https://www.bigbasket.com/media/uploads/p/l/1206132_3-modern-bread-100-whole-wheat-slice.jpg',
        'Pav': 'https://www.bigbasket.com/media/uploads/p/l/40228784_2-britannia-pav.jpg',
        'Burger+Buns': 'https://www.bigbasket.com/media/uploads/p/l/40009656_5-britannia-burger-buns.jpg',
        'Colgate': 'https://www.bigbasket.com/media/uploads/p/l/40016027_10-colgate-maxfresh-spicy-fresh-red-gel-toothpaste-with-cooling-crystals.jpg',
        'Handwash': 'https://www.bigbasket.com/media/uploads/p/l/40131454_6-dettol-liquid-handwash-refill-skincare.jpg',
        'Dove': 'https://www.bigbasket.com/media/uploads/p/l/1205934_6-dove-cream-beauty-bathing-bar.jpg',
        'Shampoo': 'https://www.bigbasket.com/media/uploads/p/l/20000085_9-head-shoulders-anti-dandruff-shampoo-cool-menthol.jpg',
        'Razor': 'https://www.bigbasket.com/media/uploads/p/l/10006248_10-gillette-mach3-shaving-razor.jpg',
        'Detergent': 'https://www.bigbasket.com/media/uploads/p/l/266946_20-surf-excel-easy-wash-detergent-powder.jpg',
        'Vim': 'https://www.bigbasket.com/media/uploads/p/l/266998_21-vim-dishwash-bar-lemon.jpg',
        'Lizol': 'https://www.bigbasket.com/media/uploads/p/l/214436_11-lizol-disinfectant-surface-floor-cleaner-liquid-citrus-kills-999-germs.jpg',
        'Harpic': 'https://www.bigbasket.com/media/uploads/p/l/212621_12-harpic-power-plus-toilet-cleaner-original.jpg',
        'Odonil': 'https://www.bigbasket.com/media/uploads/p/l/40120150_4-odonil-room-freshener-block-jasmine.jpg',
        'Fries': 'https://www.bigbasket.com/media/uploads/p/l/10001150_16-mccain-french-fries.jpg',
        'Ice+Cream': 'https://www.bigbasket.com/media/uploads/p/l/40006935_10-amul-ice-cream-vanilla-magic.jpg',
        'Peas': 'https://www.bigbasket.com/media/uploads/p/l/10000216_13-safal-frozen-green-peas.jpg',
        'Nuggets': 'https://www.bigbasket.com/media/uploads/p/l/40201103_2-godrej-yummiez-chicken-nuggets.jpg',
        'Sausage': 'https://www.bigbasket.com/media/uploads/p/l/40201131_3-godrej-yummiez-chicken-sausage.jpg'
    };
    return 'imageUrl: "' + (map[p1] || `https://placehold.co/200x200?text=${p1}`) + '", inStock: true';
});

fs.writeFileSync('Backend/seedData.js', content, 'utf8');
console.log('Seed data patched with new images and inStock flag.');
