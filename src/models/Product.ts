import { Category } from "./Category";
import { User } from "./User";

export class Product {
    public _id: string;
    public category: Category;
    public createdAt: Date;
    public createdBy: User;
    public image: string;
    public price: number;
    public slug: string;
    public title: string;
    public updatedAt: Date;
    public description?: string;

    constructor(
        _id: string,
        category: Category,
        createdAt: Date,
        createdBy: User,
        image: string,
        price: number,
        slug: string,
        title: string,
        updatedAt: Date,
        description?: string
    ) {
        this._id = _id;
        this.category = category;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.image = image;
        this.price = price;
        this.slug = slug;
        this.title = title;
        this.updatedAt = updatedAt;
        this.description = description;
    }
}

export const objectToProduct = (object: any): Product => {
    const createdBy = new User(object.createdBy?._id, object.createdBy?.name, object.createdBy?.role);

    const category = new Category(object.category?._id, object.category?.name, object.category?.slug);

    return {
        _id: object._id,
        category,
        createdAt: object.createdAt,
        createdBy,
        description: object.description,
        image: object.image,
        price: object.price,
        slug: object.slug,
        title: object.title,
        updatedAt: object.updatedAt,
    };
};
