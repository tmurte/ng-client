(function(){

    angular
        .module('ClientApp')
        .controller('ClientLoginCtrl', [
            '$scope', '$state', '$http', 'toastr', 'gettextCatalog', 'gettext', 'UserService',
            ClientLoginCtrl
        ]);

    /**
     * Login Controller for the Client module
     */
    function ClientLoginCtrl($scope, $state, $http, toastr, gettextCatalog, gettext, UserService) {
        $scope.isLoggingIn = false;
        $scope.pwForgotMode = false;
        $scope.user = {
            'email': null,
            'password': null
        };

        $scope.passwordForgotten = function () {
            $scope.pwForgotMode = true;
        };

        $scope.passwordForgottenImpl = function () {
            $http.post('api/admin/passwords', {email: $scope.user.email}).then(function (data) {
                toastr.success(gettext("The password reset request has been sent successfully. You will receive a mail shortly with information on how to reset your account password."));
                $scope.returnToLogin();
            });
        };

        $scope.returnToLogin = function () {
            $scope.pwForgotMode = false;
        };

        $scope.login = function () {
            $scope.isLoggingIn = true;

            UserService.authenticate($scope.user.email, $scope.user.password).then(
                function () {
                    $state.transitionTo('main.project');
                },

                function (revoked) {
                    $scope.isLoggingIn = false;
                    if (!revoked) {
                        toastr.warning(gettext('Your e-mail address or password is invalid, please try again.'));
                    }
                }
            );
        }
    }

})();
