module.exports = function(Oldcart){
	this.items = Oldcart.items || {};
	this.totalQlt = Oldcart.totalQlt || 0;
	this.totalPrice = Oldcart.totalPrice || 0;

	// add products
	this.add = function(item, id){
		// new products 
		var storedItem = this.items[id];
		if(!storedItem){
			storedItem = this.items[id] = {item: item, qlt: 0, price: 0}
		}
		storedItem.qlt++;
		storedItem.price = storedItem.item.price*storedItem.qlt;
		this.totalQlt++;
		this.totalPrice += storedItem.item.price;
	}
	// reduce by 1 products
	this.reducebyOne = function(id){
		this.items[id].qlt--;
		this.items[id].price -= this.items[id].item.price;
		this.totalQlt--;
		this.totalPrice -= this.items[id].item.price;

		if(this.items[id].qlt <= 0){
			delete this.items[id]
		}
	}
	// remove all
	this.removeAll = function(id){
		this.totalQlt -= this.items[id].qlt;
		this.totalPrice -= this.items[id].price;

		delete this.items[id]
	}

	// save items in array
	this.generateArray = function(){
		const arr = [];
		// loop items and push in array
		for(var id in this.items){
			arr.push(this.items[id])
		}
		return arr;
	}
}