export class User {
    public _id: string;
    public name: string;
    public role: string;
    constructor(_id: string, name: string, role: string) {
        this._id = _id;
        this.name = name;
        this.role = role;
    }
}
