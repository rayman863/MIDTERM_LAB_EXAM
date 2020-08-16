var db = require('./db');

module.exports ={

	get: function(user, callback){
		var sql = "select * from employee where id=?";
		db.getResults(sql, [user.userid], function(result){
			console.log(result);
			if(result.length > 0){
				//console.log(result);
				callback(result[0]);
			}else{
				callback([]);
			}
		});
	},

	getType: function(user, callback){
		var sql = "select * from admin where username=? and password=?";
		db.getResults(sql, [user.uname, user.password], function(result){
			if(result.length > 0){
				console.log(result);
				callback(result[0]);
			}else{
				callback([]);
			}
		});
	},

	getAll: function(callback){
		var sql = "select * from employee";
		db.getResults(sql, null,  function(result){
			if(result.length > 0){
				callback(result);
			}else{
				callback([]);
			}
		});
	},

	validate: function(user, callback){
		var sql = "select * from admin where username=? and password=?";
		db.getResults(sql, [user.uname, user.password], function(result){
			if(result.length > 0){
				callback(true);
			}else{
				callback(false);
			}
		});
	},

	insert: function(user, callback){
		var sql = "INSERT INTO `employee` (`username`, `password`, `phone`) VALUES (?,?,?)";

		db.execute(sql, [user.uname, user.password, user.phone], function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});

		var sql2 = "INSERT INTO `login` (`username`, `password`, `type`) VALUES (?,?,?)";

		db.execute(sql2, [user.uname, user.password, user.type], function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});
	},

	update: function(user, callback){
		var sql = "update employee set username=?, password=?, phone=? where id=?; update login set username=?, password=? where username=?";
		db.execute(sql, [user.username, user.password, user.phone, user.id, user.username, user.password, user.oldusername], function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});
	},

	delete: function(user, callback){
		var sql = "delete from employee where id=?; delete from login where username=?";
		db.execute(sql, [user.userid, user.username], function(status){
			console.log(user.userid);
			console.log(user.username);
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});
		// var sql2 = "delete from login where username=?";
		// db.execute(sql2, [user.username], function(status){
		// 	if(status){
		// 		callback(true);
		// 	}else{
		// 		callback(false);
		// 	}
		// });
	}
}