export class ListEntry {
    constructor(
        public RecipeID: number,
        public ImagePath: string,
        public Name: string,
        public PrepTimeH: number,
        public PrepTimeM: number,
        public CookTimeH: number,
        public CookTimeM: number
    ) { }
}