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

        });
    };

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


    //Click event for navigation

    this.bottomNav = function() {
        $('#footer span, #about_btn, #nysl_logo, #register_btn, #next_game, #register_btn_top, #contact_btn, #rules_btn').on('click', function() {
            var content = $(this).data('content');
            $('section').hide('slow');
            $('#' + content).show('slow');
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