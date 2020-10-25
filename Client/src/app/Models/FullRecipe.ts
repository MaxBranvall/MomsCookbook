import { Ingredient } from '../Entities/Ingredient';
import { Step } from '../Entities/Step';
import { Tip } from '../Entities/Tip';
import { AdditionalPhotos } from '../Entities/AdditionalPhotos';

export class FullRecipe {

    constructor(
        public RecipeID: number,
        public Name: string,
        public ImagePath: string,
        public Description: string,
        public Category: string,
        public PrepTimeH: number,
        public PrepTimeM: number,
        public CookTimeH: number,
        public CookTimeM: number,
        public Ingredients: Ingredient[],
        public Steps: Step[],
        public SubSteps: Step[],
        public Tips: Tip[],
        public SubTips: Tip[],
        public f: File[],
        // optional parameters
        public ExtraPhotos?: AdditionalPhotos[],
        public PrepTime?: string,
        public CookTime?: string,
        public Created?: number,
        public LastModified?: number,
        public ImageLoaded?: boolean
    ) { }
}
