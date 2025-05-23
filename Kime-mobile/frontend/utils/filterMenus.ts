type MenuItem = {
  _id: string;
  display_name: string;
  description: string;
  price_value: number;
  price_currency: string;
  type: string; // Tipo de bebida (ejemplo: "Café", "Té", "Jugo")
  recipe: { name: string; quantity: number; unit?: string }[]; // Lista de ingredientes en la receta
};

/**
 * Filtra los elementos del menú en función de los criterios proporcionados.
 * @param menuItems - Lista completa de elementos del menú.
 * @param searchText - Texto de búsqueda ingresado por el usuario.
 * @param selectedType - Tipo de bebida seleccionado.
 * @param selectedIngredient - Ingrediente seleccionado.
 * @returns Lista filtrada de elementos del menú.
 */
export const filterMenus = (
  menuItems: MenuItem[],
  searchText: string,
  selectedType: string | null,
  selectedIngredient: string | null
): MenuItem[] => {
  // Si no hay filtros seleccionados, devolver todos los elementos
  if (!searchText && !selectedType && !selectedIngredient) {
    return menuItems;
  }

  let filtered = menuItems;

  // Filtrar por texto de búsqueda
  if (searchText) {
    filtered = filtered.filter((item) =>
      item.display_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // Filtrar por tipo de bebida
  if (selectedType) {
    filtered = filtered.filter((item) => item.type === selectedType);
  }

  // Filtrar por ingrediente seleccionado
  if (selectedIngredient) {
    filtered = filtered.filter(
      (item) =>
        item.recipe &&
        item.recipe.some(
          (ingredient) =>
            ingredient.name.trim().toLowerCase() === selectedIngredient.trim().toLowerCase()
        )
    );
  }

  return filtered;
};