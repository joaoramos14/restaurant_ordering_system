export class Category {
    private id: string | undefined;
    private name: string;
    private description: string | undefined;
    private icon: string | undefined;
    private display_order: number;
    private active: boolean;

    constructor(name: string, display_order: number, description?: string, icon?: string) {
        this.id = undefined;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.display_order = display_order;
        this.active = true;
    }

    static restore(
        id: string,
        name: string,
        display_order: number,
        active: boolean,
        description?: string,
        icon?: string,
    ): Category {
        const category = new Category(name, display_order, description, icon);

        category.id = id;
        category.active = active;

        return category;
    }

    // getters
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
    isActive(): boolean {
        return this.active;
    }

    // setters
    rename(name: string): void {
        this.name = name;
    }
    changeDescription(description?: string): void {
        this.description = description;
    }
    changeIcon(icon?: string): void {
        this.icon = icon;
    }
    changeDisplayOrder(display_order: number): void {
        this.display_order = display_order;
    }

    // others
    activate(): void {
        this.active = true;
    }
    deactivate(): void {
        this.active = false;
    }
}
