#!/usr/bin/env node
var http = require('http');
var res = require('request');
var repl = require('repl');
var fs = require('fs');
var csv = require('fast-csv');
var uu = require('underscore');

var orders = [];
var orderIndex = 0;
var parsedOutput; 

res('https://api.coinbase.com/v1/currencies/exchange_rates', function(error, response, body){
    if(!error && response.statusCode == 200){
	parsedOutput = JSON.parse(body);

        }	
});

var eval_funct = function(cmd, context, filename, callback){
    var input = cmd.toLowerCase().split(" ");
    //need to convert string to float for further manipulation
    var amount = parseFloat(input[1]);
    //default currency will be BTC if no argument passed
    var denom = "BTC";
    var time = new Date().toString();

    //console.log(parsedOutput[btc_to_xxx = 'usd_to_btc']);

    //if currency argument passed, replace denom with that currency
    if(input[2] != undefined){
	denom = input[2].trim();
	//console.log("Denom has been changed.");
   }
    //need to clean input[0] otherwise case "orders" doesn't work
    input[0] = input[0].trim();
    switch(input[0])
    {
	case "buy":
                   if(amount == undefined){
		       callback("Error: No amount provided");
		       break;
		   }
	
	           if(denom != "BTC"){
		       //var str1 = "_to_btc";
		       //var str2 = "btc_to_";
		       var convert1 = denom.toLowerCase().trim() + "_to_btc";
		       var convert2 = "btc_to_" + denom.toLowerCase().trim();
		       convert1 = convert1.trim();
		       convert2 = convert2.trim();
		       //var convert = "btc_to_" + denom.toLowerCase(); 
		       //console.log(convert);    
		            
		       //returns the matching value
		       //console.log(parsedOutput[btc_to_xxx = convert2]);
		       var rate1 = parsedOutput[btc_to_xxx = convert2];
		       //console.log(parsedOutput[xxx_to_btc = convert1]);
		       //console.log(rate);
		       var rate2 = parsedOutput[xxx_to_btc = convert1]; 
		       orders[orderIndex++] = {
			   timestamp:  time,
			   type: 'buy',
			   amount: amount,
			   currency: denom,
			   conversion_rate: rate1,
		       };

		       console.log("Order to buy " + amount + " " + denom + " worth of BTC queued @ " + rate1 + " BTC/" + denom + " (" + rate2 + " BTC)" );
		       break;
		   }else if(denom == "BTC"){
		       orders[orderIndex++] = {
			   timestamp: time,
			   type: 'buy',
			   amount: amount,
			   currency: denom,
			   conversion_rate: 0,
		       };
		       console.log("Order to buy " + amount + " BTC queued");
		       
		   }

	           break;

	case "sell":
	            if(amount == undefined){
			callback("Error: No amount provided");
			break;
		    }
	            if(denom != "BTC"){
			
			var convert1 = denom.toLowerCase().trim() + "_to_btc";
			var convert2 = "btc_to_" + denom.toLowerCase().trim();
			convert1 = convert1.trim();
			convert2 = convert2.trim();

			var rate1 = parsedOutput[btc_to_xxx = convert2];
			var rate2 = parsedOutput[xxx_to_btc = convert1];
			orders[orderIndex++] = {
			    timestamp: time,
			    type: 'sell',
			    amount: amount,
			    currency: denom,
			    conversion_rate: rate1,
			};

			console.log("Order to sell " + amount + " " + denom + " worth of BTC queued @ " + rate1 + " BTC/" + denom + " (" + rate2 + " BTC)");
			break;
		    }else if(denom == "BTC"){

			orders[orderIndex++] = {
			    timestamp: time,
			    type: 'sell',
			    amount: amount,
			    currency: denom,
			    conversion_rate: 0,
			};
			console.log("Order to sell " + amount + " BTC queued");
			break;
		    }

	            break; 

	case "orders":
	              console.log("===CURRENT ORDERS===");
	              //console.log(orders[i].time);
	              //console.log("\n");
	
                      var ws = fs.createWriteStream("my.csv");
                      //console.log(orders);               
	             /*
	              var data = uu.map(orders, function(){
			  return {"timestamp": orders.time,
				  "type": orders.type,
				  "amount": orders.amount,
				  "currency" : orders.denom};
		      });
	              console.log(data);
	           */
		
		      csv.write(orders, {headers: true}).pipe(ws);

	              for(var i = 0; i < orderIndex; i++)
	                  {
			      console.log(orders[i].timestamp + " : " + orders[i].type + " " + orders[i].amount + " : UNFILLED" );
			      		           
			  }	   
	                       
	                                   
                      
                      break;
	default:
	              console.log("Unknown command: " + input[0] + "\n");
	              break;
    } // end switch
	
}; //end eval_funct

var replServer = repl.start({
    prompt: "coin-base > ",
    eval: eval_funct,
});

