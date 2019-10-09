export class Tip {
    constructor(
        public RecipeID: number,
        public LocalTipID: number,
        public Content: string,
        public SubTips: Tip[],
    ) { }
}