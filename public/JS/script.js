 // Initialize Firebase

 var config = {
     apiKey: "AIzaSyANj7FOcSjM85VPKOHY-TZDJIcuZUHr8jA",
     authDomain: "shaked-nysl-app.firebaseapp.com",
     databaseURL: "https://shaked-nysl-app.firebaseio.com",
     projectId: "shaked-nysl-app",
     storageBucket: "shaked-nysl-app.appspot.com",
     messagingSenderId: "352336538584"
 };
 firebase.initializeApp(config);


 //Creating class for handling transitions and data retrieval.

 function MainHandler() {

     this.teamData = "";
     var that = this;


     //Retrieving data from local JSON file and initializing all methods

     this.init = function() {
         var that = this;
         $.getJSON("../data/teams.json", function(data) {
             that.teamData = data;
             that.getStats();
             that.teamOfTheMonth();

         });
     };


     //Appending league stats to table.

     this.getStats = function() {
         var table = [];
         $.each(this.teamData.teams, function(i, e) {
             var row = $('<tr>');
             row.append($('<td>').text(e.Position));
             var img = $('<img>').attr('src', e.Image);
             row.append($('<td>').html(img));
             row.append($('<td>').addClass('justify_name, team_specific').data('name', e.Name).text(e.Name));
             row.append($('<td>').text(e.Wins));
             row.append($('<td>').text(e.Losses));
             row.append($('<td>').text(e.Wins * 3));
             table.push(row);
         });
         $('#stats_body').append(table);
     };

     //Append leading team from JSON file to HOME page

     this.teamOfTheMonth = function() {
         $.each(this.teamData.teams, function(i, e) {
             if (e.Position === '1') {
                 var img = $('<img>').attr('src', e.Image);
                 $('#teamMonthList').append($('<li>').html(img));
                 $('#teamMonthList').append($('<li>').addClass('enlargeTextTeamMonth').text(e.Name));
             };
         });
     };



     //Event listeners

     //These events do not need to be 

     //Listener for hamburger menu

     $('.navbar-toggler').on('click', function(event) {
         event.preventDefault();
         $(this).closest('.navbar-minimal').toggleClass('open');
     });

     //Show footer on change from LOGIN screen.

     $('#proceed_btn, .home_btn').on('click', function() {
         $('#footer, #new_nav').show('slow');
     });

     //Creating back button for team detail page,
     // using hash function

     $('.team_specific').on('click', function() {
         window.location.hash = "team";
     });

     $('#back_btn').on('click', function() {
         window.history.back();
     });

     window.onhashchange = function() {
         if (window.location.hash === '') {
             $('#teams_detail_page').hide('slow');
             $('#teams_page').show('slow');
         };
     };


     //Method for navigation to chat page, requires own method
     //due to needed Authorization

     $('#messages_btn').on('click', function() {
         if (firebase.auth().currentUser) {
             $('section').slideUp('slow');
             $('#messages_page').slideDown('slow');
             $('body').css('padding-bottom', '8em');
             $('.open').removeClass('open');
         } else {
             alert('You must be logged in to use this feature.');
             $('.open').removeClass('open');
         }
     });

     //Click event for navigation

     $('#teams_btn, #games_btn, .home_btn, #about_btn, #proceed_btn, #login_btn, #register_btn,\
      #next_game, #contact_btn, #rules_btn, #stats_btn').on('click', function() {
         var content = $(this).data('content');
         $('.open').removeClass('open');
         $('body').css('padding-bottom', '4em');
         $('section').slideUp('slow');
         $('#' + content).slideDown('slow');
         $('.iconShine').removeClass('iconShine');
         $(this).addClass('iconShine');
         if (content == 'rules_page' || content == 'games_page' || content == 'about_page') {
             $('body').css('overflow', 'visible');
         } else {
             $('body').css('overflow', 'hidden');
         }
     });


     //Appending team stats to team_detail page, according to team clicked 

     $('.team_specific').on('click', function() {
         $('section').hide('slow');
         var myTeam = $(this).data('name');
         $('#teams_detail_page').show('slow');
         $.each(that.teamData.teams, function(i, e) {
             if (e.Name === myTeam) {
                 $('#detail').html('');
                 $('#team_detail_image').attr('src', e.Image);
                 $('#detail').append($("<li>").text('Name: ' + e.Name));
                 $('#detail').append($("<li>").text('Wins: ' + e.Wins));
                 $('#detail').append($("<li>").text('Losses: ' + e.Losses));
                 $('#detail').append($("<li>").text('Coach: ' + e.Coach));
                 $('#detail').append($("<li>").text('Seniority : ' + e.seniority));
             };
         });
     });
 };

 /*--------------------------------------------------------------------*/

 //Create class for handling everything AUTHENTICATION related.

 function LoginHandler() {

     //Setting  CONST

     this.login = $('#sign-in');
     this.logout = $('#logout');
     this.register = $('#register');
     this.auth = firebase.auth();
     var that = this;
     //Initalize all methods

     this.init = function() {
         this.authStateChange();
     };

     //Monitor for authorization state; Whether user is logged in or not.
     //If yes - etc.
     //If not - etc.

     this.authStateChange = function() {
         var that = this;
         $(document).ready(function() {
             that.auth.onAuthStateChanged(function(user) {
                 if (user) {
                     $('#sign-in').hide();
                     $('#logout').removeClass('hidden');
                     $('#loggedUser').text(user.email);
                     $('#login_page').hide('fast', function() {
                         $('#after_login').show('slow');

                     });
                 } else {
                     $('#sign-in').show();
                     $('#logout').addClass('hidden');
                 }
             });
         });
     };


     //Event listeners


     //Login method

     this.login.on('click', function() {
         const promise = that.auth.signInWithEmailAndPassword($('#email').val(), $('#password').val());
         console.log('logged in');
         promise.catch(e => alert(e.message));
         $('#password, #email').val('');

     });

     //Logout method

     this.logout.on('click', function() {
         that.auth.signOut();
         console.log('logged out');
     });

     //Register method

     this.register.on('click', function() {
         const promise = that.auth.createUserWithEmailAndPassword($('#email').val(), $('#password').val());
         promise.catch(e =>
             alert(e.message));
     });
 };

 /*---------------------------------------------------------------------*/

 //Creating messaging class.

 function Messaging() {

     //Setting VARIABLES

     this.db = firebase.database();
     this.msgPost = $('#post');
     var that = this;

     //Initialize methods

     //Click event for posting messages to firebase DB

     this.msgPost.on('click', function() {
         that.db.ref('posts/').push({ username: firebase.auth().currentUser.email, text: $('#text').val() });
         $('#text').val("");
     });

     //Event listener for new posts sent to DB, and presenting them in HTML.
     // + Making a delete button for each post; HTML and DB.

     this.db.ref('posts/').on('child_added', function(snapshot) {
         var msg = snapshot.val();
         var key = snapshot.key;

         //Create DELETE button

         var deletePost = document.createElement("button");
         deletePost.classList.add('deleteMsgBtn');
         deletePost.textContent = 'Delete';
         deletePost.addEventListener('click', function() {

             //Remove HTML
             this.parentNode.remove();

             //Remove from database
             that.db.ref('posts/' + key).remove();
         });

         //Create elements and append content.

         var msgUsernameElement = document.createElement("b");
         msgUsernameElement.textContent = msg.username;
         var msgTextElement = document.createElement("p");
         msgTextElement.textContent = msg.text;
         var msgElement = document.createElement("div");

         //Append to containing DIV

         msgElement.appendChild(msgUsernameElement);
         msgElement.appendChild(msgTextElement);
         msgElement.appendChild(deletePost);

         msgElement.className = "msg";

         //Append to pre existing HTML <DIV>

         document.getElementById("results").appendChild(msgElement);
     });
 };

 /*----------------------------------------------------------------------*/

//ONE CLASS TO RULE THEM ALL

 function Initializer() {

     this.messaging = new Messaging();
     this.loginHandler = new LoginHandler();
     this.mainHandler = new MainHandler();

     this.init = function() {
         this.mainHandler.init();
         this.loginHandler.init();
     }
 }

 var initializer = new Initializer();
 initializer.init();