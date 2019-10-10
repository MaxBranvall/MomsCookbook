export class Step {
    constructor(
        public RecipeID: number,
        public LocalStepID: number,
        public Content: string,
        public SubSteps?: Step[],
        public SubStepID?: number,
    ) { }
}