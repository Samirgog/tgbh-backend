function normalizeNullToUndefined<T>(obj: T): Partial<T> {
    if (Array.isArray(obj)) {
        return obj.map(normalizeNullToUndefined) as T;
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => {
                if (value === null) return [key, undefined];
                if (typeof value === 'object') return [key, normalizeNullToUndefined(value)];
                return [key, value];
            }),
        ) as T;
    }

    return obj;
}
