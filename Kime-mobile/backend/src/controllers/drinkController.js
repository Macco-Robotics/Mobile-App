import Drink from "../models/drink.js";
import Ingredient from "../models/ingredient.js";
import User from "../models/user.js";

// This line is for preventing VSCode to delete unused Ingredient import
void Ingredient;

export const getAllPublishedDrinks = async (req, res) => {
    try {
        const drinks = await Drink.find({isPublic: true})
        .populate('ingredientIds')
        .populate('creator', 'name surname');
        res.status(200).json(drinks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while retrieving drinks'});
    }
}

export const getDrinkById = async (req, res) => {
    const drinkId  = req.params.id;
    const userId = req.user.id;

    try {
        console.log(drinkId)
        const drink = await Drink.findById(drinkId)
        .populate('ingredientIds')
        .populate('creator', 'name surname');

        if (!drink) {
            return res.status(404).json({message: 'Drink not found'});
        }

        if(!drink.isPublic && drink.creator.toString() !== userId){
            return res.status(403).json({message: "You don't have priviledges to see this drink."})
        }

        res.status(200).json(drink);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while retrieving drink with id: ',drinkId});
    }
}

export const createDrink = async (req, res) => {
    const { name, description, ingredients, type, creator, isPublic } = req.body;

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
            isPublic,
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