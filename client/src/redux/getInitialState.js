export const getInitialState = (key) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
    } catch (error) {
        console.error(`Error parsing localStorage item "${key}":`, error)
        return null
    }
}

export const setLocalState = (key, value) => {
    if (!key || !value) {
        return "key value pairs are needed..."
    }
    
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
        return "success"
    } catch (error) {
        console.error(`Error setting localStorage item "${key}":`, error)
        return "error"
    }
}