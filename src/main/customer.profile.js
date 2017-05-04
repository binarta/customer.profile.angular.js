angular.module('customer.profile', ['angular.usecase.adapter', 'rest.client', 'config', 'notifications'])
    .controller('CustomerProfileController', ['$scope', 'usecaseAdapterFactory', 'restServiceHandler', 'config', 'topicMessageDispatcher', CustomerProfileController]);

function CustomerProfileController($scope, usecaseAdapterFactory, restServiceHandler, config, topicMessageDispatcher) {
    $scope.init = function() {
        var baseUri = config.baseUri || '';
        var onSuccess = function(payload) {
            ['vat'].forEach(function(it) {
                $scope[it] = payload[it];
            });
        };
        var presenter = usecaseAdapterFactory($scope, onSuccess);
        presenter.params = {
            method: 'POST',
            url: baseUri + 'api/view-customer-profile',
            withCredentials:true
        };
        restServiceHandler(presenter)
    };

    $scope.submit = function() {
        var baseUri = config.baseUri || '';
        var onSuccess = function() {
            topicMessageDispatcher.fire('system.success', {code:'customer.profile.update.success', default:'Profile was successfully updated'})
        };
        var presenter = usecaseAdapterFactory($scope, onSuccess);
        presenter.params = {
            method: 'POST',
            url: baseUri + 'api/customer',
            data: {vat: $scope.vat},
            withCredentials:true
        };
        restServiceHandler(presenter);
    }
}