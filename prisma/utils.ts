export function generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function findIdsByNames(collection: any[], names: string[]): number[] {
    return names.map(name => {
        const item = collection.find(item =>
            item.name.toLowerCase() === name.toLowerCase());
        if (!item) {
            console.warn(`Warning: Could not find matching item for "${name}". Skipping.`);
            return null;
        }
        return item.id;
    }).filter(id => id !== null);
}