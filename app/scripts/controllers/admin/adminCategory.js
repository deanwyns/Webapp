'use strict';

angular.module('joetzApp').controller('AdminCategoryCtrl', ['$state', '$scope', 'categoryService', 'promiseTracker', '$mdDialog', function ($state, $scope, categoryService, promiseTracker, $mdDialog) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};
    $scope.selectedCategory = {};
    $scope.croppedThumbnail = '';

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

    var _submitEdit = function(categoryModel, croppedThumbnail) {
        if(!categoryModel) {
            return undefined;
        }

        categoryModel.photo_url = croppedThumbnail;

        var editPromise = categoryService.updateCategory(categoryModel, categoryModel.id).then(function(response) {
            $scope.errors = {};
            _loadCategories(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    var _submitNew = function(categoryModel, croppedThumbnail) {
        if(!categoryModel) {
            return undefined;
        }

        categoryModel.photo_url = croppedThumbnail;

        var addPromise = categoryService.addCategory(categoryModel).then(function(response) {
            $scope.errors = {};
            _loadCategories(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    }

    var _deleteCategory = function(categoryModel) {
        var confirm = $mdDialog.confirm()
                    .title(categoryModel.name + ' verwijderen?')
                    .content('Weet je zeker dat je ' + categoryModel.name + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        $mdDialog.show(confirm).then(function() {
            categoryService.deleteCategory(categoryModel.id).then(function() {
                _loadCategory();
            }, function(err) {
                console.log(err);
            });
        });
    };

    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteCategory = _deleteCategory;
  }]);