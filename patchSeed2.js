const fs = require('fs');

const dataMap = {
  "Apple - Royal Gala": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
  "Banana - Robusta": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Chocolate-Chip-Cookies-%284723700ida6%29.jpg",
  "Onion": "https://upload.wikimedia.org/wikipedia/commons/2/28/Onions.jpg",
  "Potato": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg",
  "Tomato - Local": "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
  
  "Amul Taaza Milk": "https://upload.wikimedia.org/wikipedia/commons/0/04/Amul-Milk-Packet.jpg",
  "Amul Butter": "https://upload.wikimedia.org/wikipedia/commons/3/31/Amul_butter.jpg",
  "Farm Fresh Eggs": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
  "Amul Cheese Slices": "https://upload.wikimedia.org/wikipedia/commons/0/04/Amul-Milk-Packet.jpg",
  "Nestlé Milkmaid": "https://upload.wikimedia.org/wikipedia/commons/0/04/Amul-Milk-Packet.jpg",

  "Haldiram's Bhujia Sev": "https://upload.wikimedia.org/wikipedia/commons/0/04/Haldirams_bhujia.jpg",
  "Lay's Classic Salted": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Campofr%C3%ADo_chips.jpg/800px-Campofr%C3%ADo_chips.jpg",
  "Kurkure Masala Munch": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80",
  "Bikano Aloo Bhujia": "https://upload.wikimedia.org/wikipedia/commons/0/04/Haldirams_bhujia.jpg",
  "Parle-G Gold": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Parle-g-biscuit.jpg",
  "Britannia Good Day": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Parle-g-biscuit.jpg",

  "Coca Cola": "https://upload.wikimedia.org/wikipedia/commons/1/1a/24701-nature-beauty-Coca-cola.jpg",
  "Red Bull Energy Drink": "https://upload.wikimedia.org/wikipedia/commons/a/a1/24701-nature-beauty-red-bull.jpg",
  "Tata Tea Gold": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Nescafé Classic": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Frooti": "https://upload.wikimedia.org/wikipedia/commons/1/1a/24701-nature-beauty-Coca-cola.jpg",

  "Britannia White Bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "Modern Brown Bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "Britannia Pav": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "English Oven Burger Buns": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",

  "Colgate MaxFresh": "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=80",
  "Dettol Liquid Handwash": "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=80",
  "Dove Cream Beauty Bathing Bar": "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=80",
  "Head & Shoulders": "https://images.unsplash.com/photo-1585232352617-f6f6e0e89b95?w=400&q=80",
  "Gillette Mach3": "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=80",

  "Surf Excel Easy Wash": "https://upload.wikimedia.org/wikipedia/commons/4/47/Surf_Excel.jpg",
  "Vim Lemon Dishwash": "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80",
  "Lizol Disinfectant": "https://upload.wikimedia.org/wikipedia/commons/4/47/Surf_Excel.jpg",
  "Harpic Power Plus": "https://upload.wikimedia.org/wikipedia/commons/4/47/Surf_Excel.jpg",
  "Odonil Room Freshener": "https://upload.wikimedia.org/wikipedia/commons/4/47/Surf_Excel.jpg",

  "McCain French Fries": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80",
  "Amul Vanilla Ice Cream": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80",
  "Safal Frozen Peas": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80",
  "ITC Master Chef Nuggets": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80",
  "Godrej Yummiez Sausage": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80"
};

let content = fs.readFileSync('Backend/seedData.js', 'utf8');

// Replace standard format `{ name: "Apple - Royal Gala", ..., imageUrl: "https://www.bigbasket.com/...", inStock: true }`
content = content.replace(/name:\s*"([^"]+)"([\s\S]*?)imageUrl:\s*"[^"]+"/g, (match, p1, p2) => {
    const defaultUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";
    const mapped = dataMap[p1] || defaultUrl;
    return `name: "${p1}"${p2}imageUrl: "${mapped}"`;
});

fs.writeFileSync('Backend/seedData.js', content, 'utf8');
console.log('Seed data successfully patched with new public, hotlink-friendly URLs!');
