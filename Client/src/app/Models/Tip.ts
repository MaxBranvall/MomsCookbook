export class Tip {
    constructor(
        public RecipeID: number,
        public LocalTipID: number,
        public Contents: string,
        // optional parameters
        public SubTipID?: number
    ) { }
}