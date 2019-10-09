export class Ingredient {
    constructor(
        public RecipeID: number,
        public LocalIngredientID: number,
        public Name: string,
        public Quantity: number,
        public Unit: string
    )
    { }
}