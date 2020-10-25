export class Ingredient {
    constructor(
        public RecipeID: number,
        public LocalIngredientID: number,
        public Contents: string,
        public Quantity: number,
        public Unit: string
    ) { }
}
