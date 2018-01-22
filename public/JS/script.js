/* // Initialize Firebase
 var config = {
     apiKey: "AIzaSyANj7FOcSjM85VPKOHY-TZDJIcuZUHr8jA",
     authDomain: "shaked-nysl-app.firebaseapp.com",
     databaseURL: "https://shaked-nysl-app.firebaseio.com",
     projectId: "shaked-nysl-app",
     storageBucket: "",
     messagingSenderId: "352336538584"
 };
 firebase.initializeApp(config);*/

 /*document.addEventListener('DOMContentLoaded', function() {
     // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
     // The Firebase SDK is initialized and available here!
     
     firebase.auth().onAuthStateChanged(user => { });
     firebase.database().ref('/path/to/ref').on('value', snapshot => { });
     firebase.messaging().requestPermission().then(() => { });
     firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
     */
     // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
/*
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
             that.teamOfTheMonth();
         });
     };

     this.footerShow = function() {
         $('#register_btn, #proceed_btn, #login_btn').on('click', function() {
             $('#footer').show('slow');
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


     this.teamOfTheMonth = function() {
         $.each(this.teamData.teams, function(i, e) {
             if (e.Position === '1') {
                 var img = $('<img>').attr('src', e.Image);
                 $('#teamMonthList').append($('<li>').html(img));
                 $('#teamMonthList').append($('<li>').addClass('bigger').text(e.Name));
             };
         });
     };

     //Click event for navigation

     this.bottomNav = function() {
         $('#teams_btn, #games_btn, #home_btn, #about_btn, #proceed_btn, #login_btn_bottom, #nysl_logo, #register_btn, #next_game, #contact_btn, #rules_btn, #stats_btn').on('click', function() {
             var content = $(this).data('content');
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