export class ListEntry {
    constructor(
        public RecipeID: number,
        public ImagePath: string,
        public Name: string,
        public PrepTime: string,
        public CookTime: string,
        public PrepTimeH: number,
        public PrepTimeM: number,
        public CookTimeH: number,
        public CookTimeM: number,
        public Loaded?: boolean
    ) { }
}
