export async function getPublicSettings() {
    try {
        const response = await fetch('https://api.magictours.qa/settings/public', {
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
