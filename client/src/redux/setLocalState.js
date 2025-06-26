
export const setLocalState = ( key , value ) => {
    if(!key || !value){
        return "key value pairs are needed..."
    }
    localStorage.setItem( key , value )

    return "success"
}