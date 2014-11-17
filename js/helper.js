//Helper class that manages question retrival/ generation
function Helper() {
 //does nothing for now
this.emptytile_locations = [];
  
}

Helper.prototype.getpoints = function (rating) {
//to do calculate minimum moves required logic

//for now 
console.log(this.emptytile_locations.length);
return rating*this.emptytile_locations.length;
}

bound = function (r,c){
	if(r<4 && r>=0 && c>=0 && c<4)
		return true;
	return false;
};


Helper.prototype.generateQuestion = function (newlist){
//last is -1 
for(var i=0;i<=15;i++)
	newlist[i] = i;

newlist[15]= -1;
var i = 15;

var difficulty = [35,55,75,95,115];

console.log(i);
console.log('-----------------------ST--------------');
for(var depth=0;depth<difficulty[1];depth++) {
	var v = Math.random();
	this.emptytile_locations.push(i);


	if (v<0.25 && bound(Math.floor(i/4+1),i%4)) {
		var ind = (Math.floor(i/4+1))*4+i%4;
		var tmp = newlist[ind]; newlist[ind] = newlist[i]; newlist[i] = tmp;
		i = ind;
		continue;
	}

	if (v<0.5 && bound(Math.floor(i/4-1), i%4)) {
		var ind = Math.floor(i/4-1)*4 + i%4;
		var tmp = newlist[ind]; newlist[ind] = newlist[i]; newlist[i] = tmp;
		i = ind;
		continue;
	}


	if (v<0.75 && bound(Math.floor(i/4),i%4+1)) {
		var ind = Math.floor(i/4)*4 + i%4+1;
		var tmp = newlist[ind]; newlist[ind] = newlist[i]; newlist[i] = tmp;
		i = ind;
		continue;
	}
	if(bound(Math.floor(i/4),i%4-1)) {
		var ind = Math.floor(i/4)*4+i%4-1;
		var tmp = newlist[ind]; newlist[ind] = newlist[i]; newlist[i] = tmp;
		i = ind;
	}
	
	

}
this.emptytile_locations.push(i);

for (var i=0;i<=15;i++)
	console.log(newlist[i]);
console.log('-----------------------ST E--------------');
//a[i] = position where i is present 
return newlist;
};