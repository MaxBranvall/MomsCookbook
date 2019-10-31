export class Tip {
    constructor(
        public RecipeID: number,
        public LocalTipID: number,
        public Content: string,
        // optional parameters
        public SubTipID?: number
    ) { }
}