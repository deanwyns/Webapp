'use strict';

angular.module('joetzApp').controller('AdminCategoryCtrl', ['$state', '$scope', 'categoryService', 'promiseTracker', '$mdDialog', function ($state, $scope, categoryService, promiseTracker, $mdDialog) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};
    $scope.selectedCategory = {};
    $scope.croppedThumbnail = '';

    /**
     * Laadt alle categorieën en voegt ze toe aan de scope
     * @param  {boolean} transition Achterna terug naar lijst navigeren?
     * @return {void}            
     */
    var _loadCategories = function(transition) {
        categoryService.getCategories().then(function(categories) {
            $scope.categories = categories;

            if(transition) {
                $state.go('admin.category.list');
            }
        }, function(err) {
            console.log(err);
        });
    };
    _loadCategories();

    /**
     * Past een categorie aan
     * @param  {object} categoryModel    Een object met alle nodige attributen
     * @param  {string} croppedThumbnail De afbeelding als data URI
     * @return {void}                  
     */
    var _submitEdit = function(categoryModel, croppedThumbnail) {
        if(!categoryModel) {
            return undefined;
        }

        // Voegt de afbeelding toe aan het model
        categoryModel.photo_url = croppedThumbnail;

        var editPromise = categoryService.updateCategory(categoryModel, categoryModel.id).then(function(response) {
            $scope.errors = {};

            // Laad de categorieën opnieuw en navigeert naar de lijst
            _loadCategories(true);
        }, function(err) {
            // Voeg alle foutmeldingen toe aan de scope
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    /**
     * Voegt een nieuwe categorie toe
     * @param  {object} categoryModel    Een object met alle nodige attributen
     * @param  {string} croppedThumbnail De afbeelding als data URI
     * @return {void}                  
     */
    var _submitNew = function(categoryModel, croppedThumbnail) {
        if(!categoryModel) {
            return undefined;
        }

        // Voegt de afbeelding toe aan het model
        categoryModel.photo_url = croppedThumbnail;

        var addPromise = categoryService.addCategory(categoryModel).then(function(response) {
            $scope.errors = {};
            // Laad de categorieën opnieuw en navigeert naar de lijst
            _loadCategories(true);
        }, function(err) {
            // Voeg alle foutmeldingen toe aan de scope
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    }

    /**
     * Verwijdert een categorie na bevestiging via dialoog
     * @param  {object} categoryModel Een object met alle nodige attributen
     * @return {void}               
     */
    var _deleteCategory = function(categoryModel) {
        // Maak een dialoogvenster via de builder
        var confirm = $mdDialog.confirm()
                    .title(categoryModel.name + ' verwijderen?')
                    .content('Weet je zeker dat je ' + categoryModel.name + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        // Toon het dialoogvenster en bij bevestiging wordt de categorie verwijderd
        $mdDialog.show(confirm).then(function() {
            categoryService.deleteCategory(categoryModel.id).then(function() {
                // Laad de categorieën opnieuw
                _loadCategory();
            }, function(err) {
                console.log(err);
            });
        });
    };

    // Voeg de methoden toe aan de scope
    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteCategory = _deleteCategory;
  }]);