export class Product {
    private id: string | undefined;
    private category_id: string;
    private title: string;
    private description: string;
    private price: number;
    private image: string;
    private available: boolean;
    private active: boolean;

    constructor(
        category_id: string,
        title: string,
        description: string,
        price: number,
        image: string,
        available: boolean,
        active: boolean,
    ) {
        this.id = undefined;
        this.category_id = category_id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.image = image;
        this.available = available;
        this.active = active;
    }

    static restore(
        id: string,
        category_id: string,
        title: string,
        description: string,
        price: number,
        image: string,
        available: boolean,
        active: boolean,
    ): Product {
        const product = new Product(category_id, title, description, price, image, available, active);
        product.id = id;
        return product;
    }

    // getters
    public getId(): string | undefined {
        return this.id;
    }
    public getCategoryId(): string {
        return this.category_id;
    }
    public getTitle(): string {
        return this.title;
    }
    public getDescription(): string {
        return this.description;
    }
    public getPrice(): number {
        return this.price;
    }
    public getImage(): string {
        return this.image;
    }
    isAvailable(): boolean {
        return this.available;
    }
    isActive(): boolean {
        return this.active;
    }

    // setters
    changeCategoryId(category_id: string): void {
        this.category_id = category_id;
    }
    rename(title: string): void {
        this.title = title;
    }
    changeDescription(description: string): void {
        this.description = description;
    }
    changePrice(price: number): void {
        this.price = price;
    }
    changeImage(image: string): void {
        this.image = image;
    }
    setAvailable(available: boolean): void {
        this.available = available;
    }

    // others
    activate(): void {
        this.active = true;
    }
    deactivate(): void {
        this.active = false;
    }
}
