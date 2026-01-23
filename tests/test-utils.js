/**
 * Creates a valid entry 
 */
export function createMockEntry(overrides = {}) {
    const today = new Date().toISOString().split('T')[0];

    const defaultEntry = {
        "projectid": 1,
        "projectName": "Web Design",
        "date": today,
        "durationMinutes": 60
    };

    return { ...defaultEntry, ...overrides };
}