
export class Recipe {

    constructor(
        public ID: number,
        public Name: string,
        public ImagePath: string,
        public Description: string,
        public Category: string,
        public PrepTime: string,
        public CookTime: string,
        public Created: number,
        public LastModified: number
    ) { }

}