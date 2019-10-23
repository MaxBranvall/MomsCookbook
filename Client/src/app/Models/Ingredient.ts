export class Ingredient {
    constructor(
        public RecipeID: number,
        public LocalIngredientID: number,
        public Content: string,
        public Quantity: number,
        public Unit: string
    )
    { }
}