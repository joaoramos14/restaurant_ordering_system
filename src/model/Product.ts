import { ValidationError } from "../errors/ValidantionError.js";

export class Product {
    private id: string | undefined;
    private category_id: string;
    private title: string;
    private description: string | undefined;
    private price: number;
    private image: string | undefined;
    private available: boolean;
    private active: boolean;

    constructor(
        category_id: string,
        title: string,
        price: number,
        description?: string,
        image?: string,
    ) {
        this.id = undefined;
        this.category_id = "";
        this.title = "";
        this.description = description;
        this.price = 0;
        this.image = image;
        this.available = true;
        this.active = true;

        this.changeCategory(category_id);
        this.rename(title);
        this.changePrice(price);
    }

    static restore(
        id: string,
        category_id: string,
        title: string,
        price: number,
        available: boolean,
        active: boolean,
        description?: string,
        image?: string,
    ): Product {
        const product = new Product(category_id, title, price, description, image);

        product.id = id;
        product.available = available;
        product.active = active;

        return product;
    }

    getId(): string | undefined {
        return this.id;
    }

    getCategoryId(): string {
        return this.category_id;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    getPrice(): number {
        return this.price;
    }

    getImage(): string | undefined {
        return this.image;
    }

    isAvailable(): boolean {
        return this.available;
    }

    isActive(): boolean {
        return this.active;
    }

    changeCategory(category_id: string): void {
        if (typeof category_id !== "string" || category_id.trim().length === 0) {
            throw new ValidationError("A categoria do produto é obrigatória.");
        }

        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(category_id.trim())) {
            throw new ValidationError(
                "O identificador da categoria deve ser um UUID válido.",
            );
        }

        this.category_id = category_id.trim();
    }

    rename(title: string): void {
        if (typeof title !== "string" || title.trim().length === 0) {
            throw new ValidationError("O título do produto é obrigatório.");
        }

        this.title = title.trim();
    }

    changeDescription(description: string): void {
        this.description = description;
    }

    changePrice(price: number): void {
        if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
            throw new ValidationError(
                "O preço do produto deve ser um número maior ou igual a zero.",
            );
        }

        this.price = price;
    }

    changeImage(image: string): void {
        this.image = image;
    }

    makeAvailable(): void {
        this.available = true;
    }

    makeUnavailable(): void {
        this.available = false;
    }

    activate(): void {
        this.active = true;
    }

    deactivate(): void {
        this.active = false;
    }
}
