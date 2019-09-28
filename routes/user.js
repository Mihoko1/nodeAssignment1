
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;
       
       var sql  ="SELECT * FROM users where user_name = '" + name +"'";
       
//       var check ="SELECT * FROM users where (user_name = '" + name +"' and password = '"+pass+"') "
       
       
       
       var query = db.query(sql, function(err, results){  
          
          if(err){
              console.log(results);
              console.log(results.length);
              console.log(results[0]);
          }
           
           
        if(results.length){
           
           


           message = "This user name is registered already. Please login.";
            res.render('signup.ejs',{message: message});

        }else{
            
            if(name == "" || pass == "" || fname == "" || mob == "" ){
                message = "Missing information. Plase fill in all information.";
                res.render('signup.ejs',{message: message});
                
            }else{
       
                var defaultPic= '../img/default-profile.jpg';
               var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`,`prof_pic`,`prof_pic_path`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass +  "', '" + defaultPic +"','" + defaultPic + "')";

              var query = db.query(sql, function(err, result) {

                 message = "Succesfully! Your account has been created.";
                 res.render('signup.ejs',{message: message});
              });
            }

        }
           });

      
   } else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
     
      var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){  
          
          if(err){

                console.log(results);
              console.log(results.length);
              console.log(results[0]);
          }
          
         if(results.length){
             
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/feed');
         }
         else{
            
            message = 'Please imput correct information.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};


//-----------------------------------------------feed page call------------------------------------------------------
exports.feed = function(req, res){
   
    var message = "";
    var userId = req.session.userId;
    
     if(userId == null){
          res.redirect("/login");
          return;
       
       }
    
    if(req.method == "POST"){

        var sql = "UPDATE users SET prof_pic_path ='" + imgPath + "' WHERE id =" + userId;

         var sql2="SELECT * FROM `users` WHERE `id`='"+userId+"'";

        db.query(sql +";" + sql2, function(err, results) {

             return res.render('feed.ejs',{data: results[1]});

        });
       
       
    }else{
      
    
       if(userId == null){
          res.redirect("/login");
          return;
       
       }
   
        var sql="SELECT c.feed_id, c.feed_img, c.feed_text, c.user_id, c.feed_date, a.first_name, a.last_name, a.prof_pic_path FROM feed AS c, users AS a WHERE c.user_id = a.id order by c.feed_date DESC";  
    
        var userInfo="SELECT * FROM users WHERE id = " + userId;
       
            db.query(sql + ";" + userInfo,function(err, results){  

              if(err){

                  console.log(results);
                  console.log(results.length);

                  message = "Error. Please Login again.";

              }

            return res.render('feed.ejs',         {feedData:results[0],data: results[1], message: message, userId: userId});    
        }); 
    }
};




//-----------------------------------------------dashboard page ----------------------------------------------

exports.dashboard = function(req, res){
           
    var userId = req.session.userId;
    var id =req.params.id;
    console.log("id = " + id);
       if(userId == null){
          res.redirect("/login");
          return;
       }
     if (req.query.id){
         id=req.query.id;
     }
        var sql = "SELECT * FROM users WHERE id= "+ userId; 
        
        var sql2="SELECT * FROM feed WHERE user_id = " +id+ " order by feed_date DESC";  

       db.query(sql +";"+ sql2 , function(err, results){
           
            
              if(err){

                  console.log(results);
                 console.log("results[0]");
                  

              }
          return res.render('dashboard.ejs', {data:results[0], feedData:results[1]});    
       }); 
  

};
    
    
//------------------------------------logout ----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};

//--------------------------------render user profile --------------------------------
exports.profile = function(req, res){
    
    var index = 0;
    var message = '';
    var userId = req.session.userId;
       if(userId == null){
          res.redirect("/login");
          return;
       
       }
        if(req.method == "POST"){
            
            if (!req.files || Object.keys(req.files).length === 0) {
          
            return res.status(400).send('No files were uploaded.');
            }
    
            
            var file = req.files.avatar;
            var img_name=file.name;
                
                
            if(img_name == "" || img_name == null){ //if no image is selected and submit is clicked
                
                console.log("no prof pic updated");
                
                // Get user data
                        var sql2="SELECT * FROM `users` WHERE `id`="+userId;
                    
                        // Get feed data
                        var feedData="SELECT c.feed_id, c.feed_img, c.feed_text, c.feed_date, a.first_name, a.last_name, a.prof_pic_path FROM feed AS c, users AS a WHERE c.user_id = a.id";  
                    
                    console.log("sql"  +sql );
                    
                        db.query(sql2+";"+feedData, function(err, result){  
                            
                            return res.render('feed.ejs',{data:result[0], feedData:result[1], message: message});
                        });
                    
            }else{ // when an image is selected and submit is clicked.
               
                var pathStr =__dirname.lastIndexOf('/');

                var imgPath = __dirname.substr(0, pathStr)

                var pathName= imgPath+"/public/img/upload_images/" + img_name;


                if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){

                    file.mv(pathName, function(err) {

                       if (err){
                           console.log("errorA:" + err);
                           return res.status(500).send(err);
                       }

                        // profile picture update
                        var sql = "UPDATE users SET prof_pic_path ='/img/upload_images/"  +img_name + "' WHERE id =" + userId;

                        // Get user data
                        var sql2="SELECT * FROM `users` WHERE `id`="+userId;

                        // Get feed data
                        var feedData="SELECT c.feed_id, c.feed_img, c.feed_text, c.feed_date, a.first_name, a.last_name, a.prof_pic_path FROM feed AS c, users AS a WHERE c.user_id = a.id"; 
                        db.query(sql+";"+sql2+";"+feedData, function(err, result){  

                            return res.render('feed.ejs',{data:result[1], feedData:result[2], message: message});
                        });
                    });
                            
                 
                } else {
                    message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
                    return res.render('profile.ejs',{message: message});
                }
            
            }
        
        }else{  //GET
            
            var sql="SELECT * FROM `users` WHERE `id`="+userId; 
            
            console.log("sql: "+ sql);
    
            db.query(sql, function(err, result){  
                
                console.log("result: "+ result[0].prof_pic_path);
                return res.render('profile.ejs',{data:result, message: message});
           });
        
        };
      
};


//-------------------------------- profileUpdate --------------------------------

//exports.profileUpdate = function(req, res){
//
//    var message = '';
//    var userId = req.session.userId;
//       if(userId == null){
//          res.redirect("/login");
//          return;
//       
//       }
//        
//            
//            if (!req.files || Object.keys(req.files).length === 0) 
//          
//            return res.status(400).send('No files were uploaded.');
//    
// 
//            var file = req.files.avatar;
//            var img_name=file.name;
// 
//            console.log("A" + req.files.avatar);
//
//            if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
//                
//           
//                var imgPath =__filename;
//                
//                 console.log("imgPath "+ imgPath);
//                
//                file.mv("public/img/upload_images/" + file , function(err) {
//
//                   if (err)
//                       console.log("errorA:" + err);
//                       return res.status(500).send(err);
//
//
//                        var sql = "UPDATE users SET prof_pic_path ='" + imgPath + "' WHERE id =" + userId;
//
//                        db.query(sql,function(err, results) {
//                            
//                            console.log("pucture updated");
//                        });
//                    
//                    var sql2="SELECT * FROM `users` WHERE `id`="+userId;
//                                
//                            db.query(sql2,function(err, results) {
//
////                            return return res.render('feed.ejs',         {feedData:results[0],data: results[1], message: message});   
//                            return res.render('feed.ejs', {data: results, message: message}); 
//
//                            });
//                });
//                        
//                
//            } else {
//                message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
//                return res.render('profile.ejs',{message: message});
//            }
//           
//};
  
//---------------------------------edit users details after login----------------------------------
//exports.editprofile=function(req,res){
//   var userId = req.session.userId;
//   if(userId == null){
//      res.redirect("/login");
//      return;
//   }
//
//   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
//   db.query(sql, function(err, results){
//      res.render('edit_profile.ejs',{data:results});
//   });
//};
