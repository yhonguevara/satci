import './SolicitudeController';
import './SolicitudeDirectives';
import './SolicitudeResources';
import './create/CreateSolicitudeModule';
import './assign/AssignSolicitudeModule';

angular.module('SATCI.Solicitude', [
  'ui.router', 
  'SATCI.Shared',
  'Solicitude.controller', 
  'Solicitude.directives', 
  'Solicitude.resources', 
  'Solicitude.Create',
  'Solicitude.Assign'])

.config(($authProvider, $stateProvider, PathTemplates) => {
  $stateProvider
  .state('solicitude', {
        url: '/solicitude',
        templateUrl: `${PathTemplates.views}solicitude/index.html`,
        controller: 'SolicitudeCtrl'
      })
  .state('solicitude.create', {
    url: '/create',
    templateUrl: `${PathTemplates.views}solicitude/create.html`,
    controller: 'CreateSolicitudeCtrl'
  })
  .state('solicitude.edit', {
    url: '/edit/:id',
    templateUrl: `${PathTemplates.views}solicitude/edit.html`,
    controller: 'SolicitudeCtrl'
  })
  .state('solicitude.assign', {
    url: '/assign/:id',
    templateUrl: `${PathTemplates.views}solicitude/assign.html`,
    controller: 'AssignSolicitudeCtrl'
  })
  .state('solicitude.show', {
    url: '/show/:id',
    templateUrl: `${PathTemplates.views}solicitude/show.html`,
    controller: 'AssignSolicitudeCtrl'
  })

})

