import { Ingredient } from './Ingredient';
import { Step } from './Step';
import { Tip } from './Tip';
import { Photo } from './Photo';

export class Entry {

    constructor(
        public Name: string,
        public Image: Photo,
        public Description: string,
        public Category: string,
        public PrepTimeH: number,
        public PrepTimeM: number,
        public CookTimeH: number,
        public CookTimeM: number,
        public Ingredients: Ingredient[],
        public Steps: Step[],
        public Tips: Tip[],
        // optional parameters
        public AdditionalPhotos?: Photo[],
        public PrepTime?: string,
        public CookTime?: string,
        public Created?: Date,
        public LastModified?: Date,
    ) { }
}