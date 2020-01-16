export class Step {
    constructor(
        public RecipeID: number,
        public LocalStepID: number,
        public Contents: string,
        // optional parameters
        public SubStepID?: number,
    ) { }
}