'use strict';

angular.module('joetzApp').controller('AdminVacationCtrl', ['dateService', '$state', '$scope', 'vacationService', 'categoryService', 'promiseTracker', '$mdDialog', function (dateService, $state, $scope, vacationService,categoryService, promiseTracker, $mdDialog) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};

    /**
     * Laadt alle vakanties en voegt ze toe aan de scope
     * @param  {boolean} transition Achterna terug naar lijst navigeren?
     * @return {void}            
     */
    var _loadVacations = function(transition) {
        vacationService.getVacations().then(function(vacations) {
            $scope.vacations = vacations;
            $scope.errors = {};

            if(transition) {
                $state.go('admin.vacation.list');
            }
        }, function(err) {
            console.log(err);
        });
    };
    _loadVacations();

    /** 
     * Vormt een MySQL-datumstring om in een JS-datum
     * @param  {string} str De datum in MySQL-formaat
     * @return {date}     De datum die moet omgevormd worden
     */
    var _getDate = function(str) {
        return dateService.mySQLStringToDate(str);
    };

    /** 
     * Vormt een JS-datum om in een MySQL-datumstring
     * @param  {date} date De datum die moet omgevormd worden
     * @return {string}      De datum in MySQL-formaat
     */
    var _getMySQLDate = function(date) {
        return dateService.dateToMySQLString(date);
    };

    /**
     * Laadt alle categorieën en voegt ze toe aan de scope
     */
    var _setCategories = function() {
        categoryService.getCategories().then(function(categories) {
            $scope.categories = categories;
        });
    };
    _setCategories();

    /**
     * Laadt alle Picasa-albums en voeg ze toe aan de scope
     */
    var _setPicasaAlbums = function() {
        vacationService.getAlbums().then(function(albums) {
            $scope.albums = albums;
        });
    };
    _setPicasaAlbums();

    /**
     * Past een vakantie aan
     * @param  {object} vacationModel    Een object met alle nodige attributen
     * @return {void}                  
     */
    var _submitEdit = function(vacationModel) {
        if(!vacationModel) {
            return undefined;
        }

        $scope.errors = {};
        // Voegt een datum in MySQL-formaat toe aan het model
        vacationModel.begin_date = _getMySQLDate(vacationModel.begin_date_d);
        vacationModel.end_date = _getMySQLDate(vacationModel.begin_date_d);

        var editPromise = vacationService.updateVacation(vacationModel, vacationModel.id).then(function(response) {
            $scope.errors = {};
            _loadVacations(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    /**
     * Voegt een nieuwe vakantie toe
     * @param  {object} vacationModel    Een object met alle nodige attributen
     * @return {void}                  
     */
    var _submitNew = function(vacationModel) {
        if(!vacationModel) {
            return undefined;
        }

        $scope.errors = {};
        // Voegt een datum in MySQL-formaat toe aan het model
        vacationModel.begin_date = _getMySQLDate(vacationModel.date_begin_d);
        vacationModel.end_date = _getMySQLDate(vacationModel.date_end_d);

        var addPromise = vacationService.addVacation(vacationModel).then(function(response) {
            $scope.errors = {};
            _loadVacations(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    };

    /**
     * Verwijdert een vakantie na bevestiging via dialoog
     * @param  {object} userModel Een object met alle nodige attributen
     * @return {void}               
     */
    var _deleteVacation = function(vacationModel) {
        // Maak een dialoogvenster via de builder
        var confirm = $mdDialog.confirm()
                    .title(vacationModel.title + ' verwijderen?')
                    .content('Weet je zeker dat je ' + vacationModel.title + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        // Toon het dialoogvenster en bij bevestiging wordt de categorie verwijderd
        $mdDialog.show(confirm).then(function() {
            vacationService.deleteVacation(vacationModel.id).then(function() {
                _loadVacations();
            }, function(err) {
                console.log(err);
            });
        });
    };

    // Voeg de methoden toe aan de scope
    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteVacation = _deleteVacation;
    $scope.getDate = _getDate;
    $scope.getMySQLDate = _getMySQLDate;
  }]);