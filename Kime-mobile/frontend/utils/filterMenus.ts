type MenuItem = {
  _id: string;
  display_name: string;
  description: string;
  price_value: number;
  price_currency: string;
  type: string;
  recipe: { name: string; quantity: number; unit?: string }[];
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
  selectedType: string,
  selectedIngredient: string
): MenuItem[] => {
  let filtered = menuItems;

  // Filtrar por texto de búsqueda
  if (searchText) {
    filtered = filtered.filter((item) =>
      item.display_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // Filtrar por tipo de bebida (si se seleccionó alguno)
  if (selectedType && selectedType !== "") {
    filtered = filtered.filter((item) => item.type === selectedType);
  }

  // Filtrar por ingrediente (si se seleccionó alguno)
  if (selectedIngredient && selectedIngredient !== "") {
    filtered = filtered.filter((item) =>
      item.recipe.some(
        (ingredient) =>
          ingredient.name.trim().toLowerCase() === selectedIngredient.trim().toLowerCase()
      )
    );
  }

  return filtered;
};
