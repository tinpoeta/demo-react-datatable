export class Category {
    public _id: string;
    public name: string;
    public slug: string;
    constructor(_id: string, name: string, slug: string) {
        this._id = _id;
        this.name = name;
        this.slug = slug;
    }
}
