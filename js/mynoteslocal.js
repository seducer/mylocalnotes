var app = angular.module('noteApp', ['LocalStorageModule','yaru22.angular-timeago']);

app.controller('NotesContoller', function($scope, localStorageService, nowTime) {
    $scope.notes = [{noteText: 'Привет! Это приложение заметок!', noteDate: Date.now(), color: '#7bd148'}];
    if (!localStorageService.isSupported) {
        $scope.storageType = 'Cookie';
    }
    
    if (localStorageService.get('notes')) {
        $scope.notes = localStorageService.get('notes');
    }
    $scope.buttonDisabled = false;
    
    $scope.save = function() {
        $scope.buttonDisabled = true;
        $scope.notes.unshift({noteText: $scope.note.noteText, noteDate: Date.now(), color: $scope.note.color});
        $scope.note = {};
        $scope.buttonDisabled = false;
    };
    
    $scope.$watch('notes', function(value){
        localStorageService.set('notes', value);
    }, true);
        
    $scope.destroy = function(noteId) {
        var noteIndex;
        noteIndex = $scope.notes[noteId];
        $scope.notes.splice(noteId, 1);
    };
}).directive('bsSelect', function ($parse) {
   return {
        restrict: "E",
        replace: true,
        
        compile: function (element, attrs) {
            var modelAccessor = $parse(attrs.ngModel);

            var html = "<select name=\"colorpicker-shortlist\" ng-model=\"note.color\" ng-options=\"color.name as color.value for color in colors\">" +
               "<option value=\"#fff\">White</option>"+
               "<option value=\"#7bd148\">Green</option>"+
               "<option value=\"#5484ed\">Bold blue</option>"+
               "<option value=\"#a4bdfc\">Blue</option>"+
               "<option value=\"#46d6db\">Turquoise</option>"+
               "<option value=\"#7ae7bf\">Light green</option>"+
               "<option value=\"#51b749\">Bold green</option>"+
               "<option value=\"#fbd75b\">Yellow</option>"+
               "<option value=\"#ffb878\">Orange</option>"+
               "<option value=\"#ff887c\">Red</option>"+
               "<option value=\"#dbadff\">Purple</option>"+
               "</select>";

            var newElem = $(html);
            element.replaceWith(newElem);

            return function (scope, element, attrs, controller) {
            
                var processChange = function () {
                    scope.$apply(function (scope) {
                         // Change bound variable
                         modelAccessor.assign(scope, $(element).val());
                    });
                };
                $(element).simplecolorpicker({theme: 'glyphicons'}).on('change', processChange);
                scope.$watch(modelAccessor, function (val) {
                    modelAccessor.assign(scope, $(element).val());
                });
            };
        }
   };
});

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('mynotes');
});