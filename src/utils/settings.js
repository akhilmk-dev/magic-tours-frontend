export async function getPublicSettings() {
    try {
        const response = await fetch('https://magic-apis.staff-b0c.workers.dev/homepage', {
            cache: 'no-store' // Always fetch fresh settings
        });
        if (!response.ok) throw new Error('Failed to fetch public settings');
        const json = await response.json();
        return json.data || {};
    } catch (error) {
        console.error('Settings Data Fetch Error:', error);
        return {};
    }
}
