// Character constructor
class Character {
  constructor(name) {
    // Properties for the character
    this.name = name;
    this.health = 100;
    this.status = "Good";
    this.illness = [];
  }
  // Prototype method for displaying character health bars
  healthBar() {
    var pairs = { Good: "#28a745", Fair: "#f0ad4e", Poor: "#d9534f", Dead: "black" };

    // Display health bars and set their styles
    $("#char1-health-bar").progressbar({ value: char1.health });
    $("#char1-health-bar .ui-widget-header").css("background", pairs[char1.status]).css("border-color", pairs[char1.status]);
    $("#char2-health-bar").progressbar({ value: char2.health });
    $("#char2-health-bar .ui-widget-header").css("background", pairs[char2.status]).css("border-color", pairs[char2.status]);
    $("#char3-health-bar").progressbar({ value: char3.health });
    $("#char3-health-bar .ui-widget-header").css("background", pairs[char3.status]).css("border-color", pairs[char3.status]);
    $("#char4-health-bar").progressbar({ value: char4.health });
    $("#char4-health-bar .ui-widget-header").css("background", pairs[char4.status]).css("border-color", pairs[char4.status]);
  }
  // Prototype method for generating character illnesses
  illnessGenerator() {
    var num = Math.floor(Math.random() * Math.floor(80));

    // Generate and display various illnesses
    if (num === 1 && this.illness.includes("Dysentery") == false) {
      this.illness.push("Dysentery");
      $(".ongoing-events").prepend(this.name + " got Dysentery (IT’S STILL A THING, PEOPLE). <br><br><br>");
    } else if (num === 2 && this.illness.includes("Alcohol Poisoning") == false) {
      this.illness.push("Alcohol Poisoning");
      $(".ongoing-events").prepend(this.name + " tried a mystery shot from the creatives' bar cart. <br><br><br>");
    } else if (num === 3 && this.illness.includes("Bloating") == false) {
      this.illness.push("Bloating");
      $(".ongoing-events").prepend(this.name + " has to wait in line for the restroom. <br><br><br>");
    } else if (num === 4 && this.illness.includes("Lost") == false) {
      this.illness.push("Lost");
      $(".ongoing-events").prepend(this.name + " got lost on a hot girl walk with Shelby. <br><br><br>");
    } else if (num === 5 && this.illness.includes("Mauled") == false) {
      this.illness.push("Mauled");
      $(".ongoing-events").prepend(this.name + " got attacked by an army of feral cats. <br><br><br>");
    }
  }
}

// Wagon/inventory constructor
class Wagon {
  constructor() {
    // Properties for the wagon and inventory
    this.food = 300;
    this.gas = 40;
    this.days = 0;
    this.characters = [];
    this.awards = 10;
    this.distance = 0;
    this.hunted = 0;
    this.completed = 0.01;
  }
  // Prototype method for checking resources in the wagon
  resourceChecker() {
    if (this.food <= 0) {
      this.food = 0;

      // Reduce health of characters if food runs out
      wagon.characters.forEach(function (char) {
        char.health -= 10;
      });
    }
    if (this.award <= 0) {
      this.award = 0;
    }
  }
  //Checks for illness, status changes, and character death
  statusAdjuster() {
    wagon.characters.forEach(function (char) {
      if (char.illness.length === 1) {
        char.health -= 2;
      } else if (char.illness.length === 2) {
        char.health -= 4;
      } else if (char.illness.length >= 3) {
        char.health -= 6;
      }

      if (char.health >= 80) {
        char.status = "Good";
      } else if (char.health < 80 && char.health >= 20) {
        char.status = "Fair";
      } else if (char.health < 20 && char.health > 0) {
        char.status = "Poor";
      } else {
        char.status = "Unresponsive";
      }
      char.healthBar();

      if (char.health <= 0) {
        var index = wagon.characters.indexOf(char);
        wagon.characters.splice(index, 1);
        char.status = "Unresponsive";
      }
    });

    if (wagon.characters.length <= 0) {
      buildEndModal("unresponsive", "death", "Play Again");
      $(".button-content").prepend("You didn't make it . ");
      $("#myModal").toggle();
    } else if (wagon.gas <= 0) {
      buildEndModal("unresponsive", "death", "Play Again");
      $(".button-content").prepend("You ran out of gas before you could make it to the destination! Game Over! ");
      $("#myModal").toggle();
    }
  }
  //calculates potential illnesses
  turn() {
    this.hunted = 0;
    wagon.eventGrabber();
    wagon.characters.forEach(function (char) {
      char.illnessGenerator();
    });
    wagon.statusAdjuster();
    if (wagon.food > 0) {
      wagon.food -= (wagon.characters.length * 5);
    } else if (wagon.food <= 0) {
      wagon.food = 0;
    }
    this.days += 1;
    this.distance += 1;
    this.gas -= 0.5;
    landmarkEvent();

    if (this.distance > 5) {
      $("#wagon-old-building").hide();
    }

    if (this.distance > 11) {
      $("#wagon-new-building").show();
    }

    // This allows the progress bar to become 100% after 17 clicks
    this.completed = (this.completed + 5.88235294118);
    journey(this.completed);
    wagon.resourceChecker();
  }

  // function for resting -- cure illness, gain some health
  rest() {
    wagon.characters.forEach(function (char) {
      char.illness.splice(0, 1);
      if (char.health < 99) {
        char.health += 2;
      }
    });
    wagon.statusAdjuster();
    wagon.food -= (wagon.characters.length * 5);
    this.days += 1;
    wagon.resourceChecker();
  }
  // Event grabber for the Wagon prototype
  eventGrabber() {
    var num = Math.floor(Math.random() * Math.floor(100));

    // Check if specific distances trigger events
    if (this.distance === 4 || this.distance === 8 || this.distance === 12 || this.distance === 15 || this.distance === 17) {
      // Handle special events at certain distances
    } else if (num >= 80) {
      positiveEvent(); // Call positive event
    } else if (num < 80 && num >= 40) {
      negativeEvent(); // Call negative event
    } else if (num < 40 && num >= 35) {
      deathEvent(); // Call death event
    }
  }
  buildScore() {
    var finalScore = 10000;
    finalScore -= ((this.days - 50) * 20) + ((5 - this.characters.length) * 2000) - (this.food * .2) - (this.gas * .3) - (this.awards * .1);
    return finalScore.toFixed();

  }
  // //Hunting
  huntingTime() {
    var hunt = Math.floor(Math.random() * Math.floor(150));
    if (this.hunted == 1) {
      var num = 1;
      document.getElementById('award-fire').play();
      buildModal(num);
      $(".ongoing-events").prepend("You have already hunted. You must continue to a new area to hunt further.<br><br><br>");
    } else if (this.hunted == 0 && wagon.awards > 0) {
      this.food += hunt;
      this.awards -= 1;
      wagon.statusAdjuster();
      this.hunted += 1;
      $(".ongoing-events").prepend("You got " + hunt + " Tacos. Rest to regain health. <br><br><br>");
      document.getElementById('award-fire').play();
    }

    if (hunt === 0) {
      buildModal("huntFail");
      $(".ongoing-events").prepend("You came back empty handed. Your team resents you.<br><br><br>");
      $("#myModal").toggle();
    }

    if (wagon.awards <= 0) {
      wagon.awards = 0;
    }
    $('#wagon-awards-remaining').text(wagon.awards);
  }
  //team checker
  team(input) {
    if (input == 1) {
      this.gas += 500;
    } else if (input == 2) {
      this.gas += 300;
    } else if (input == 3) {
      this.food += 500;
    } else if (input == 4) {
      this.food += 250;
      this.gas += 250;
    } else if (input == 5) {
      this.gas += 400;
      this.food += 100;
    } else if (input == 6) {
      this.gas += 50;
    }
  }
}







function journey(dist) {
  $("#progressbar").progressbar({
    //distance
    value: dist
  });
}




// Random positiveEvent
function positiveEvent() {
  var num = Math.floor(Math.random() * Math.floor(5));
  var ranSupplyIncrease = Math.floor(Math.random() * (200 - 100) + 100);

  if (num === 1 && wagon.gas >= 10) {
    $('.ongoing-events').prepend('Lisa ran out of diet coke on the way to the new office! You must make a pit stop to pick up another case. <br><br><br>');
    wagon.gas -= 10
    // Modify wagon attributes
  } else if (num === 2) {
    $('.ongoing-events').prepend('Hooray! You found a missing GI Joe doll that was lost in the moving process! All attributes increased! <br><br><br>');
    // Modify wagon attributes
    wagon.awards += 5
    wagon.food += 100
    wagon.gas += 10
  } else if (num === 3) {
    $('.ongoing-events').prepend('Eric gets hungry and convinces the rest of the Lunch Bunch to stop at Iaria’s Italian Restaurant. Tacos increased by ' + 30 + '. <br><br><br>');
    // Modify wagon attributes
    wagon.food += 30
  } else if (num === 4) {
    $('.ongoing-events').prepend('Nicholas forgot his dog Sofie at the old office. Arrival is delayed. Gas decreased by ' + 10 + '. <br><br><br>');
    // Modify wagon attributes
    wagon.gas -= 10
  } else if (num === 5) {
    $('.ongoing-events').prepend('You are stuck in traffic and someone starts a discussion on the latest SCOTUS decision. Arrival is delayed by 5 blocks. <br><br><br>');
    // Modify wagon attributes
    wagon.days += 5
  }
}

//random negativeEvent
function negativeEvent() {
  var num = Math.floor(Math.random() * Math.floor(5))
  var ranSupplyDecrease = Math.floor(Math.random() * (200 - 100) + 100)
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  if (num === 1) {
    $(".ongoing-events").prepend("Your party takes a chance on Joe's ominous food bowl. Unfortunately you got food poisoning. <br><br><br>")
    wagon.characters.health -= 10
  } else if (num === 2) {
    $(".ongoing-events").prepend("Your party is ambushed by NERF GUN BANDITS! They hold you hostage and take some of your Tacos. " + wagon.characters[index].name + " got hurt! <br><br><br>")
    wagon.food -= ranSupplyDecrease
    wagon.characters[index].health -= 15

  } else if (num === 3 && wagon.addie > 10) {
    $(".ongoing-events").prepend(+ ranSupplyDecrease + " of your addies are gone because " + wagon.characters[index].name + " used them to play Jenga. <br><br><br>")
    wagon.addie -= ranSupplyDecrease
    wagon.characters[index].health = 100
    $('.wagon-food-remaining').text(wagon.food.toFixed(2));
  } else if (num === 4) {
    $(".ongoing-events").prepend("You caught a flat tire! Your party loses 5 blocks. <br><br><br>")
    wagon.days += 5
  } else if (num === 5) {
    $(".ongoing-events").prepend("Art Director comes towards your group for a final critique. <br><br><br>")
    wagon.days += 2
    document.getElementById('DunDunDun').play();
  }

}
//landmarkEvent for distance traveled



function buildModal(value) {
  $('.modal-child').html('<img src="img/' + value + '.jpg" alt="an image">' +
    '<div id="popup-text" class="ongoing-events">' +
    '</div>'
  )
}

function buildEndModal(value, btnID1, btn1Name) {
  $('.modal-child').html('<img src="img/' + value + '.jpg" alt="an image">' +
    '<div id="popup-text" class="button-content">' +
    '<div class="buttons">' +
    '<span id="' + btnID1 + 'Button" class="btn btn-success">' + btn1Name + '</span>' +
    '</div>' +
    '</div>'
  )
}

function buildLandmarkModal(value, btnID1, btnID2, btn1Name, btn2Name) {
  $('.modal-child').html('<img src="img/' + value + '.jpg" alt="an image">' +
    '<div id="popup-text" class="button-content">' +
    '<div class="buttons">' +
    '<span id="' + btnID1 + 'Button" class="btn btn-success">' + btn1Name + '</span> <span id="' + btnID2 + 'Button" class="btn btn-success">' + btn2Name + '</span>' +
    '</div>' +
    '</div>'
  )
}

//Push text to class .button-content
//Option 1 button - id #option1-button
//Option 2 button - id #option2-button
function landmarkEvent() {
  var num = wagon.distance
  if (num === 4) {
    buildLandmarkModal(num, "fixRamen", "leaveRamen", "Reassemble Ramen", "Leave it")
    $(".button-content").prepend("During the move, you accidentally knock over The Great Wall of Ramen that’s piled precariously high in the moving van. You can either reassemble the ramen exactly the way it was, or leave it and face an art director's wrath… <br><br><br>")
    $("#buttonModal").toggle();
  } else if (num === 8) {
    buildModal("Idle");
    $(".ongoing-events").prepend("Your party has reached the famous roadside attraction, Idle Park! Located where I-65 meets I-70, this is your new favorite place to watch the traffic go by. <br><br><br>")
    $("#myModal").toggle();
    $("#gameMainScreen").hide();
    $("#landmarkStop1").fadeIn(500);
    $("#back-button").hide();
  } else if (num === 12) {
    buildLandmarkModal(num, "crossRiver", "detourRiver", "Go Under Bridge", "Go Another Way")
    $(".button-content").prepend("You have reached the College Ave bridge (Clearance Height 13’ 9”). The only question now is will you fit? You can choose to risk supplies and your party by going under the bridge, or take a detour that adds time to your trip. <br><br><br>")
    $("#buttonModal").toggle();
  } else if (num === 14) {
    buildModal("sunKing");
    $(".ongoing-events").prepend("You’re pretty far along on your journey, but your party is suffering from starvation. It has only been a few minutes since their last taco! You must pull over and enter Sun King Brewery, the home of Nacho A La Margarita Outpost. This is a one-stop shop for all the beer and Mexican food your heart desires, just a five minute walk from the new building! <br><br><br>")
    $("#myModal").toggle();
    wagon.food += 200;
    $("#gameMainScreen").hide();
    $("#landmarkStop2").fadeIn(500);
    $("#back-button").hide();
  } else if (num === 16) {
    buildLandmarkModal(num, "friend", "fight", "Confront Riley In A Rhyme Battle", "Run Past Riley Into The New Building")
    $(".button-content").prepend("You've made it to Lockerbie Square! But it appears you have been stopped by James Whitcomb Riley, guardian poet-spirit of the neighborhood. He's challenged you to a rhyme battle before you can enter. Do you step up, or just try to run past him into our new building? <br><br><br>")
    $("#buttonModal").toggle();
  } else if (num === 17) {
    // buildEndModal(num, "win", "Play Again!")
    // var endScore = wagon.buildScore()
    $(".endingStickyNote").fadeIn(500);
    $(".ending-modal").fadeIn(600);
    $("#ending-button").fadeIn(600);
    // $(".button-content").prepend("<h4>Congratulations, you win!! </h4>Your score is: " + endScore);

  }
}
//landmark 1 button events
function leaveRamen() {
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  buildModal("ramenFail");
  $(".ongoing-events").prepend("Uh oh, the ramen was placed in the wrong order. The art director  is now coming for you " + wagon.characters[index].name + " heads back to the old office to hide. <br><br><br>")
  $("#myModal").toggle();
  wagon.characters[index].health = 0
  wagon.characters[index].status = "Unresponsive"
  wagon.resourceChecker()
  wagon.statusAdjuster()
}

function fixRamen() {
  var num = Math.floor(Math.random() * Math.floor(100))
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  if (num > 50) {
    buildModal("ramenFail");
    $(".ongoing-events").prepend("Uh oh, the ramen was placed in the wrong order. The art director  is now coming for you " + wagon.characters[index].name + " heads back to the old office to hide. <br><br><br>")
    $("#myModal").toggle();
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Unresponsive"
    for (i = 0; i < 4; i++) {
      wagon.days += 1
    }
  } else {
    $(".ongoing-events").prepend("Congratulations! No one noticed. <br><br><br>")
  }
  wagon.resourceChecker()
  wagon.statusAdjuster()

}

//landmark 1 button events
function detourRiver() {
  for (i = 0; i < 8; i++) {
    wagon.days += 1
    wagon.food -= 10
    wagon.statusAdjuster()
  }
  $(".ongoing-events").prepend("You drove three blocks to get around the College Ave bridge. <br><br><br>")
  wagon.resourceChecker()
  wagon.statusAdjuster()

}

function crossRiver() {
  var num = Math.floor(Math.random() * Math.floor(100))
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  if (num > 50) {
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Unresponsive"
    buildModal("bridgeFail");
    document.getElementById('car-braking').play();
    $(".ongoing-events").prepend("The moving van got stuck under the bridge! While getting out to investigate what happened,  " + wagon.characters[index].name + " fell into a pothole. Their journey has ended. <br><br><br>")
    $("#myModal").toggle();
    for (i = 0; i < 4; i++) {
      wagon.statusAdjuster()
      wagon.days += 1
    }
  } else {
    buildModal("bridgeWin");
    $(".ongoing-events").prepend("Your truck successfully crossed the College Ave bridge! <br><br><br>")
    $("#myModal").toggle();
    wagon.days += 1
    wagon.food -= (wagon.characters.length * 5)
  }

  wagon.resourceChecker()
  wagon.statusAdjuster()
}

// landmark 3 button events
function fight() {
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  $(".ongoing-events").prepend("Your rhyming skills were far too weak Riley's nine little goblins (oh, did we not mention he has nine little goblins?) They tackle " + wagon.characters[index].name + " and carry them back to Fountain Square. <br><br><br>")
  wagon.characters[index].health = 0
  wagon.statusAdjuster()
  wagon.resourceChecker()
}

function friend() {
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  wagon.characters[index].health = 0
  $(".ongoing-events").prepend("Riley's nine little goblins (oh, did we not mention he has nine little goblins?) tackle " + wagon.characters[index].name + " and carry them back to Fountain Square. <br><br><br>")
  wagon.statusAdjuster()
  wagon.resourceChecker()
}

function deathEvent() {
  var num = Math.floor(Math.random() * Math.floor(5))
  var index = Math.floor(Math.random() * Math.floor(wagon.characters.length))
  if (num === 1 && wagon.characters[index].health < 60) {
    buildModal(num);
    $(".ongoing-events").prepend(wagon.characters[index].name + " lost all of our backups on the server. They went back to the old office with a guilty conscience. <br><br><br>")
    $("#myModal").toggle();
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Unresponsive"
  } else if (num === 2 && wagon.characters[index].health < 50) {
    buildModal(num);
    $(".ongoing-events").prepend(wagon.characters[index].name + " ate a fry they found between the seats. They got a suspicious stomach bug and have to end their journey. <br><br><br>")
    $("#myModal").toggle();
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Unresponsive"
  } else if (num === 3 && wagon.characters[index].health < 80) {
    buildModal(num);
    $(".ongoing-events").prepend(wagon.characters[index].name + " left the door open and fell out with all of our supplies. Their journey has ended. <br><br><br>")
    $("#myModal").toggle();
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Unresponsive"
  } else if (num === 4 && wagon.characters[index].health < 90) {
    buildModal(num);
    $(".ongoing-events").prepend(wagon.characters[index].name + " told the movers the wrong address. Everyone gangs up on them and they're forced back to the old office. <br><br><br>")
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Unresponsive"
  } else if (num === 5 && wagon.characters[index].health < 70) {
    buildModal(num);
    $(".ongoing-events").prepend(wagon.characters[index].name + " dropped a monitor on their own foot. They head to the hospital instead of to the new office. <br><br><br>")
    $("#myModal").toggle();
    wagon.characters[index].health = 0
    wagon.characters[index].status = "Unresponsive"
  }
}


function textUpdateUI() {
  $('#player-one-name').text(char1.name);
  $('#player-two-name').text(char2.name);
  $('#player-three-name').text(char3.name);
  $('#player-four-name').text(char4.name);
  $('#player-one-status').text(char1.status);
  $('#player-two-status').text(char2.status);
  $('#player-three-status').text(char3.status);
  $('#player-four-status').text(char4.status);
  $('#player-one-illness').text(char1.illness.length);
  $('#player-two-illness').text(char2.illness.length);
  $('#player-three-illness').text(char3.illness.length);
  $('#player-four-illness').text(char4.illness.length);
  $('#wagon-food-remaining').text(wagon.food.toFixed(0));
  $('.wagon-gas-remaining').text(wagon.gas.toFixed(2));
  $('#wagon-awards-remaining').text(wagon.awards.toFixed(0));
  $('.current-date').text(wagon.days);
  $('.distance-traveled').text(wagon.distance);
}

function validateNames(team, playerOne, playerTwo, playerThree, playerFour) {
  if (team === undefined || playerOne === "" || playerTwo === "" || playerThree === "" || playerFour === "") {
    $("#charNameInput").effect("shake", { times: 3 }, 700);
    $("#team").effect("shake", { times: 3 }, 700)
  } else {
    $("#characterInput").fadeOut(500);
    $("#gameMainScreen").delay(500).fadeIn(500);

  }
}


$(document).ready(function () {
  var x = 1;
  $('#wagon-images').addClass('sky1');

  // modal that closes with click anywhere
  var modal = document.getElementById('myModal');
  var span = document.getElementById('myModal');
  span.onclick = function () {
    modal.style.display = "none";
  }

  $("#startBTN").click(function () {
    document.getElementById('openingSong').play();
    $("#start").fadeOut(300);
    $(".container").hide();
    $("#startBTN").hide();
    $(".mainStickyNote").fadeIn(300);
  });

  $("#characterBTN").click(function () {

    var playerOneName; // Declare the variable outside the conditions

    // Checking the selected radio button
    if ($("#client").is(":checked")) {
      playerOneName = $("#char1").val()
      playerTwoName = $("#char2").val()
      playerThreeName = $("#char3").val()
      playerFourName = $("#char4").val()
    } else if ($("#creative").is(":checked")) {
      playerOneName = $("#char5").val()
      playerTwoName = $("#char6").val()
      playerThreeName = $("#char7").val()
      playerFourName = $("#char8").val()
    } else if ($("#operations").is(":checked")) {
      playerOneName = $("#char9").val()
      playerTwoName = $("#char10").val()
      playerThreeName = $("#char11").val()
      playerFourName = $("#char12").val()
    } else if ($("#strategy").is(":checked")) {
      playerOneName = $("#char13").val()
      playerTwoName = $("#char14").val()
      playerThreeName = $("#char15").val()
      playerFourName = $("#char16").val()
    } else if ($("#web").is(":checked")) {
      playerOneName = $("#char17").val()
      playerTwoName = $("#char18").val()
      playerThreeName = $("#char19").val()
      playerFourName = $("#char20").val()
    } else if ($("#interns").is(":checked")) {
      playerOneName = $("#char21").val()
      playerTwoName = $("#char22").val()
      playerThreeName = $("#char23").val()
      playerFourName = $("#char24").val()
    }


    var professionValue = $("input:radio[name=team]:checked").val("")

    validateNames(professionValue, playerOneName, playerTwoName, playerThreeName, playerFourName)
    char1 = new Character(playerOneName)
    char2 = new Character(playerTwoName)
    char3 = new Character(playerThreeName)
    char4 = new Character(playerFourName)
    wagon = new Wagon()
    journey(0)
    char1.healthBar()
    wagon.characters.push(char1, char2, char3, char4)
    wagon.team(professionValue)
    textUpdateUI()

    $('#wagon-food-remaining').text(wagon.food);
    $('.wagon-gas-remaining').text(wagon.gas.toFixed(2));
    $('#wagon-awards-remaining').text(wagon.awards);
  });


  $("#stopBTN1, #stopBTN2").click(function () {
    $('#wagon-food-remaining').text(wagon.food);
    $('.wagon-gas-remaining').text(wagon.gas.toFixed(2));
    $('#wagon-awards-remaining').text(wagon.awards);
    $("#landmarkStop1").hide();
    $("#landmarkStop2").hide();
    $("#gameMainScreen").fadeIn(300);
  });


  $("#back-button").click(function () {
    $("#store").fadeOut(500);
    $("#characterInput").delay(500).fadeIn(500);
  });

  $(document).ready(function () {
    // Function to update player names when radio button is selected
    function updatePlayerNames(names) {
      $("#char1").val(names[0]);
      $("#char2").val(names[1]);
      $("#char3").val(names[2]);
      $("#char4").val(names[3]);
      $("#char5").val(names[0]);
      $("#char6").val(names[1]);
      $("#char7").val(names[2]);
      $("#char8").val(names[3]);
      $("#char9").val(names[0]);
      $("#char10").val(names[1]);
      $("#char11").val(names[2]);
      $("#char12").val(names[3]);
      $("#char13").val(names[0]);
      $("#char14").val(names[1]);
      $("#char15").val(names[2]);
      $("#char16").val(names[3]);
      $("#char17").val(names[0]);
      $("#char18").val(names[1]);
      $("#char19").val(names[2]);
      $("#char20").val(names[3]);
      $("#char21").val(names[0]);
      $("#char22").val(names[1]);
      $("#char23").val(names[2]);
      $("#char24").val(names[3]);
    }

    // Event listener for radio button change
    $('input[type="radio"]').on('change', function () {
      if ($(this).attr('id') === 'client') {
        // When radio button with id is selected, change player names
        const playerNames = ["Alex", "Jen", "Joe Judd", "Kelly"];
        updatePlayerNames(playerNames);
        $("#client-images").css("display", "grid");
        $("#creative-images").css("display", "none");
        $("#operations-images").css("display", "none");
        $("#strategy-images").css("display", "none");
        $("#web-images").css("display", "none");
        $("#intern-images").css("display", "none");

      } else if ($(this).attr('id') === 'creative') {
        // When radio button with id is selected, change player names
        const playerNames = ["Anne", "Carlee", "Von", "Chad"];
        updatePlayerNames(playerNames);
        $("#client-images").css("display", "none");
        $("#creative-images").css("display", "grid");
        $("#operations-images").css("display", "none");
        $("#strategy-images").css("display", "none");
        $("#web-images").css("display", "none");
        $("#intern-images").css("display", "none");

      } else if ($(this).attr('id') === 'operations') {
        // When radio button with id is selected, change player names
        const playerNames = ["Alex", "Jody", "Mary", "Lisa"];
        updatePlayerNames(playerNames);
        $("#client-images").css("display", "none");
        $("#creative-images").css("display", "none");
        $("#operations-images").css("display", "grid");
        $("#strategy-images").css("display", "none");
        $("#web-images").css("display", "none");
        $("#intern-images").css("display", "none");

      } else if ($(this).attr('id') === 'strategy') {
        // When radio button with id is selected, change player names
        const playerNames = ["Joel", "Mandy", "Marissa", "Rachel"];
        updatePlayerNames(playerNames);
        $("#client-images").css("display", "none");
        $("#creative-images").css("display", "none");
        $("#operations-images").css("display", "none");
        $("#strategy-images").css("display", "grid");
        $("#web-images").css("display", "none");
        $("#intern-images").css("display", "none");

      } else if ($(this).attr('id') === 'web') {
        // When radio button with id is selected, change player names
        const playerNames = ["Brian", "Eric", "Josh", "Kim"];
        updatePlayerNames(playerNames);
        $("#client-images").css("display", "none");
        $("#creative-images").css("display", "none");
        $("#operations-images").css("display", "none");
        $("#strategy-images").css("display", "none");
        $("#web-images").css("display", "grid");
        $("#intern-images").css("display", "none");

      } else if ($(this).attr('id') === 'interns') {
        // When radio button with id is selected, change player names
        const playerNames = ["Ashlynn", "Daniel", "Teresa", "Jawon"];
        updatePlayerNames(playerNames);

        $("#client-images").css("display", "none");
        $("#creative-images").css("display", "none");
        $("#operations-images").css("display", "none");
        $("#strategy-images").css("display", "none");
        $("#web-images").css("display", "none");
        $("#intern-images").css("display", "grid");
      } 
    });
  });

  const movingImage = document.getElementById("progress-truck");
  const moveAmount = 55.96; // Pixels to move left


  $("#continue-button").click(function () {
    wagon.turn()
    wagon.statusAdjuster()
    textUpdateUI()
    $("#progress-truck").fadeIn(300)
    $("#ongoing-text-box").animate({ scrollTop: 0 }, "slow");
    const currentLeft = parseFloat(getComputedStyle(movingImage).left);
    const newLeft = currentLeft - moveAmount;
    movingImage.style.left = newLeft + "px";

    if (x < 6) {
      $('#wagon-' + x).toggle();
      $('#wagon-images').removeClass('sky' + x);
      x++;
      $('#wagon-' + x).toggle();
      $('#wagon-images').addClass('sky' + x);
    } else {
      $('#wagon-' + x).toggle();
      $('#wagon-images').removeClass('sky' + x);
      x = 1;
      $('#wagon-' + x).toggle();
      $('#wagon-images').addClass('sky' + x);
    }
  });



  $("#rest-button").click(function () {
    wagon.rest()
    textUpdateUI()
  });

  $('#hunt-button').click(function () {
    wagon.huntingTime()
    wagon.resourceChecker()
    textUpdateUI()
  });

  $(document).on('click', '#deathButton', function () {
    history.go(0)
  });

  $(document).on('click', '#ending-button', function () {
    history.go(0)
  });

  $(document).on('click', '#winButton', function () {
    history.go(0)
  });

  $(document).on('click', '#fight', function () {
    history.go(0)
  });

  $(document).on('click', '#fixRamenButton', function () {
    fixRamen()
    textUpdateUI()
    $('#buttonModal').hide();
  });

  $(document).on('click', '#leaveRamenButton', function () {
    leaveRamen()
    textUpdateUI()
    $('#buttonModal').hide();

  });


  $(document).on('click', '#crossRiverButton', function () {
    crossRiver()
    textUpdateUI()
    $('#buttonModal').hide();
  });

  $(document).on('click', '#detourRiverButton', function () {
    detourRiver()
    textUpdateUI()
    $('#buttonModal').hide();

  });

  $(document).on('click', '#fightButton', function () {
    fight()
    textUpdateUI()
    $('#buttonModal').hide();
  });

  $(document).on('click', '#friendButton', function () {
    friend()
    textUpdateUI()
    $('#buttonModal').hide();
  });

  // Get a reference to the sacrifice button element
  const sacrificeButton = document.getElementById('sacrifice-button');

  // Add a click event listener to the button
  sacrificeButton.addEventListener('click', function () {
    // Refresh the page
    location.reload();
  });

  $(document).ready(function () {
    // When the "Open Map" button is clicked
    $('#map').on('click', function () {
      // Show the map modal
      $('#mapModal').show();
    });

    // When the "Close" button inside the map modal is clicked
    $('#closeMap').on('click', function () {
      // Hide the map modal
      $('#mapModal').hide();
    });
  });


  $(document).ready(function () {
    let currentLetter = 0; // Initialize to 0, as array indices start from 0
    const numLetters = $(".letters > div").length;

    function showNextLetter() {
      if (currentLetter < numLetters) {
        $(".letters > div").eq(currentLetter).fadeIn("slow", function () {

        });
      }
    }

    // Event listener for the click event on the .letters div
    $(".letter-button-arrow").on("click", function () {
      currentLetter = 1; // Reset currentLetter to 0 when .letters is clicked
      showNextLetter();
      $(".skipButtonOne").show();
    });

    // Event listener for the click event on the skip button
    $(".skipButtonOne").on("click", function () {
      currentLetter++;
      if (currentLetter < numLetters) {
        $(".letters > div").eq(currentLetter - 1).stop(true, true).fadeOut("slow");
        showNextLetter();
        $(".skipButtonTwo").show();

      }
    });

    $(".skipButtonTwo").on("click", function () {
      currentLetter++;
      if (currentLetter < numLetters) {
        $(".letters > div").eq(currentLetter - 1).stop(true, true).fadeOut("slow");
        showNextLetter();
        $(".skipButtonThree").show();
      }
    });

    $(".skipButtonThree").on("click", function () {
      $(".letters > div").fadeOut(500);
      $(".container").fadeIn(500);
      $("#characterInput").fadeIn(500);

    });


  });


  const teamArray = [
    { team: "creative", name: "Anne" },
    { team: "creative", name: "Carlee" },
    { team: "creative", name: "Von" },
    { team: "creative", name: "Chad" },
    { team: "creative", name: "Evan" },
    { team: "creative", name: "Grace" },
    { team: "creative", name: "Joe Black" },
    { team: "creative", name: "Jonathan" },
    { team: "creative", name: "Konah" },
    { team: "creative", name: "Monika" },
    { team: "creative", name: "Nicholas" },
    { team: "creative", name: "Rob" },
    { team: "creative", name: "Shelby" },
    { team: "client", name: "Alex" },
    { team: "client", name: "Jen" },
    { team: "client", name: "Joe Judd" },
    { team: "client", name: "Kelly" },
    { team: "client", name: "Kiersten" },
    { team: "client", name: "Melissa" },
    { team: "client", name: "Michaela" },
    { team: "client", name: "Natalie" },
    { team: "operations", name: "Alex" },
    { team: "operations", name: "Jody" },
    { team: "operations", name: "Mary" },
    { team: "operations", name: "Lisa" },
    { team: 'strategy', name: 'Joel' },
    { team: 'strategy', name: 'Mandy' },
    { team: 'strategy', name: 'Marissa' },
    { team: 'strategy', name: 'Rachel' },
    { team: 'strategy', name: 'Rebecca' },
    { team: 'strategy', name: 'Zarrien' },
    { team: 'web', name: 'Brian' },
    { team: 'web', name: 'Eric' },
    { team: 'web', name: 'Josh' },
    { team: 'web', name: 'Kim' },
    { team: 'web', name: 'Nate' },
    { team: 'interns', name: 'Ashlynn' },
    { team: 'interns', name: 'Daniel' },
    { team: 'interns', name: 'Teresa' },
    { team: 'interns', name: 'Jawon' }


  ];


  const radioButtons = document.querySelectorAll("input[name=team]");
  const dropdowns = [
    document.getElementById('char1'),
    document.getElementById('char2'),
    document.getElementById('char3'),
    document.getElementById('char4'),
    document.getElementById('char5'),
    document.getElementById('char6'),
    document.getElementById('char7'),
    document.getElementById('char8'),
    document.getElementById('char9'),
    document.getElementById('char10'),
    document.getElementById('char11'),
    document.getElementById('char12'),
    document.getElementById('char13'),
    document.getElementById('char14'),
    document.getElementById('char15'),
    document.getElementById('char16'),
    document.getElementById('char17'),
    document.getElementById('char18'),
    document.getElementById('char19'),
    document.getElementById('char20'),
    document.getElementById('char21'),
    document.getElementById('char22'),
    document.getElementById('char23'),
    document.getElementById('char24')

  ];

  radioButtons.forEach(radioButton => {
    radioButton.addEventListener("change", () => {
      // The event listener triggers when a radio button is changed/selected.

      const selectedTeam = radioButton.value;
      // Get the value of the selected radio button, presumably representing a team.

      const teamNames = teamArray.filter(item => item.team === selectedTeam).map(item => item.name);
      // Filter the `teamArray` to get an array of `name` values corresponding to the selected team.

      dropdowns.forEach((dropdown, index) => {
        // Loop through each dropdown menu and execute the following actions.

        dropdown.innerHTML = "";
        // Clear previous options in the dropdown.

        teamNames.forEach(name => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          dropdown.appendChild(option);
        });
        // Populate the dropdown with options based on the `teamNames` array.

        if (teamNames.length >= index + 1) {
          dropdown.value = teamNames[index];
        } else {
          dropdown.value = ""; // No default value if there are fewer names than dropdowns
        }
        // Set the value of the dropdown to the corresponding value from `teamNames`.
        // If there are fewer names than dropdowns, the dropdown value will be cleared.
      });
    });
  });

  // Create an array of name-image pairs
  const nameImageArray = [
    { name: 'alex', src: 'img/Alex.png' },
    { name: 'jen', src: 'img/Jen.png' },
    { name: 'joe judd', src: 'img/Joe Judd.png' },
    { name: 'kelly', src: 'img/Kelly.png' },
    { name: 'kiersten', src: 'img/Kiersten.png' },
    { name: 'melissa', src: 'img/Melissa.png' },
    { name: 'michaela', src: 'img/Michaela.png' },
    { name: 'natalie', src: 'img/Natalie.png' },
    { name: 'anne', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Anne-350x450.jpg' },
    { name: 'carlee', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Carlee-350x450.jpg' },
    { name: 'von', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Von-350x450.jpg' },
    { name: 'chad', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Chad-350x450.jpg' },
    { name: 'evan', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Evan-350x450.jpg' },
    { name: 'grace', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Grace-350x450.jpg' },
    { name: 'joe black', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-JoeBlack-350x450.jpg' },
    { name: 'jonathan', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Jonathan-350x450.jpg' },
    { name: 'konah', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Konah-350x450.jpg' },
    { name: 'monika', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Monika-350x450.jpg' },
    { name: 'nicholas', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Nicholas-350x450.jpg' },
    { name: 'nick', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Nick-350x450.jpg' },
    { name: 'rob', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Rob-350x450.jpg' },
    { name: 'shelby', src: 'https://www.welldonemarketing.com/wp-content/uploads/2023/05/WDM_Personality-Shelby-350x450.jpg' },
    { name: 'alex w', src: 'https://placehold.co/350x450' },
    { name: 'jody', src: 'img/Jody.png' },
    { name: 'mary', src: 'https://placehold.co/350x450' },
    { name: 'lisa', src: 'img/Lisa.png' },
    { name: 'joel', src: 'img/Joel.png' },
    { name: 'mandy', src: 'img/Mandy.png' },
    { name: 'marissa', src: 'img/Marissa.png' },
    { name: 'rachel', src: 'img/Rachel.png' },
    { name: 'rebecca', src: 'img/Rebecca.png' },
    { name: 'zarrien', src: 'img/Zarrien.png' },
    { name: 'brian', src: 'img/Brian.png' },
    { name: 'eric', src: 'img/Eric.png' },
    { name: 'josh', src: 'img/Josh.png' },
    { name: 'kim', src: 'img/Kim.png' },
    { name: 'nate', src: 'img/Nate.png' },
    { name: 'ashlynn', src: 'https://placehold.co/350x450' },
    { name: 'daniel', src: 'https://placehold.co/350x450' },
    { name: 'teresa', src: 'https://placehold.co/350x450' },
    { name: 'jawon', src: 'https://placehold.co/350x450' }
    // Add more name-image pairs as needed
  ];

  const nameInputs = [
    document.getElementById('char1'),
    document.getElementById('char2'),
    document.getElementById('char3'),
    document.getElementById('char4'),
    document.getElementById('char5'),
    document.getElementById('char6'),
    document.getElementById('char7'),
    document.getElementById('char8'),
    document.getElementById('char9'),
    document.getElementById('char10'),
    document.getElementById('char11'),
    document.getElementById('char12'),
    document.getElementById('char13'),
    document.getElementById('char14'),
    document.getElementById('char15'),
    document.getElementById('char16'),
    document.getElementById('char17'),
    document.getElementById('char18'),
    document.getElementById('char19'),
    document.getElementById('char20'),
    document.getElementById('char21'),
    document.getElementById('char22'),
    document.getElementById('char23'),
    document.getElementById('char24')
  ];

  const images = [
    document.getElementById('image1'),
    document.getElementById('image2'),
    document.getElementById('image3'),
    document.getElementById('image4'),
    document.getElementById('image5'),
    document.getElementById('image6'),
    document.getElementById('image7'),
    document.getElementById('image8'),
    document.getElementById('image9'),
    document.getElementById('image10'),
    document.getElementById('image11'),
    document.getElementById('image12'),
    document.getElementById('image13'),
    document.getElementById('image14'),
    document.getElementById('image15'),
    document.getElementById('image16'),
    document.getElementById('image17'),
    document.getElementById('image18'),
    document.getElementById('image19'),
    document.getElementById('image20'),
    document.getElementById('image21'),
    document.getElementById('image22'),
    document.getElementById('image23'),
    document.getElementById('image24')
  ];

  nameInputs.forEach((nameInput, index) => {
    nameInput.addEventListener('input', function () {
      const inputValue = nameInput.value.toLowerCase();
      const matchedPair = nameImageArray.find(pair => pair.name === inputValue);

      if (matchedPair) {
        images[index].src = matchedPair.src;
        console.log(`Test${index + 1}`);
      } else {
        images[index].src = 'https://placehold.co/350x450';
      }
    });
  });

  $(document).ready(function () {
    $('input[name="team"]').on('click', function () {
      var selectedParty = $(this).val();

      if (selectedParty === "client") {
        $('#client-dropdown').css('display', 'block');
        $('#client-images').css('display', 'grid');
      } else {
        $('#client-dropdown').css('display', 'none');
        $('#client-images').css('display', 'none');
      }

      if (selectedParty === "creative") {
        $('#creative-dropdown').css('display', 'block');
        $('#creative-images').css('display', 'grid');
      } else {
        $('#creative-dropdown').css('display', 'none');
        $('#creative-images').css('display', 'none');
      }

      if (selectedParty === "operations") {
        $('#operations-dropdown').css('display', 'block');
        $('#operations-images').css('display', 'grid');
      } else {
        $('#operations-dropdown').css('display', 'none');
        $('#operations-images').css('display', 'none');
      }

      if (selectedParty === "strategy") {
        $('#strategy-dropdown').css('display', 'block');
        $('#strategy-images').css('display', 'grid');
      } else {
        $('#strategy-dropdown').css('display', 'none');
        $('#strategy-images').css('display', 'none');
      }

      if (selectedParty === "web") {
        $('#web-dropdown').css('display', 'block');
        $('#web-images').css('display', 'grid');
      } else {
        $('#web-dropdown').css('display', 'none');
        $('#web-images').css('display', 'none');
      }

      if (selectedParty === "interns") {
        $('#intern-dropdown').css('display', 'block');
        $('#intern-images').css('display', 'grid');
      } else {
        $('#intern-dropdown').css('display', 'none');
        $('#intern-images').css('display', 'none');
      }
    });
  });

});



// Trigger the modal when needed (you can use a button or any other event)
// For example, you can call showLetterModal() on page load or button click.
