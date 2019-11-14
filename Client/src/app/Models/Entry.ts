import { Ingredient } from './Ingredient';
import { Step } from './Step';
import { Tip } from './Tip';
import { Photo } from './Photo';

export class Entry {

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
        public AdditionalPhotos?: Photo[],
        public PrepTime?: string,
        public CookTime?: string,
        public Created?: number,
        public LastModified?: number,
    ) { }
}