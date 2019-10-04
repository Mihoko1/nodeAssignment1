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
       
                var defaultPic= '/img/default-profile.jpg';
                
               var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`,`prof_pic_path`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass +  "', '" + defaultPic +"')";

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


//-----------------------------------------------feed page ------------------------------------------------------
exports.feed = function(req, res){
   
    
    var message = '';
    var userId = req.session.userId;
       if(userId == null){
          res.redirect("/login");
          return;
       
       }
        if(req.method == "POST"){
            
            if (!req.files || Object.keys(req.files).length == 0) {
          
            return res.status(400).send('No files were uploaded.');
            }
    
            
            var file = req.files.imgFile;
            var picName=file.name;
            var post = req.body.postText;
            var fileType = false;
            
            if (picName.slice(-5).includes(".jpeg") || picName.slice(-4).includes(".jpg") || picName.slice(-4).includes(".png")){
                fileType = true;
            }
                
                
            if( !fileType  || post.length == 0){ //no image is selected or textarea is empty
                
                message = "Error. Please try again."
                console.log("no prof pic updated");
                
                // Get user data
                        var sql="SELECT * FROM `users` WHERE `id`="+userId;
                    
                        // Get feed data
                        var feedData="SELECT c.feed_id, c.feed_img, c.feed_text, c.feed_date, a.first_name, a.last_name, a.prof_pic_path FROM feed AS c, users AS a WHERE c.user_id = a.id order by c.feed_date DESC";  
                    
                    console.log("sql"  +sql );
                    
                        db.query(sql+";"+feedData, function(err, result){  
                            
                           res.render('feed.ejs',{data:result[0], feedData:result[1],message: message, userId:userId});
                        });
                
                console.log("feedData"+ feedData);
                
                 console.log("data"+ feedData);
                    
            }else{ // when an image is selected and text is filled 
                
                console.log("post pic ");
                
                message = "";
               
                var pathStr =__dirname.lastIndexOf('/');

                var imgPath = __dirname.substr(0, pathStr)

                var pathName= imgPath+"/public/img/upload_images/" + picName;
                
                var path = "/img/upload_images/" + picName;

                    file.mv(pathName, function(err) {

                       if (err){
                           console.log("errorA:" + err);
                           return res.status(500).send(err);
                       }

                        message = "";
                        
                        var sql = "INSERT INTO feed (feed_img, feed_text, user_id) VALUES ('"+ path + "','" + post + "','"+ userId +"')";
                        
                        
                         db.query(sql , function(err, results) {
                             if(err){
                                
                            }
                             
                             res.render('feed.ejs',{
//                             feedData: results[0], data: results[1], message: message, userId: userId});
                            
                           feedData:results[0],data: results[1], message: message, userId: userId}); 
                        });    
                             
                        
                         // Get feed data
                        var feedData="SELECT c.feed_id, c.feed_img, c.feed_text, c.feed_date, a.first_name, a.last_name, a.prof_pic_path FROM feed AS c, users AS a WHERE c.user_id = a.id order by c.feed_date DESC"; 
                        
                        var sql2="SELECT * FROM `users` WHERE `id`="+userId;

                        db.query(sql +";" + feedData +";" + sql2, function(err, results) {
                        
                            if(err){
                                console.log("0:"+sql);
                                 console.log("1:"+feedData);
                                 console.log("2:"+sql2);
                            }
                        
                         res.render('feed.ejs',{
//                             feedData: results[0], data: results[1], message: message, userId: userId});
                            
                           feedData:results[0],data: results[1], message: message, userId: userId}); 
                        });          
                    }); 
             } 
    }else{
      
    
       if(userId == null){
          res.redirect("/login");
          return;
       
       }
        console.log("first ");
   
        var sql="SELECT c.feed_id, c.feed_img, c.feed_text, c.user_id, c.feed_date, a.first_name, a.last_name, a.prof_pic_path FROM feed AS c, users AS a WHERE c.user_id = a.id order by c.feed_date DESC";  
    
        var userInfo="SELECT * FROM users WHERE id = " + userId;
       
            db.query(sql + ";" + userInfo,function(err, results){  

              if(err){

                  console.log(results);
                  console.log(results.length);

                  message = "Error. Please Login again.";

              }

            res.render('feed.ejs',         {feedData:results[0],data: results[1], message: message, userId: userId});    
        }); 
    }
};




//-----------------------------------------------timeline page ----------------------------------------------

exports.timeline = function(req, res){
           
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
        
         var sql2 ="SELECT feed.feed_id, feed.feed_img, feed.feed_text, feed.user_id, feed.feed_date, users.first_name, users.last_name, users.prof_pic_path FROM users INNER JOIN feed ON feed.user_id = users.id  WHERE users.id = "+ id + " order by feed.feed_date DESC";  

       db.query(sql +";"+ sql2 , function(err, results){
           
            
              if(err){
                 console.log("results[0]");
                  
              }
          return res.render('timeline.ejs', {data:results[0], feedData:results[1],userId:userId});    
       }); 
  

};
    
    
//------------------------------------logout ----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};

//--------------------------------render user profile -----------------------------
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
                        var feedData="SELECT c.feed_id, c.feed_img, c.feed_text, c.feed_date, a.first_name, a.last_name, a.prof_pic_path FROM feed AS c, users AS a WHERE c.user_id = a.id order by c.feed_date DESC";  
                    
                    console.log("sql"  +sql );
                    
                        db.query(sql2+";"+feedData, function(err, result){  
                            
                            return res.render('feed.ejs',{data:result[0], feedData:result[1], message: message,userId:userId});
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
                        var feedData="SELECT c.feed_id, c.feed_img, c.feed_text, c.feed_date, a.first_name, a.last_name, a.prof_pic_path FROM feed AS c, users AS a WHERE c.user_id = a.id order by c.feed_date DESC"; 
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

