export class Step {
    constructor(
        public RecipeID: number,
        public LocalStepID: number,
        public Content: string,
        // optional parameters
        public SubStepID?: number,
    ) { }
}