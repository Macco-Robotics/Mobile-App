import Drink from "../models/drink.js";
import Ingredient from "../models/ingredient.js";
import User from "../models/user.js";

void Ingredient;

export const getAllPublishedDrinks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.log("req.user no está definido");
      return res.status(401).json({ message: 'No autorizado: usuario no autenticado' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId).select('likedDrinks savedDrinks');

    if (!user) {
      console.log("Usuario no encontrado:", userId);
      return res.status(404).json({ message: 'User not found' });
    }

    const drinks = await Drink.find({ isPublic: true })
      .populate('ingredients.ingredient')
      .populate('creator', 'name surname');

    const enrichedDrinks = drinks.map(drink => {
      const isLiked = user.likedDrinks?.some(id => id.toString() === drink._id.toString()) || false;
      const isSaved = user.savedDrinks?.some(id => id.toString() === drink._id.toString()) || false;

      return {
        ...drink.toObject(),
        isLiked,
        isSaved
      };
    });

    res.status(200).json(enrichedDrinks);
  } catch (error) {
    console.error('Error en getAllPublishedDrinks:', error);
    res.status(500).json({ message: 'Error while retrieving drinks', error });
  }
};



export const getDrinkById = async (req, res) => {
    const drinkId = req.params.id;
    const userId = req.user.id;

    try {
        const drink = await Drink.findById(drinkId)
            .populate('ingredients.ingredient')
            .populate('creator', 'name surname');

        if (!drink) {
            return res.status(404).json({ message: 'Drink not found' });
        }

        if (!drink.isPublic && drink.creator.toString() !== userId) {
            return res.status(403).json({ message: "You don't have privileges to see this drink." });
        }

        res.status(200).json(drink);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while retrieving drink with id: ', drinkId });
    }
};

export const createDrink = async (req, res) => {
    const { name, description, ingredients, type, isPublic } = req.body;
    const creator = req.user.id;

    try {
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
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.createdDrinks.push(newDrink._id);
        await user.save();

        const populatedDrink = await Drink.findById(newDrink._id)
            .populate('ingredients.ingredient')
            .populate('creator', 'name surname');

        res.status(201).json(populatedDrink);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating the drink.', error });
    }
};

export const getCreatedDrinksByCurrentUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const drinks = await Drink.find({ creator: userId })
            .populate('ingredients.ingredient');
        return res.status(200).json(drinks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error while retrieving user created drinks' });
    }
};

export const getUserSavedDrinks = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const drinks = await Drink.find({ _id: { $in: user.savedDrinks } })
            .populate('ingredients.ingredient');

        res.status(200).json(drinks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error while retrieving user saved drinks' });
    }
};

export const toggleLikeDrink = async (req, res) => {
    const userId = req.user.id;
    const drinkId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const drink = await Drink.findById(drinkId);
        if (!drink) return res.status(404).json({ message: 'Drink not found' });
        if (!drink.isPublic) return res.status(400).json({ message: 'Drink is not public' });

        if (!user.likedDrinks.includes(drinkId)) {
            user.likedDrinks.push(drinkId);
            drink.likes += 1;
            await user.save();
            await drink.save();
            return res.status(200).json({ message: 'Drink liked successfully' });
        } else {
            user.likedDrinks = user.likedDrinks.filter(id => id.toString() !== drinkId);
            drink.likes = Math.max(0, drink.likes - 1);
            await user.save();
            await drink.save();
            return res.status(200).json({ message: "Like removed" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};

export const updateDrink = async (req, res) => {
    const drinkId = req.params.id;
    const userId = req.user.id;

    try {
        const drink = await Drink.findById(drinkId);
        if (!drink) return res.status(404).json({ message: 'Drink not found' });

        if (drink.creator.toString() !== userId) {
            return res.status(403).json({ message: "This drink doesn't belong to you." });
        }

        const { name, description, type, ingredientsIds, isPublic } = { ...req.body };
        const updatedDrink = await Drink.findByIdAndUpdate(
            drinkId,
            { name, description, type, ingredientsIds, isPublic },
            { runValidators: true, new: true }
        );

        return res.status(200).json(updatedDrink);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error while updating drink' });
    }
};

export const toggleSaveDrink = async (req, res) => {
    const drinkId = req.params.id;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const drink = await Drink.findById(drinkId);
        if (!drink) return res.status(404).json({ message: 'Drink not found' });
        if (!drink.isPublic) return res.status(400).json({ message: 'Drink is not public' });

        if (!user.savedDrinks.includes(drinkId)) {
            user.savedDrinks.push(drinkId);
            await user.save();
            return res.status(200).json({ message: 'Drink saved!' });
        } else {
            user.savedDrinks = user.savedDrinks.filter(id => id.toString() !== drinkId);
            await user.save();
            return res.status(200).json({ message: 'Drink unsaved!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while saving the drink: ', error });
    }
};

export const removeCreatedDrink = async (req, res) => {
    const drinkId = req.params.id;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const drink = await Drink.findById(drinkId);

        if (!drink) return res.status(404).json({ message: 'Drink not found' });
        if (drink.creator.toString() !== userId.toString())
            return res.status(403).json({ message: "This drink doesn't belong to you" });
        if (drink.isPublic)
            return res.status(400).json({ message: "You can't remove a public drink" });

        await Drink.findByIdAndDelete(drinkId);
        return res.status(200).json({ message: 'Drink successfully removed!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while deleting the drink: ', error });
    }
};
