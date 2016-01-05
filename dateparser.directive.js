/*
 * DateParser directive
 *
 * Use this directive in form fields to implement the dateParser functionality.
 */

angular.module('dateParser')
    .directive('dateParser', ['dateFilter', '$dateParser', function(dateFilter, $dateParser) {

        'use strict';

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                var dateFormat;

                attrs.$observe('dateParser', function(value) {
                    dateFormat = value;
                    ngModel.$render();
                });

                scope.$watch(function() {
                    return $locale.id;
                },
                function(newValue, oldValue, scope) {
                    if (angular.isDefined(dateFormat)) {
                     ngModel.$render();
                    }
                });

                ngModel.$parsers.unshift(function(viewValue) {
                    var date = $dateParser(viewValue, dateFormat);

                    // Set validity when view value changes
                    ngModel.$setValidity('date', !viewValue || angular.isDate(date));

                    return date;
                });

                ngModel.$render = function() {
                    element.val(ngModel.$modelValue ? dateFilter(ngModel.$modelValue, dateFormat) : undefined);
                    scope.ngModel = ngModel.$modelValue;
                };

                // Format the new model value before it is displayed
                ngModel.$formatters.push(function(modelValue) {
                    // Set validity when model value changes
                    ngModel.$setValidity('date', !modelValue || angular.isDate(modelValue));

                    return angular.isDate(modelValue) ? dateFilter(modelValue, dateFormat) : '';
                });
            }
        };
    }]);
