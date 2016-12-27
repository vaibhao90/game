function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}

// Get the modal
// var modal = document.getElementById('myModal');

// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks the button, open the modal 
// // btn.onclick = function() {
// //     modal.style.display = "block";
// // }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

angular.module('Game', ["firebase"])
    .controller('GameCtrl', ['$scope', '$filter', '$timeout', '$firebaseArray', function($scope, $filter, $timeout, $firebaseArray) {
        var ref = firebase.database().ref().child("gamescores");
        // create a synchronized array
        $scope.gamescores = $firebaseArray(ref);

        // add new items to the array
        // the message is automatically added to our Firebase database!
        var leadScore = firebase.database().ref().child('gamescores').orderByChild("score").limitToLast(1);
        leadScore.on('value', function(scores) {
        	if(scores){
        		var key = Object.keys(scores.exportVal())[0];
        		$scope.highestScore = scores.exportVal()[key];
        	}
        });

        $scope.startGame = function() {
            delete $scope.firstCard;
            $scope.score = 0;
            var cards = [];
            $scope.score = 0;
            for (var i = 0; i < 8; i++) {
                cards.push({ name: i, color: 'files/colour' + (i + 1) + '.gif', flipped: false, visible: true });
                cards.push({ name: i, color: 'files/colour' + (i + 1) + '.gif', flipped: false, visible: true });
            }
            $scope.cards = shuffle(cards);
        }
        $scope.startGame();
        $scope.flip = function(card) {
            card.flipped = true;
            if (!$scope.firstCard) {
                $scope.firstCard = card;
            } else if (card.name == $scope.firstCard.name) {
                $timeout(function() {
                    $scope.score += 1;
                    card.visible = false;
                    $scope.firstCard.visible = false;
                    delete $scope.firstCard;
                    checkAllCards();
                }, 1000);
            } else {
                delete $scope.firstCard;
                $timeout(function() {
                    $scope.score -= 1;
                    closeAllCards();
                }, 1000);
            }
        }

        $scope.openModal = function() {
            var modal = document.getElementById('myModal');
            modal.style.display = "block";
        }

        $scope.closeModal = function() {
            var modal = document.getElementById('myModal');
            modal.style.display = "none";
        }

        function checkAllCards() {
            var flag = false;
            angular.forEach($scope.cards, function(item, index) {
                if (item.visible) flag = true;
                if (index + 1 == $scope.cards.length) {
                    if (!flag) {

                    }
                }
            })
        }

        $scope.submit = function() {
            $scope.gamescores.$add({
                username: $scope.username,
                email: $scope.email,
                score: $scope.score
            });
        }

        function closeAllCards() {
            angular.forEach($scope.cards, function(item) {
                item.flipped = false;
            })
        }

    }])
