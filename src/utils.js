export const baseUrl = 'http://localhost:3000/api/v1'
export const railwayBaseUrl = 'https://bolt-visa-production.up.railway.app/api/v1'
export const vercelBaseUrl = 'https://bolt-visa.vercel.app/api/v1'
export const capitalizeWords = str =>
    typeof str === 'string'
        ? str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : str;

