export class Tip {
    constructor(
        public RecipeID: number,
        public LocalTipID: number,
        public Content: string,
        // optional parameters
        public SubTips?: Tip[],
        public SubTipID?: number
    ) { }
}