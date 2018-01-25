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

 /*document.addEventListener('DOMContentLoaded', function() {
     // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
     // The Firebase SDK is initialized and available here!
     
     
 // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

      try {
          let app = firebase.app();
          let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');

      } catch (e) {
          console.error(e);
      }
  });*/



 //Creating class

 function MainHandler() {

     this.teamData = "";

     //Retrieving data from local JSON file

     this.getData = function() {
         var that = this;
         $.getJSON("../data/teams.json", function(data) {
             that.teamData = data;
             that.getStats();
             that.bottomNav();
             that.teamsNav();
             that.backButton();
             that.footerShow();
             that.chatNav();
             that.teamOfTheMonth();
         });
     };

     //Show footer on change from LOGIN screen.

     this.footerShow = function() {
         $('#proceed_btn, .home_btn').on('click', function() {
             $('#footer, #new_nav').show('slow');
         });
     };

     //Creating back button for team detail page,
     // using hash function

     this.backButton = function() {
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

     this.chatNav = function() {
         $('#chat_btn_bottom').on('click', function() {
             if (firebase.auth().currentUser) {
                 $('section').slideUp('slow');
                 $('#messages_page').slideDown('slow');
                 $('body').css('padding-bottom', '7.5em');
             } else {
                 alert('You must be logged in to use this feature.');
             }

         });
     };

     //Click event for navigation

     this.bottomNav = function() {
         $('#teams_btn, #messages_btn, #games_btn, .home_btn, #about_btn, #proceed_btn, #login_btn, #register_btn, #next_game, #contact_btn, #rules_btn, #stats_btn').on('click', function() {
             var content = $(this).data('content');
             $('body').css('padding-bottom', '4em');
             $('section').slideUp('slow');
             $('#' + content).slideDown('slow');
         });
     };


     //Appending team stats to team_detail page, according to team clicked 

     this.teamsNav = function() {
         var that = this;
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
 };

 //Creating instance of Class DataHandler

 var mainHandler = new MainHandler();

 mainHandler.getData();


 //Setting  CONST

 const login = $('#sign-in');
 const logout = $('#logout');
 const register = $('#register');
 const auth = firebase.auth();


 //Create class for handling all auth related

 function LoginHandler() {

     //Initalize all methods
     this.init = function() {
         this.signin();
         this.signout();
         this.signup();
         this.authStateChange();
     };

     //Login method

     this.signin = function() {
         login.on('click', function() {
             const promise = auth.signInWithEmailAndPassword($('#email').val(), $('#password').val());
             console.log('logged in');
             promise.catch(e => alert(e.message));
             $('#password, #email').val('');

         });
     };

     //Logout method

     this.signout = function() {
         logout.on('click', function() {
             auth.signOut();
             console.log('logged out');
         });
     };

     //Register method

     this.signup = function() {
         register.on('click', function() {
             const promise = auth.createUserWithEmailAndPassword($('#email').val(), $('#password').val());
             promise.catch(e =>
                 alert(e.message));
         });
     };


     this.authStateChange = function() {
         $(document).ready(function() {
             auth.onAuthStateChanged(function(user) {
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
 };


 //Create instance of LoginHandler

 var loginHandler = new LoginHandler();
 loginHandler.init();


 //Creating messaging


 var db = firebase.database();
 var text = $('#text').val();
 var post = $('#post');

 post.on('click', function() {
     db.ref('posts/').push({ username: firebase.auth().currentUser.email, text: $('#text').val() });
     $('#text').val("");
 });


 /** Function to add a data listener **/
 var startListening = function() {
     db.ref().on('child_added', function(snapshot) {
         var msg = snapshot.val();
         var key = snapshot.key;

         var deletePost = document.createElement("button");
         deletePost.classList.add('deleteMsgBtn');
         deletePost.textContent = 'Delete';
         deletePost.addEventListener('click', function() {
             this.parentNode.remove();
             db.ref(key).remove();
         });

         var msgUsernameElement = document.createElement("b");
         msgUsernameElement.textContent = msg.username;
         var msgTextElement = document.createElement("p");
         msgTextElement.textContent = msg.text;

         var msgElement = document.createElement("div");
         msgElement.appendChild(msgUsernameElement);
         msgElement.appendChild(msgTextElement);
         msgElement.appendChild(deletePost);

         msgElement.className = "msg";
         document.getElementById("results").appendChild(msgElement);
     });
 }

 // Begin listening for data
 startListening();

 function Messages() {

     this.bodyPadding = function() {
         if ($('#messages_page').css('display', 'block')) {

         }
     };
 };

 $('.navbar-toggler').on('click', function(event) {
     event.preventDefault();
     $(this).closest('.navbar-minimal').toggleClass('open');
 });