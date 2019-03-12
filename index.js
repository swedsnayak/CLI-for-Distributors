var readline = require('readline');
const csv = require('csvtojson')

var log = console.log;
var csvFilePath = './cities.csv'

let citiesList;
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let data ={};
data.distributor={};
data.distributor.includes =[];
data.distributor.excludes =[];
data.distributor.subordinates={};

let child = {};
child.includes =[];
child.excludes =[];

let subDistributorCount = 0;

var getIncludedArea = async function () {
	citiesList = await csv().fromFile(csvFilePath);

 rl.question('\nEnter Distributor-1 regions to be INCLUDED: ', function (answer) {
  if (answer == 'next') {
  	getExcludedArea();
  }
  else if(answer == 'exit') {
    log('\nExiting...Thank you!\n');
    rl.close();
  }
  else {
    log('You have included: ');
    answer = answer.split('-');
    var ans = [];
    if(answer.length == 1) {
     ans.push("*");
     ans.push("*");
     ans.push(answer[0]);
    }
    else if(answer.length == 2) {
     ans.push("*");
     ans.push(answer[0]);
     ans.push(answer[1]);
    }
    else {
     ans.push(answer[0]);
     ans.push(answer[1]);
     ans.push(answer[2]);
    }
    let status = false;
  	 for (let i = 0; i < citiesList.length; i++) {
		    if ((citiesList[i]["Country Name"].toUpperCase() == ans[2].toUpperCase() || ans[2]=='*') &&
		  	   (citiesList[i]["Province Name"].toUpperCase() == ans[1].toUpperCase() || ans[1]=='*') &&
		  	   (citiesList[i]["City Name"].toUpperCase() == ans[0].toUpperCase() || ans[0]=='*')
		  	 ){
		      status = true;
		    }
		 }
		 if(status) {
	 		  data.distributor.includes.push(ans);
        log(ans);
		 }
		 else {
			   log('Entered region is not valid. Please refer the "cities.csv" for the list of valid regions!');
		 }
	  getIncludedArea();
	  }
 });
};


var getExcludedArea = function () {
 rl.question('\nEnter Distributor-1 regions to be EXCLUDED: ', function (answer) {
  if (answer == 'next') {
  	getResult();
  }
  else if(answer == 'exit') {
    log('\nExit.\nThank you!\n');
    rl.close();
  }
  else {
    log('You have excluded: ');
    answer = answer.split('-');
    var ans = [];

    if(answer.length == 1) {
     ans.push("*");
     ans.push("*");
     ans.push(answer[0]);
    }
    else if(answer.length == 2) {
     ans.push("*");
     ans.push(answer[0]);
     ans.push(answer[1]);
    }
    else {
     ans.push(answer[0]);
     ans.push(answer[1]);
     ans.push(answer[2]);
    }

    let status = false;
    for (let i = 0; i < citiesList.length; i++) {
	    if ((citiesList[i]["Country Name"].toUpperCase() == ans[2].toUpperCase() || ans[2]=='*') &&
	  	   (citiesList[i]["Province Name"].toUpperCase() == ans[1].toUpperCase() || ans[1]=='*') &&
	  	   (citiesList[i]["City Name"].toUpperCase() == ans[0].toUpperCase() || ans[0]=='*')
	  	 ){
		      status = true;
	    }
	  }
	  if (status) {
 		   data.distributor.excludes.push(ans);
       log(ans);
	  }
	  else {
		    log('Entered region is not valid. Please refer the "cities.csv" for the list of valid regions!');
	  }
   getExcludedArea();
  }
 });
};

var addSubDist = function () {
	subDistributorCount++;
	data.distributor.subordinates.subDistributorCount={};
	data.distributor.subordinates.subDistributorCount.includes =[];
	data.distributor.subordinates.subDistributorCount.excludes =[];

  rl.question('\nDo you want to add subordinates (yes/no): ', function (answer) {
  if (answer == 'yes') {
		  getIncludedAreaSubordinates(subDistributorCount);
  }
  else {
  	return rl.close();
	 }
 });
};

var getIncludedAreaSubordinates = function (subDistributorCount) {
 rl.question('\nEnter regions of sub-Distributor to be INCLUDED: ', function (answer) {
  if (answer == 'next') {
		  getExcludedAreaSubordinates(subDistributorCount);
  }
  else if(answer == 'exit') {
    log('\nExit.\nThank you!\n');
    rl.close();
  }
  else {
	  log('You are going to include: "', answer, '"');
	  let permission = false;
	  answer = answer.split('-');
    var ans = [];

    if(answer.length == 1) {
     ans.push("*");
     ans.push("*");
     ans.push(answer[0]);
    }
    else if(answer.length == 2) {
     ans.push("*");
     ans.push(answer[0]);
     ans.push(answer[1]);
    }
    else {
     ans.push(answer[0]);
     ans.push(answer[1]);
     ans.push(answer[2]);
    }
    log(ans);
    let status = false;
  	 for (let i = 0; i < citiesList.length; i++) {
		    if ((citiesList[i]["Country Name"].toUpperCase() == ans[2].toUpperCase() || ans[2]=='*') &&
		  	   (citiesList[i]["Province Name"].toUpperCase() == ans[1].toUpperCase() || ans[1]=='*') &&
		  	   (citiesList[i]["City Name"].toUpperCase() == ans[0].toUpperCase() || ans[0]=='*')
		  	 ){
		      status = true;
		    }
		  }

	    city = ans[0];
		  state = ans[1];
		  country = ans[2];
	 	  data.distributor.includes.map(included => {
		     if ( included[2] === country ) {
		 	     if(included[1] === '*') {
		 		       return permission = true;
		 	      }
		 	      if ( included[1] === state ) {
		 		        if ( included[0] === city || included[0] === '*') {
		 			          return permission = true;
		 		        }
		 	      }
		     }
    })
		if(status && permission) {
	 		data.distributor.subordinates.subDistributorCount.includes.push(ans);
	 	}
	 	else if(!status){
	 		log('\nEntered region is not valid. Please refer the "cities.csv" for the list of valid regions!');
	 	}
	 	else {
	 		log("\nPermission Denied! The subordinate can not distribute in the above mentioned region!");
	 	}
	  getIncludedAreaSubordinates();
	}
 });
};

var getExcludedAreaSubordinates = function (subDistributorCount) {
 rl.question('\nEnter regions of sub-Distributor to be EXCLUDED: ', function (answer) {
  if (answer == 'next') {
    log("Sub-Distributor added successfully!");
    rl.close();
  }
  else if(answer == 'exit') {
    log('\nExit.\nThank you!\n');
    rl.close();
  }
  else {
	  log('You are going to exclude: "', answer, '"');
	  answer = answer.split('-');
    var ans = [];
    if(answer.length == 1) {
     ans.push("*");
     ans.push("*");
     ans.push(answer[0]);
    }
    else if(answer.length == 2) {
     ans.push("*");
     ans.push(answer[0]);
     ans.push(answer[1]);
    }
    else {
     ans.push(answer[0]);
     ans.push(answer[1]);
     ans.push(answer[2]);
    }

    let status = false;
  	for (let i = 0; i < citiesList.length; i++) {
		  if ((citiesList[i]["Country Name"].toUpperCase() == ans[2].toUpperCase() || ans[2]=='*') &&
		  	(citiesList[i]["Province Name"].toUpperCase() == ans[1].toUpperCase() || ans[1]=='*') &&
		  	(citiesList[i]["City Name"].toUpperCase() == ans[0].toUpperCase() || ans[0]=='*')
		  	){
		    status = true;
		  }
		}
		if(status) {
	 		data.distributor.subordinates.subDistributorCount.excludes.push(answer);
      log(ans);
		}
		else {
			log('\nEntered region is not valid. Please refer the "cities.csv" for the list of valid regions!');
		}
	  getExcludedAreaSubordinates();
	}
 });
};

var getResult = function () {
	rl.question('\nEnter the region to check for the permission: ', function (question) {
 	if (question == 'next') {
  	addSubDist();
  }
  else if(question == 'exit'){
    log('\nExit.\nThank you!\n');
  	rl.close();
  }
 	else {
		let inputarray, country, state, city, flag;
	  inputarray = question.split('-');

		city = inputarray[0];
		state = inputarray[1];
		country = inputarray[2];

		flag = false;

		data.distributor.includes.map( included => {
		 if ( included[2] === country ) {
		 	if(included[1] === '*') {
		 		return flag = true;
		 	}
		 	if ( included[1] === state ) {
		 		if ( included[0] === city || included[0] === '*') {
		 			return flag = true;
		 		}
		 	}
    }
		})

		data.distributor.excludes.map(excluded => {
		 	if ( excluded[2] === country ) {
				if ( excluded[1] === '*' ) {
					return flag = false;
				}
				else {
					if (excluded[1] === state) {
						if ( excluded[0] === city || excluded[0] === '*') {
							return flag = false;
						}
					}
				}
			}
		})

		flag
     ? log('\n Permission: *** YES ***\n')
     : log('\n Permission: *** NO ***\n');
     rl.close();
	 }
 });
};
log("------------------------------------------------------");
log("(Type \"next\" to skip and \"exit\" to quit at anytime)");
log("------------------------------------------------------");
getIncludedArea();
