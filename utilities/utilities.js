

function calculateTotalPrice(items){
    var total = 0;
    items.forEach((item)=>{
        total += item.price
    })
    total = total.toFixed(2)
    return total
}

module.exports = {calculateTotalPrice}