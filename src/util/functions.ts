export const formatMoney = (val: string|number|any)=>{
    return ((parseInt(val || 0)).toLocaleString('en-US'))
    // return (new Intl.NumberFormat('en-US').format( parseInt(val) ));
}