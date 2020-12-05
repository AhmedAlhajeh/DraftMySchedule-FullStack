const express = require('express');
const app = express();
app.use(express.json());
const joi = require('joi');
const data = require("./Lab3-timetable-data.json");
const low = require('lowdb');
const filesync = require('lowdb/adapters/FileSync');
const adapter = new filesync('schedule_database.json');
const db = low(adapter);
const regexCharacters = /^[^<>:/?#@!&;]*$/;
var cors = require('cors');
const { EDESTADDRREQ } = require('constants');
app.use(cors());
const encryption = require('bcrypt');
const adapter2 = new filesync('UserInformation.json');
const UserInformation = low(adapter2);
var Body_Parser = require('body-parser');
app.use(Body_Parser.urlencoded({extended: false}));
app.use(Body_Parser.json());
const jwt = require('jsonwebtoken');
const adapterToken = new filesync('Tokens.json');
const Tokens = low(adapterToken);
const String_Sim = require('string-similarity');


const AdminToken = 'LRnozVHim9pOVkc6ZlJK'
const AccessToken = 'J9TpdgIfqAbJ8kpbMnPc'
const RefreshingToken = '76a7FmxkwYFKDSrTAlku'

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.use(express.static('dist/lab4')); 


// Database 
db.defaults({schedules: []})
.write()

UserInformation.defaults({UserInfo: []})
.write()

Tokens.defaults({tokens: []}).write()

// to show the results to the frontend when I press search
app.get('/api/courses/submit' , (req,res) => {
    FQuery = req.query;
    SubjectQuery = FQuery.Subject;
    ComponentQuery = FQuery.Component;
    CourseNumberQuery = FQuery.CourseNumber.toUpperCase();
    
    //if we are showing the results for all subjects, components, course number, and class name
    if (SubjectQuery == "Subject" && CourseNumberQuery == "" && ComponentQuery== "Component"){
        res.send({message: "Too many results to display."})
    }
    //if we choose a specific subject, course number, component and class name
    else if (SubjectQuery != "Subject" && CourseNumberQuery != "" && ComponentQuery != "Component" ){
         let allstored = [];
        for(i=0; i<data.length;i++){
            //we can search by 3316 and 3316A
            let coursecodeCheck = data[i].catalog_nbr.toString();
            if(!isNaN(CourseNumberQuery)) {
            coursecodeCheck = coursecodeCheck.replace(/\D/g,'');
            }
    
            if(SubjectQuery == data[i].subject && CourseNumberQuery == coursecodeCheck && ComponentQuery== data[i].course_info[0].ssr_component){
             
                allstored.push(data[i]);

            }
        } res.send(allstored);
    } 
    //if we wanna display the results by selecting subject and course number only
    else if (SubjectQuery != "Subject" && CourseNumberQuery != "" && ComponentQuery == "Component"){
         let allstored = [];
        for(i=0 ; i<data.length; i++){
            let coursecodeCheck = data[i].catalog_nbr.toString();
            if(!isNaN(CourseNumberQuery)) {
            coursecodeCheck = coursecodeCheck.replace(/\D/g,'');
            }
            if(SubjectQuery == data[i].subject && CourseNumberQuery == coursecodeCheck){
                allstored.push(data[i]);
            }
        } res.send(allstored);
    }
    //if we wanna display the results using Subject only
    else if (SubjectQuery != "Subject" && CourseNumberQuery == "" && ComponentQuery == "Component"){
         let allstored = [];
        for(i=0 ; i<data.length; i++){
            if(SubjectQuery == data[i].subject ){
                allstored.push(data[i]);
            }
        } res.send(allstored);

    }
    //if we want to to display results using course number only
    else if (SubjectQuery=="Subject" && CourseNumberQuery != "" && ComponentQuery=="Component"){
        let allstored = [];
        for(i=0; i<data.length; i++){
            let coursecodeCheck = data[i].catalog_nbr.toString();
            if(!isNaN(CourseNumberQuery)) {
            coursecodeCheck = coursecodeCheck.replace(/\D/g,'');//just to make sure wa can search using 3316 or 3316a/A
            }
            if(CourseNumberQuery == coursecodeCheck){
                allstored.push(data[i]);
            }
        }
        res.send(allstored);
    }
    else if (SubjectQuery=="Subject" && CourseNumberQuery == "" && ComponentQuery !="Component"){
        res.send({
            message: "Do not search by component only."  //send back a message saying that you cannot search by component only 
        })
    }
    }
    )






//Get all available subject codes (property name: subject) and descriptions (property name: className)
function removeDuplicates(Array){
    return Array.filter((a,b) => Array.indexOf(a) === b) //no duplicates for the drop menu in front end
};
//show all the results of subjects and class names in the following link
app.get('/api/courses', (req,res) => {
    let SubjectArray = [];
    for(i=0; i< data.length; i++){
        SubjectArray[i] = data[i].subject;
    }
    

    SubjectArray = removeDuplicates(SubjectArray);

    let ClassArray = [];
    for(j=0; j< data.length; j++){
        ClassArray[j] = data[j].className;
    }
    

    ClassArray = removeDuplicates(ClassArray);
    res.send({"SubjectArray": SubjectArray,"ClassArray": ClassArray});

    

   
        
});


//Get all course codes (property name: catalog_nbr) for a given subject code. Return an error if the subject code doesn’t exist
app.get('/api/courses/search/:subjectcode', (req,res) => {
    let subjectcode = req.params.subjectcode;
    let NumberArray = [];
    for(k=0; k< data.length; k++){
        if (subjectcode == data[k].subject){
            NumberArray.push(data[k].catalog_nbr);
        }
        
    }
    //no duplicating for the frond end part
    NumberArray = removeDuplicates(NumberArray);
    if(NumberArray.length <= 0){
        res.status(404).send("Subject code does not exist");
    }else {
        res.send(NumberArray);
    }

    
});


//show results by searching course code only
app.get('/api/courses/searching/:coursecode', (req,res) => {
    let coursecode = req.params.coursecode.toUpperCase();
    let NumberArray = [];
    for(k=0; k< data.length; k++){
        
        if (coursecode == data[k].catalog_nbr){
            NumberArray.push(data[k]);
        }
        
    }
    //no duplicating for the frond end part
    NumberArray = removeDuplicates(NumberArray);
    if(NumberArray.length <= 0){
        res.status(404).send("Course Number does not exist");
    }else {
        res.send(NumberArray);
    }

    
});




//Get the Timetable entry for a given subject code and course code and optional component
app.get('/api/courses/search/:subjectcode/:coursecode', (req,res) => {

   // we are making sure the inputs should be maximum three and minimum three for the component and one query only
    const WithComponent = joi.object({
        component:joi.string().max(3).min(3)
    })
    const RESULT4 = WithComponent.validate(req.query);
    if (RESULT4.error ){
        res.status(400).send("Bad Query");
        return; 

    }
    let subjectcode = req.params.subjectcode;
    let coursecode = req.params.coursecode;
    let component = req.query.component;
    
    for(o=0; o< data.length; o++){
        if (subjectcode == data[o].subject && coursecode == data[o].catalog_nbr){
            if(!component){
                res.send(data[o]);
                return;

            }
            //if there is a component then show component 
            else if(component == data[o].course_info[0].ssr_component){
                res.send(data[o]);
                return;

            }

        }
        
    }

    res.status(404).send("not found");
    

    
});

//Create a new schedule (to save a list of courses) with a given schedule name. Return an error if name exists
app.post('/api/schedules/createschedule' ,(req,res) => {
    //the input should be at least one character for the name of the schedule 
    let schema = joi.object({
        name:joi.string().max(18).min(1).regex(regexCharacters).required(),
        description:joi.string().max(50).regex(regexCharacters),
        ScheduleToken: joi.string().required()//we want to make sure the user can only see his/her schedules

    })
    let RESULT = schema.validate(req.query);
    if (RESULT.error){
        res.send({message: "Bad Query"});
        return; 

    }
    CurrentData =req.query.name;
    CurrentDescription = req.query.description;
    //Verify schedule token
    let userData = {};
    let ScheduleToken= req.query.ScheduleToken;
    try {
        userData = jwt.verify(ScheduleToken, AccessToken);
    } catch(err) {
        res.send("Not allowed");
        return;
    }

    let ScheduleOwner = userData.UserName;
    let EmailOwner = userData.Email;
    let count = 0;
    let ListOfSchedule = db.get('schedules').value();
    for(let i =0; i< ListOfSchedule.length ; i++){
        if(ListOfSchedule[i].Email == EmailOwner){
            count++;
        }
    }  
    


    //if the schedule name is already exist
    if (db.get('schedules').find({scheduleName: CurrentData, Email: EmailOwner}).value()){
    return res.send({message: "The schedule name is already exist"});
    } 
    else if (count == 20){
        res.send({message: 'You cannot add more than 20 schedules'});
    }
    else  {

    db.get('schedules')
    .push({ scheduleName: CurrentData, scheduleDescription: CurrentDescription, Email: EmailOwner, scheduleowner: ScheduleOwner, Visiblity: "Private", CourseList: []})
    .write()

    return res.send({message: "schedule added"});
   }    
});
 



//Save a list of subject code, course code pairs under a given schedule name
app.put('/api/schedules/addCourse', (req, res) => {
    const QuerySchema = joi.object({
        scheduleName:joi.string().max(18).regex(regexCharacters).required()
    })
    const RESULT1 = QuerySchema.validate(req.query);
    if (RESULT1.error){
        res.status(400).send("Bad Query");
        return; 

    }
    //if the course list is not entered as an array
    const BodySchema = joi.object({
        CourseList:joi.array().required()
    })
    const RESULT2 = BodySchema.validate(req.body);
    if (RESULT2.error){
        res.status(400).send("Bad Entry");
        return; 

    }
    
    const name = req.query.scheduleName;
    const scheduleCourses = req.body.CourseList;
    let schedules = db.get('schedules').find({scheduleName: name}).value();
    if(schedules) {
      schedules.CourseList = scheduleCourses;
      db.set({schedules: schedules}).write();
      res.send("The values are saved to the schedule");
    } else {
      res.status(404).send("not saved yet!");
    }
  });

  app.put('/api/schedules/updating', (req,res) => {
const QuerySchema = joi.object({
        scheduleName:joi.string().max(18).regex(regexCharacters).required(),
        subject:joi.string().max(18).regex(regexCharacters).required(),
        CourseNumber:joi.string().max(5).min(5).regex(regexCharacters).required()
    })
    const RESULT1 = QuerySchema.validate(req.query);
    if (RESULT1.error){
        res.send("Bad Query");
        return; 

    }
    const name = req.query.scheduleName;
    const subject = req.query.subject;
    const course = req.query.CourseNumber;
    let schedules = db.get('schedules').find({scheduleName: name}).value();
    if(schedules) {
        let alreadyExists = false;
        for(i = 0; i < schedules.CourseList.length; i++) {
        if(schedules.CourseList[i].subject == subject && schedules.CourseList[i].catalog_nbr == course) {
        alreadyExists = true;
        break;
        }
        }
        if(alreadyExists){
            res.send("This course is already exist!");
            return;
        }
      schedules.CourseList.push({"subject":subject,"catalog_nbr":course});
      db.set({schedules: schedules}).write();
      res.send("The values are saved to the schedule");
    } else {
      res.send("not saved yet!");
    }


})

  //Get the list of subject code, course code pairs for a given schedule
  app.get('/api/schedules/ShowCourses', (req,res) => {
    //making sure we entered the name of the schedule (not empty string)
    const showschema = joi.object({
        name:joi.string().max(18).min(1).required()
    })
    const RESULT69 = showschema.validate(req.query);
    if (RESULT69.error){
        res.status(400).send("Bad input");
        return; 

    }

    const ShowList = req.query.name;
    //find the course list of the specific shcedule
    if (db.get('schedules').find({scheduleName: ShowList}).value()){
        res.send (db.get('schedules').find({scheduleName: ShowList}).value().CourseList); 
    }
    else{
        res.send("not found")
    }
  })
  

//Delete a schedule with a given name. Return an error if the given schedule doesn’t exist
app.delete('/api/schedules', (req,res) => {
    
    const QuerySchema55 = joi.object({
        name:joi.string().max(18).min(1).required()
    })
    const RESULT55 = QuerySchema55.validate(req.query);
    if (RESULT55.error){
        res.status(400).send("Bad Query");
        return; 

    }
     CurrentData = req.query.name;
    

      if(db.get('schedules').find({scheduleName: CurrentData}).value()) {
        db.get('schedules').remove({scheduleName: CurrentData}).write()
        res.status(200).send({ message: "The selected schedule has been deleted"});
         
        }
    //if the schedule does not exist
    else {
        return res.status(404).send("The schedule name is not found ");
    }
});

//Get a list of schedule names and the number of courses that are saved in each schedule.
app.get('/api/schedules/schedulesList', (req,res) => {
    let schema = joi.object({
        ScheduleToken: joi.string().required()

    })
    let RESULT = schema.validate(req.query);
    if (RESULT.error){
        res.send({message: "Bad Query"});
        return; 

    }
   
    //Verify schedule token
    let userData = {};
    let ScheduleToken= req.query.ScheduleToken;
    try {
        userData = jwt.verify(ScheduleToken, AccessToken);
    } catch(err) {
        res.send("Not allowed");
        return;
    }   
        let ScheduleArray = [];
        let ReturnArray = [];
        ScheduleArray = db.get('schedules').value();
        for(let i =0; i < ScheduleArray.length; i++){
            if(ScheduleArray[i].Email == userData.Email){
                ReturnArray.push(
                    ScheduleArray[i].scheduleName
                )
            }
            

        }
        
        res.send(ReturnArray);
    
});

//Delete all schedules
app.delete('/api/schedules/all' , (req,res) =>{
db.unset("schedules").write(); //it delets all schedules
db.defaults({schedules: []}).write() //restart the system to make sure we can accept new schedule name
res.send({message: "All schedules have been deleted successfully "})

})

//Register lab5
app.post('/register', async(req,res) => {
    CurrentPasswordData = req.body.Password
    //we are trying to encrypt the passwprd for privacy and cyber attack
    const hashing = await encryption.genSalt();
    const protect = await encryption.hash(CurrentPasswordData, hashing);
    const registeration = {
        UserName: req.body.UserName,
        Email: req.body.Email,
        Password: protect,
        Verification: "Inactive"
    }
    CurrentData2 =req.body.Email;
    RegisterResult = UserInformation.get('UserInfo').find({Email: CurrentData2}).value()
    //if the Email is already exist
    if (RegisterResult){
        
     res.send({message: 'The email is already exist!'});
     return;
     
    } else {
        if(validateEmail(CurrentData2)){

            UserInformation.get('UserInfo').push(registeration).write()
            res.send({message:'You have been registered!'});
             return;
        }else{
            res.send({message:"Bad Email"})
            return;
        }
        
    
   }
   
})
//Verification
var storage1 = [];
app.put('/verification', (req,res) => {
    CurrentData3 = req.body.Email
    storage1 = UserInformation.get('UserInfo').find({Email: CurrentData3}).assign({Verification:"Active"}).write()
    res.status(200).send({message: 'Verified'})
})


// Validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(re);
}



//Tokens will expire after 69 minutes
function generateAdministratorToken(LogginIn){
    return jwt.sign(LogginIn, AdminToken, { expiresIn: '69m'})
}

function generateToken(Storage2){
    return jwt.sign(Storage2, AccessToken, { expiresIn: '69m'})
}




//Login
app.post('/login', async (req,res) =>{
    const LoginEmail = req.body.Email;
    const LoginPassword = req.body.Password;

    if(!LoginEmail || !LoginPassword){
        return res.send({message: 'You should put your email and password'})
    }
    const ShowResult = validateEmail(LoginEmail);

    if(!ShowResult){
        return res.send({ message: 'Please put a valid email'})
    }
    //Admin UserName and Password
    const AdminEmail = "AhmedAlhajeh@uwo.ca";
    const AdminPassword = "se3316lab5";

    if (LoginEmail == AdminEmail && LoginPassword == AdminPassword){
        let LogginIn = {
            LoginEmail,
            LoginPassword,
            UserName: "Administrator"
          };

          try {
              const AdministratorToken = generateAdministratorToken(LogginIn);
              const AdminRefreshToken = jwt.sign(LogginIn, AdminToken);
              Tokens.get('tokens').push({AdminRefreshToken: AdminRefreshToken}).write();
              return res.send({
                AccessingToken: AdministratorToken, //Should be AccessToken for the first part??
                RefreshingToken: AdminRefreshToken,
                UserName: LogginIn.UserName,
                message: 'Administrator'
              })
            } catch{
                return res.send({
                message: 'Cannot login'
              })


          }

    }
    //log in functionality for other users
    const Storage2 = UserInformation.get('UserInfo').find({ Email: LoginEmail }).value();
    
    if (Storage2 == null) {
        return res.send({
            message: 'Email Not Found'
        })
    }

    else if (Storage2.Verification == "Inactive") {
     res.send({ message: 'Account Inactive, Contact Administrator' });
     return;
    } 
    else if (Storage2.Verification == "Deactivated"){
        return res.send({message: 'You cannot login. Your account is deactivated'});
    }
    
    
        encryption.compare(LoginPassword, Storage2.Password, function(err, comparison) {
            if(!err){
                if (comparison) {           
                    const AccessingToken = generateToken(Storage2); // Login successful, so make access token
                    const RefreshToken = jwt.sign(Storage2, RefreshingToken); // Refresh token to make new access tokens     
                    Tokens.get('tokens').push({ RefreshingToken: RefreshToken }).write(); // Insert refresh token into persistent database     
                    res.send({
                        AccessingToken: AccessingToken,
                        RefreshingToken: RefreshToken,
                        UserName: Storage2.UserName,
                        Email: Storage2.Email,
                        message: 'You have been successfully logged in'
                    })
                } else {
                    return res.send({
                        message: 'Wrong Password'
                    })
                }

            }
            else{
                return res.send({
                    message: 'Unable to login'
                })
            }
        });
        
})

    //Deactivation the user
    app.put('/deactivation', (req,res) => {
        deactivation = req.body.Email;
        User_Deactivation = UserInformation.get('UserInfo').find({Email: deactivation}).assign({Verification: "Deactivated"}).write();
        res.send({message: 'Deactivated'});
    })

    //Reactivation the user
    app.put('/reactivation', (req,res) => {
        reactivation = req.body.Email;
        User_Reactivation = UserInformation.get('UserInfo').find({Email: reactivation}).assign({Verification: "Active"}).write();
        res.send({message: 'Reactivated'});
    })

    //public
    app.put('/public', (req,res) => {
        public = req.body.ScheduleName
        SchedulePublic = db.get('schedules').find({scheduleName: public}).assign({Visibility: "Public"}).write();
        res.send({message: 'Public'});

    })
    //private
    app.put('/private', (req,res) => {
        private = req.body.ScheduleName
        SchedulePrivate = db.get('schedules').find({scheduleName: private}).assign({Visibility: "Private"}).write();
        res.send({message: 'Private'});
        
    })

    //Search by keywords
    app.get('/keywords', (req,res) => {
        keyword = req.query.keyword.toUpperCase();
        let Keyword1Array = [];
        for(i=0; i< data.length; i++){
            let NameID = data[i].className;
            let catalog = data[i].catalog_nbr.toString();
            let NameSim = String_Sim.compareTwoStrings(NameID, keyword);
            let CatalogSim = String_Sim.compareTwoStrings(catalog, keyword);
            if(NameSim >= 0.55 || CatalogSim >= 0.55){ //0.55 is reasonable number for two characters difference 
                Keyword1Array.push(data[i]);

            }

        }
        
        if(Keyword1Array.length == 0){
            res.send({ message: "no search results found"});
        }
        else{
            res.send(Keyword1Array);
        }


    })
    //Show all users list for the admin
    app.get('/usersList', (req,res) => {
           
        let UserArray = [];
        UserArray = UserInformation.get('UserInfo').value();
        
        
       
        res.send(UserArray);
    
});
//updating the password
app.put('/updatepassword', async (req,res) => {

    let userData = {};
    let PasswordToken= req.body.ScheduleToken;
    try {
        userData = jwt.verify(PasswordToken, AccessToken);//we have to verify the password token with the access token so we can update the password for the logged in user
    } catch(err) {
        res.send("Not allowed");
        return;
    }

    // encrypt the new password for that specific user
    const hashing = await encryption.genSalt();
    const protect = await encryption.hash(req.body.Password, hashing);
    
    if(UserInformation.get('UserInfo').find({Email: userData.Email})){
        UserInformation.get('UserInfo').find({Email: userData.Email}).assign({Password: protect}).write();
        res.send({message: 'You Password has been updated'});
    }
    else{
        res.send({message: 'The user not found'});
    }



})













app.listen(3000, () => console.log('Listening on port 3000'));