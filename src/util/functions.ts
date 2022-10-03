export const formatMoney = (val: string|number)=>{
    return (val.toLocaleString())
    // return (new Intl.NumberFormat('en-US').format( parseInt(val) ));
}