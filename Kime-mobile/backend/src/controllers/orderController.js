import mongoose from 'mongoose';
import Order from '../models/order.js';
import Inventory from '../models/inventory.js';
import Menu from '../models/menu.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders); 
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders.', error });
  }
};

export const createOrder = async (req, res) => {
  const order = req.body;

  if (!order || !order.order_items || order.order_items.length === 0) {
    return res.status(400).json({ message: 'The order is empty or does not contain items.' });
  }
 
  const newOrder = new Order(order);
  newOrder.order_status = 'CREATED';
  newOrder.kiosks_id = '677dadb3ece28b2edceccb42';
  try {
    await newOrder.save();
    const orderItems = newOrder.order_items;

    for (const orderItem of orderItems) {
      // Buscamos la receta de la bebida en la colección Menu
      const menuDB = await Menu.findOne({ name: orderItem.product_name });
      if (!menuDB) {
        console.warn(`Recipe not found for: ${orderItem.product_name}`);
        continue;
      }

      
      // Recorremos cada ingrediente de la receta
      for (const recipeIngredient of menuDB.recipe) {
        if (recipeIngredient.name !== 'ice') {
          // Buscamos el inventario del ingrediente de la receta
          const inventoryIngredient = await Inventory.findOne({ name: recipeIngredient.name });
          if (!inventoryIngredient) {
            console.warn(`Stock not found for: ${recipeIngredient.name}`);
            continue;
          }
          
          // Calculamos el decremento según la cantidad pedida y la cantidad requerida en la receta
          const decrement = Number(orderItem.order_quantity) * Number(recipeIngredient.quantity);
          const newQuantity = Number(inventoryIngredient.quantity_available) - decrement;
          
          
          // Actualizamos el inventario para el ingrediente
          await Inventory.updateOne(
            { name: recipeIngredient.name },
            {
              quantity_available: newQuantity,
              last_updated_by: "createOrder"
            }
          );

          // Actualizamos la cantidad disponible en el menú
          await Menu.updateOne(
            { name: menuDB.name },
            {
              quantity_available: menuDB.quantity_available - orderItem.order_quantity,
            }
          );
        }
      }
    }
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(409).json({ message: 'Error creating the order.', error });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const  order_status  = req.body.order_status;

  if (!order_status) {
    return res.status(400).json({ message: 'The order status is required.' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { order_status }, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(404).json({ message: 'Error updating the order status.', error });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  // Validar si el ID es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID format.' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving the order.', error });
  }
};