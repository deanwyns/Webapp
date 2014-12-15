'use strict';

angular.module('joetzApp').controller('AdminUserCtrl', ['$state', '$scope', 'userService', 'dateService', 'promiseTracker', '$mdDialog', function ($state, $scope, userService, dateService, promiseTracker, $mdDialog) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};

    /**
     * Laadt alle gebruikers en voegt ze toe aan de scope
     * @param  {boolean} transition Achterna terug naar lijst navigeren?
     * @return {void}            
     */
    var _loadUsers = function(transition) {
        userService.getUsers().then(function(users) {
            $scope.users = users;

            if(transition) {
                $state.go('admin.user.list');
            }
        }, function(err) {
            console.log(err);
        });
    };
    _loadUsers();

    /**
     * Past een kind aan
     * @param  {object} childModel    Een object met alle nodige attributen
     * @return {void}                  
     */
    var _submitEditChild = function(childModel) {
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

        var editPromise = userService.updateChild(childModel, childModel.id).then(function(response) {
            $scope.errors = {};
        }, function(err) {
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
    var _submitNewChild = function(childModel) {
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

        var addPromise = userService.addChild(childModel).then(function(response) {
            $scope.errors = {};
        }, function(err) {
            for(var key in err.errors.messages) {
                $scope.errors[key] = err.errors.messages[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    }

    /**
     * Past een gebruiker aan
     * @param  {object} userModel    Een object met alle nodige attributen
     * @return {void}                  
     */
    var _submitEdit = function(userModel) {
        if(!userModel) {
            return undefined;
        }

        var editPromise = userService.update(userModel, userModel.id).then(function(response) {
            $scope.errors = {};

            _loadUsers(true);
        }, function(err) {
            for(var key in err.errors.messages) {
                $scope.errors[key] = err.errors.messages[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    /**
     * Voegt een nieuwe gebruiker toe
     * @param  {object} userModel    Een object met alle nodige attributen
     * @return {void}                  
     */
    var _submitNew = function(userModel) {
        if(!userModel || !userModel.type) {
            return undefined;
        }

        // Roep de verschillende back-end endpoints aan door een switch op user-type
        switch(userModel.type) {
            case 'parents':
                var addPromise = userService.register(userModel).then(function(response) {
                    $scope.errors = {};
                    _loadUsers(true);
                }, function(err) {
                    for(var key in err.errors.messages) {
                        $scope.errors[key] = err.errors.messages[key][0];
                    }
                });

                $scope.editTracker.addPromise(addPromise);
                break;
            case 'monitor':
                var addPromise = userService.registerMonitor(userModel).then(function(response) {
                    $scope.errors = {};
                    _loadUsers(true);
                }, function(err) {
                    for(var key in err.errors.messages) {
                        $scope.errors[key] = err.errors.messages[key][0];
                    }
                });

                $scope.editTracker.addPromise(addPromise);
                break;
            case 'admin':
                var addPromise = userService.registerAdmin(userModel).then(function(response) {
                    $scope.errors = {};
                    _loadUsers(true);
                }, function(err) {
                    for(var key in err.errors.messages) {
                        $scope.errors[key] = err.errors.messages[key][0];
                    }
                });

                $scope.editTracker.addPromise(addPromise);
                break;
        }
    }

    /**
     * Verwijdert een gebruiker na bevestiging via dialoog
     * @param  {object} userModel Een object met alle nodige attributen
     * @return {void}               
     */
    var _deleteUser = function(userModel) {
        // Maak een dialoogvenster via de builder
        var confirm = $mdDialog.confirm()
                    .title(userModel.email + ' verwijderen?')
                    .content('Weet je zeker dat je ' + userModel.email + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        // Toon het dialoogvenster en bij bevestiging wordt de categorie verwijderd
        $mdDialog.show(confirm).then(function() {
            userService.deleteUser(userModel.id).then(function() {
                _loadUsers();
            }, function() {
                console.log('Mislukt');
            });
        });
    };

    // Voeg de methoden toe aan de scope
    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteUser = _deleteUser;

    $scope.submitEditChild = _submitEditChild;
    $scope.submitNewChild = _submitNewChild;
  }]);