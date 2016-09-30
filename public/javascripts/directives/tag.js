app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : '40px, 40px'
            });
        });
    };
});

app.directive('ckEditor', function() {
  return {
    require : '?ngModel',
    link : function($scope, elm, attr, ngModel) {

        var ck = CKEDITOR.replace(elm[0]);
        ck.on('dialogDefinition', function (ev) {
            var dialogName = ev.data.name;
            var dialog = ev.data.definition.dialog;
            var dialogDefinition = ev.data.definition;

            if (dialogName == 'image') {
                dialog.on('show', function (obj) {
                this.selectPage('Upload'); //업로드텝으로 시작
                });
                dialogDefinition.removeContents('advanced'); // 자세히탭 제거
                dialogDefinition.removeContents('Link'); // 링크탭 제거
            };
        });

        ck.on('instanceReady', function() {
            ck.setData(ngModel.$viewValue);
        });

        ck.on('pasteState', function() {
            $scope.$apply(function() {
                ngModel.$setViewValue(ck.getData());
            });
        });

        // update ngModel on change
        ck.on('change', function () {
            ngModel.$setViewValue(ck.getData());
        });

        ngModel.$render = function(value) {
            ck.setData(ngModel.$modelValue);
        };
    }
  };
});