import { Ingredient } from './Ingredient';
import { Step } from './Step';
import { Tip } from './Tip';

export class Entry {
    constructor(
        public Name: string,
        public ImagePath: string,
        public Description: string,
        public PrepTimeH: number,
        public PrepTimeM: number,
        public CookTimeH: number,
        public CookTimeM: number,
        public Ingredients: Ingredient[],
        public Steps: Step[],
        public Tips: Tip[],
        public AdditionalPhotos?: string[]
    ) { }
}