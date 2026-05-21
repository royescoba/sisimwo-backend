// Run once to seed the database:  node seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product  = require("./models/Product");

const products = [
  { id:1, name:"Sisimwo Signature",    category:"coffee",    price:2400, unit:"kg",        desc:"Bright citrus notes • Dark chocolate finish • Silky mouthfeel",                              img:"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=520&fit=crop" },
  { id:2, name:"Peaberry Reserve",     category:"coffee",    price:2950, unit:"kg",        desc:"Sweet berry • Full body • Limited small-batch harvest",                                       img:"https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&h=520&fit=crop" },
  { id:3, name:"Organic Forest Blend", category:"coffee",    price:2700, unit:"kg",        desc:"Floral • Honey • Shade-grown under Mt. Elgon canopy",                                        img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=520&fit=crop" },
  { id:4, name:"Strained Yoghurt",     category:"livestock", price:850,  unit:"500g",      desc:"Pure farm-fresh greek yoghurt made from our Jersey cows, traditionally strained",            img:"https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=800&h=520&fit=crop" },
  { id:5, name:"Free Range Eggs",      category:"livestock", price:450,  unit:"tray (30)", desc:"Nutritious eggs from pasture-raised chickens on open land",                                  img:"https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&h=520&fit=crop" },
  { id:6, name:"Traditional Mursik",   category:"livestock", price:300,  unit:"1l",        desc:"Experience Kenya's most iconic warrior drink: rich, creamy and naturally fermented",         img:"https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&h=520&fit=crop" },
  { id:7, name:"Raw Forest Honey",     category:"produce",   price:650,  unit:"500g",      desc:"Pure wild honey harvested from the forests of Mt. Elgon",                                    img:"https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=520&fit=crop" },
  { id:8, name:"Hass Avocado",         category:"produce",   price:180,  unit:"kg",        desc:"Creamy, nutrient-dense Hass avocados harvested in-season",                                   img:"https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=520&fit=crop" },
  { id:9, name:"Sweet Bananas",        category:"produce",   price:250,  unit:"kg",        desc:"Exceptionally fragrant, naturally ripened mountain bananas",                                  img:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=520&fit=crop" },
];

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  });
