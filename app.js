const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path"); // for ejs
const listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

const mongo_url = 'mongodb://127.0.0.1:27017/wenderlust';

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });

async function main() {
    await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
    res.send("Hello Airbnb");
});

// Index Route
app.get("/listing", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Error fetching listings");
    }
});
 
//new route
app.get("/listing/new", (req, res) => {
    res.render("listings/new");
});
 

// Show Route
app.get("/listing/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const singleListing = await Listing.findById(id);
        res.render("listings/show", { listing: singleListing });
    } catch (err) {
        res.status(500).send("Error fetching listing by ID");
        console.error(err);
    }
});

//create route

app.post("/listing", async (req, res) => {
    try {
        const { listing } = req.body;
        console.log("New Listing Submitted:", listing); // ✅ should now print correct data

        const newListing = new Listing(listing);
        await newListing.save();

        res.redirect("/listing");
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).send("Failed to create listing");
    }
});

//edit route

app.get("/listing/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });

});

//update rout 

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
});

//delete route

app.delete("/listings/:id/", async (req,res) =>{
    let { id } = req.params;
    let deleteListing = await listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listing"); 
})



// Sample Route for testing data insert
// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample listing saved");
//     res.send("Sample listing saved successfully");
// });

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
