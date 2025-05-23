import Drink from "../models/drink.js";
import User from "../models/user.js";

export const createDrink = async (req, res) => {
    const { name, description, ingredients, type, creator } = req.body;

    try {
        // Assign a default image depending on the type of the drink
        const imageByType = {
            "Cóctel": "http://localhost:3000/images/cocktail.png",
            "Smoothie": "http://localhost:3000/images/smoothie.png",
            "Infusión": "http://localhost:3000/images/infusion.png",
            "Zumo": "http://localhost:3000/images/juice.png",
            "Bebida energética": "http://localhost:3000/images/energy.png",
            "Refresco": "http://localhost:3000/images/soda.jpg"
        };

        const image = imageByType[type];

        const newDrink = new Drink({
            name,
            description,
            ingredients,
            type,
            creator,
            image
        });

        await newDrink.save();

        const user = await User.findById(creator);
        if(!user) return res.status(404).json({message: 'User not found'});

        user.createdDrinks.push(newDrink._id);
        await user.save();

        res.status(201).json(newDrink);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating the drink.', error });
    }
}