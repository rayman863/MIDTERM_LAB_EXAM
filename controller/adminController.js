var express 	= require('express');
const { body, validationResult } = require('express-validator');
var userModel 	= require.main.require('./models/adminModel'); 
var router 		= express.Router();

router.get('/', function(req, res){
	if(req.session.type == "Admin"){
		res.render('admin/index');
	}
	else{
		res.redirect('/login');
	}
});

router.get('/AllEmployeeList', function(req, res){
	userModel.getAll(function(results){
		if(req.session.type == "Admin"){
			res.render('admin/emplist', { userList : results, uname: req.session.username});
		}
		else{
			res.redirect('/login');
		}
	});
});

router.get('/AddEmployee', function(req, res){
	if(req.session.type == "Admin"){
		res.render('admin/addemp');
	}
	else{
		res.redirect('/login');
	}
});

router.post('/AddEmployee', [
	// username must not be empty
	body('uname').notEmpty().isLength({ min: 8 }),
	// password must be at least 8 chars long
	body('password').notEmpty().isLength({ min: 8 }).matches(
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
	  ),
	body('confirmpassword').notEmpty(),//.matches('password'),
	body('type').notEmpty(),  
	body('phone').notEmpty().isDecimal().isLength({ min: 11 }).isLength({ max: 11 })
  ], function(req, res){
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(400).json({ errors: errors.array() });
	}
	
	var user ={
		uname 		: req.body.uname,
		password	: req.body.password,
		type		: req.body.type,
		phone		: req.body.phone
	}

	userModel.insert(user, function(status){
		if(status){
			if(req.session.type == "Admin"){
				return res.render('admin/index');
			}
			else{
				res.redirect('/login');
			}
		}else{
			if(req.session.type == "Admin"){
				return res.render('admin/addemp');
			}
			else{
				res.redirect('/login');
			}
		}
	});
});


router.get('/Update/:id',function(req,res)
{
    user={
        userid: req.params.id
    }
    userModel.get(user,function(result)
    {
		if(req.session.type == "Admin"){
			req.session.oldusername = result.username;
			res.render('admin/updateemp', {
				username: result.username,
				phone: result.phone
			});
		}
		else{
			res.redirect('/login');
		}
        
    });
});

router.post('/Update/:id', [
	// username must not be empty
	body('uname').notEmpty(),
	// password must be at least 8 chars long
	body('password').notEmpty().isLength({ min: 8 }).matches(
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
	  ),
	body('confirmpassword').notEmpty(),//.matches('password'), 
	body('phone').notEmpty().isDecimal().isLength({ min: 11 }).isLength({ max: 11 })
  	], function(req,res)
	{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
    var user=
    {
		oldusername: req.session.oldusername,
		username: req.body.uname,
        password: req.body.password,
        phone: req.body.phone,
		id: req.params.id
	}
	
	

    userModel.update(user,function(result)
    {
		if(req.session.type == "Admin"){
			res.redirect('/admin/AllEmployeeList');
		}
		else{
			res.redirect('/login');
		}
    })
})


router.get('/Delete/:id', function(req, res){
	user={
        userid: req.params.id
    }
	userModel.get(user, function(result){
		if(req.session.type == "Admin"){
			res.render('admin/deleteemp', {user: result});
		}
		else{
			res.redirect('/login');
		}
	});
	
});

router.post('/Delete/:id', function(req, res){

	var user = {
		userid: req.params.id
	}

	userModel.get(user,function(result)
    {
		user = {
			userid: req.params.id,
			username: result.username
		}
		userModel.delete(user, function(status){
			if(status){
				if(req.session.type == "Admin"){
					return res.redirect('/admin/AllEmployeeList');
				}
				else{
					res.redirect('/login');
				}
				
			}else{
				if(req.session.type == "Admin"){
					return res.render('admin/index');
				}
				else{
					res.redirect('/login');
				}
				
			}
		});
    });
});





module.exports = router;