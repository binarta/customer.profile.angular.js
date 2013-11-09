describe('customer profile', function() {
    var ctrl;
    var scope;
    var rest;
    var usecaseAdapter;
    var presenter = {};
    var dispatcher;
    var dispatcherMock;

    beforeEach(module('customer.profile'));
    beforeEach(module('angular.usecase.adapter'));
    beforeEach(module('rest.client'));
    beforeEach(module('notifications'));
    beforeEach(inject(function($rootScope, usecaseAdapterFactory, restServiceHandler, topicMessageDispatcher, topicMessageDispatcherMock) {
        scope = $rootScope.$new();
        usecaseAdapter = usecaseAdapterFactory;
        usecaseAdapter.andReturn(presenter);
        rest = restServiceHandler;
        dispatcher = topicMessageDispatcher;
        dispatcherMock = topicMessageDispatcherMock;
    }));

    describe('CustomerProfileController', function() {
        var config;

        beforeEach(inject(function($controller) {
            config = {};
            ctrl = $controller(CustomerProfileController, {$scope: scope, config: config});
        }));

        function usecaseAdapterReceivesScope() {
            it('usecase adapter receives scope', function() {
                expect(usecaseAdapter.calls[0].args[0]).toEqual(scope);
            });
        }

        function restServiceGetsCalledWithPresenter() {
            it('rest service gets called with presenter', function() {
                expect(rest.calls[0].args[0]).toEqual(presenter);
            });
        }

        describe('on init', function() {
            beforeEach(function() {
                scope.init();
            });

            describe('without baseUri', function() {
                beforeEach(function() {
                    scope.init()
                });

                usecaseAdapterReceivesScope();

                it('params get populated on presenter', function () {
                    expect(presenter.params).toEqual({method: 'GET', url: 'api/customer', withCredentials:true});
                });
                restServiceGetsCalledWithPresenter();

                it('on success put payload on scope', function() {
                    usecaseAdapter.calls[0].args[1]({vat: 'vat'});
                    expect(scope.vat).toEqual('vat');
                });
            });

            describe('with baseUri', function() {
                beforeEach(function() {
                    config.baseUri = 'base-uri/'
                    scope.init();
                });

                it('params get populated on presenter', function () {
                    expect(presenter.params).toEqual({method: 'GET', url: 'base-uri/api/customer', withCredentials:true});
                });
            });
        });

        describe('on submit', function() {
            beforeEach(function() {
                scope.vat = 'vat';
            });

            describe('without baseUri', function() {
                beforeEach(function() {
                    scope.submit();
                });

                usecaseAdapterReceivesScope();
                it('params get populated on presenter', function () {
                    expect(presenter.params).toEqual({method: 'POST', url: 'api/customer', data: {vat: scope.vat}, withCredentials:true});
                });
                restServiceGetsCalledWithPresenter();

                it('on success put payload on scope', function() {
                    usecaseAdapter.calls[0].args[1]();
                    expect(dispatcherMock['system.success']).toEqual({code:'customer.profile.update.success', default:'Profile was successfully updated'});
                });
            });

            describe('with baseUri', function() {
                beforeEach(function() {
                    config.baseUri = 'base-uri/';
                    scope.submit();
                });

                it('params get populated on presenter', function () {
                    expect(presenter.params).toEqual({method: 'POST', url: 'base-uri/api/customer', data: {vat: scope.vat}, withCredentials:true});
                });
            });

        })
    });

});
