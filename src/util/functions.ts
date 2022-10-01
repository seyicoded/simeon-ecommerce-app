export const formatMoney = (val: string|number)=>{
    return (new Intl.NumberFormat('en-US').format( parseInt(val) ));
}