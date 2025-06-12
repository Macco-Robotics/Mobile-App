export const withRestaurantSlug = async (req, res, next) => {
    const slug = req.headers['x-restaurant-slug'];
    if(!slug) return res.status(400).json({message: 'Restaurant slug is required'});

    req.restaurantSlug = slug;
    next();
}