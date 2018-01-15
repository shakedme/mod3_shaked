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

        });
    };

    //Appending league stats to table.

    this.getStats = function() {
        var table = [];
        $.each(this.teamData.teams, function(i, e) {
            var row = $('<tr>');
            row.append($('<td>').text(e.Position));	
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
        $('nav ul li, #register_btn, #next_game, #register_btn_top, #contact_btn').on('click', function() {
            $('section').hide();
            var content = $(this).data('content');
            $('#' + content).show();
        });
    };

    //Appending team stats to team_detail page, according to team clicked 

    this.teamsNav = function() {
    	var that = this;
        $('.team_specific').on('click', function() {
            $('section').hide();
            var myTeam = $(this).data('name');
            $('#teams_detail_page').show();
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