var readline = require('readline');
const csv = require('csvtojson')

var csvFilePath = './cities.csv'
var log = console.log;

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

  rl.question('Enter Distributor 1 regions to be INCLUDED: ', function (answer) {
    if (answer == 'next') {
    	getExcludedArea();
      //return rl.close();
    }
    else {
	    log('You have included: "', answer, '"');
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
		if(status) {
	  		data.distributor.includes.push(ans);
		}
		else {
			log('Enter valid region!! ');
		}
	    getIncludedArea();
	}
  });
};


var getExcludedArea = function () {
  rl.question('Enter Distributor 1 regions to be EXCLUDED: ', function (answer) {
    if (answer == 'next') {
    	console.log(data);
    	getResult();
    }
    else {
	    log('You have excluded: "', answer, '"');
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
		if(status) {
	  		data.distributor.includes.push(ans);
		}
		else {
			log('Enter valid region!! ');
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

  rl.question('Do you want to add subordinates: ', function (answer) {
    if (answer == 'yes') {
		    getIncludedAreaSubordinates(subDistributorCount);
    }
    else {
    	return rl.close();
	   }
  });
};

var getIncludedAreaSubordinates = function (subDistributorCount) {
  rl.question('Enter regions of sub Distributor to be INCLUDED: ', function (answer) {
    if (answer == 'next') {
		getExcludedAreaSubordinates(subDistributorCount);
    }
    else {
	    log('You are going to include: "', answer, '"');
	    let permission = false;
	    answer = answer.split('-');
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
	    city = ans[0];
      state = ans[1];
      country = ans[2];

	  	data.distributor.includes.map(included => {
		  if ( included[2] ===  country ) {
		  	if(included[1] ===  '*') {
		  		return permission = true;
		  	}
		  	if ( included[1] ===  state ) {
		  		if ( included[0] ===  city ||  included[0] ===  '*') {
		  			return permission = true;
		  		}
		  	}
		  }

		})
		if(permission) {
	  		data.distributor.subordinates.subDistributorCount.includes.push(ans);
	  	}
	  	else {
	  		console.log("Permission Denied! The subordinate can not distribute in the above mentioned region");
	  	}
	    getIncludedAreaSubordinates();
	   }
  });
};

var getExcludedAreaSubordinates = function (subDistributorCount) {
  rl.question('Enter regions of sub Distributor to be EXCLUDED: ', function (answer) {
    if (answer == 'next') {
		verifyPermission(subDistributorCount);
    }
    else {
	    log('You have excluded: "', answer, '"');
	    answer = answer.split('-');
	  	data.distributor.subordinates.subDistributorCount.excludes.push(answer);
	    getExcludedAreaSubordinates();
	}
  });
};
var verifyPermission = function (subDistributorCount) {
	console.log('%o',data);
	console.log('%o',child);
	console.log(subDistributorCount);
	rl.close();
};

var getResult = function () {
  rl.question('Enter the question: ', function (question) {
  	if (question == 'next') {
    	console.log(data);
    	addSubDist();
    }
    else if(question == 'exit'){
    	rl.close();
    }
  	else {
      let inputarray, country, state, city, flag;
	    inputarray = question.split('-');
	    console.log(inputarray);

      city = inputarray[0];
      state = inputarray[1];
      country = inputarray[2];
      flag = false;

      data.distributor.includes.map(included => {
      if (included[2] === country) {
        if(included[1] === '*') {
      	   return flag = true;
         }
         if(included[1] === state) {
      	    if (included[0] === city ||  included[0] === '*') {
      		      return flag = true;
            }
         }
		  }
		  else {
          // do nothing
		  }
		});

  data.distributor.excludes.map(excluded => {
    if (excluded[2] === country ) {
        if (excluded[1] === '*') {
            return flag = false;
        }
        else {
            if (excluded[1] === state) {
              if (excluded[0] === city || excluded[0] === '*') {
                  return flag = false;
              }
            }
        }
    }
  })

	flag ? console.log('yes') : console.log('no');
	}
  });
};

// Starting point of the program
getIncludedArea();
