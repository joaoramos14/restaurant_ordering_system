import { ValidationError } from "../errors/ValidantionError.js";

export class Category {
    private id?: string | undefined;
    private name: string;
    private description: string | undefined;
    private icon: string | undefined;
    private display_order: number;
    private active: boolean;


    constructor(name: string, display_order: number, description?: string, icon?: string) {
        this.id = undefined;
        this.name = "";
        this.description = description;
        this.icon = icon;
        this.display_order = 0;
        this.active = true;

        this.rename(name);
        this.changeDisplayOrder(display_order);
    }

    static restore(id: string, name: string, display_order: number, active: boolean, description: string, icon?: string): Category {
        const category = new Category(name, display_order, description, icon);

        category.id = id;
        category.active = active;

        return category;
    }


    public getId(): string | undefined {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getDescription(): string | undefined {
        return this.description;
    }
    public getIcon(): string | undefined {
        return this.icon;
    }
    public getDisplayOrder(): number {
        return this.display_order;
    }
    public isActive(): boolean {
        return this.active;
    }


    rename(name: string): void {
        if (typeof name !== "string" || name.trim().length === 0) {
            throw new ValidationError("O nome da categoria é obrigatório.");
        }
        
        this.name = name.trim();
    }


    public changeDescription(description: string): void {
        this.description = description;
    }
    public changeIcon(icon: string): void {
        this.icon = icon;
    }
    public changeDisplayOrder(display_order: number): void {
        if (!Number.isInteger(display_order) || display_order < 0) {
            throw new ValidationError(
                "A ordem de exibição deve ser um número inteiro maior ou igual a zero."
            );
        }

        this.display_order = display_order;
    }

    activate(): void {
        this.active = true;
    }
    deactivate(): void {
        this.active = false;
    }

}