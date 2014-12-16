'use strict';

angular.module('joetzApp').controller('UserCtrl', ['$state', '$scope', 'userService', 'dateService', 'promiseTracker', '$mdDialog', '$mdToast', function ($state, $scope, userService, dateService, promiseTracker, $mdDialog, $mdToast) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};
    $scope.selectedChild = {};

    /**
     * Laadt het profiel van de gebruiker
     * @param  {boolean} transition Achterna terug naar het profiel navigeren?
     * @return {void}           
     */
    var _loadProfile = function(transition) {
        userService.getChildren().then(function(children) {
            $scope.user.children = children;
            console.log($scope.user.children);

            if(transition) {
                $state.go('profile.overview');
            }
        }, function(err) {
            console.log(err);
        });
    };
    _loadProfile();

    /**
     * Past een inschrijving aan
     * @param  {object} registrationModel    Een object met alle nodige attributen
     * @return {void}                  
     */
    var _submitEdit = function(childModel) {
        if(!childModel) {
            return undefined;
        }

        // Voegt adres-attributen toe aan het model, zodat de data correct wordt verstuurd
        childModel.street_name = childModel.address.street_name;
        childModel.postal_code = childModel.address.postal_code;
        childModel.city = childModel.address.city;
        childModel.house_number = childModel.address.house_number;

        // Voegt een datum in MySQL-formaat toe aan het model
        childModel.date_of_birth = dateService.dateToMySQLString(childModel.date_of_birth_d);

        var editPromise = userService.updateChild(childModel, childModel.id).then(function() {
            $scope.errors = {};

            _loadProfile(true);
            $mdToast.show($mdToast.simple().content('Kind aangepast'));
        }, function(err) {
            $scope.errors = {};
            for(var key in err.errors.messages) {
                $scope.errors[key] = err.errors.messages[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    /**
     * Voegt een nieuw kind toe
     * @param  {object} childModel    Een object met alle nodige attributen
     * @return {void}                  
     */
    var _submitNew = function(childModel) {
        console.log(childModel);
        if(!childModel) {
            return undefined;
        }

        // Voegt adres-attributen toe aan het model, zodat de data correct wordt verstuurd
        if(childModel.address) {
            childModel.street_name = childModel.address.street_name;
            childModel.postal_code = childModel.address.postal_code;
            childModel.city = childModel.address.city;
            childModel.house_number = childModel.address.house_number;
        }

        // Voegt een datum in MySQL-formaat toe aan het model
        if(childModel.date_of_birth_d) {
            childModel.date_of_birth = dateService.dateToMySQLString(childModel.date_of_birth_d);
        }

        var addPromise = userService.addChild(childModel).then(function() {
            $scope.errors = {};
            _loadProfile(true);
            $mdToast.show($mdToast.simple().content('Kind toegevoegd'));
        }, function(err) {
            $scope.errors = {};
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    };

    /**
     * Verwijdert een gebruiker na bevestiging via dialoog
     * @param  {object} userModel Een object met alle nodige attributen
     * @return {void}               
     */
    var _deleteChild = function(childModel) {
        var confirm = $mdDialog.confirm()
                    .title(childModel.email + ' verwijderen?')
                    .content('Weet je zeker dat je ' + childModel.email + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        $mdDialog.show(confirm).then(function() {
            userService.deleteUser(childModel.id).then(function() {
                _loadProfile();
            }, function() {
                console.log('Mislukt');
            });
        });
    };

    /**
     * Verandert het wachtwoord van de ingelogde gebruiker
     * @param  {string} newPassword          Het nieuwe wachtwoord
     * @param  {string} newPasswordConfirmed Het nieuwe wachtwoord bevestigd
     * @return {void}                      
     */
    var _changePassword = function(newPassword, newPasswordConfirmed) {
        userService.updateMe({ password: newPassword, password_confirmed: newPasswordConfirmed }).then(function() {
            $scope.message = 'Uw wachtwoord is gewijzigd.';
        }, function(err) {
            // Voeg eventuele foutmeldingen toe aan de scope
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });
    };

    // Voeg de methoden toe aan de scope
    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteChild = _deleteChild;
    $scope.changePassword = _changePassword;
  }]);